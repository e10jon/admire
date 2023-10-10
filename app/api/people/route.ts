import { Result as WikidataPerson, query } from '@/app/server/wikidata-api'
import { differenceInMinutes } from 'date-fns'
import { prisma } from '@/app/server/prisma'

export type Result = WikidataPerson & { isCustom?: boolean }

export async function GET(request: Request) {
  let people: Result[] = []
  const respond = () => Response.json({ people })

  const url = new URL(request.url)
  const name = url.searchParams.get('name')
  if (!name) return respond()

  // search DB for wikidata query
  let searchRow = await prisma.wikidataSearch.findFirst({ where: { query: name } })

  // if no query, or query is older than 1 hour, search API and store results
  if (!searchRow || differenceInMinutes(searchRow.updatedAt, new Date()) > 60) {
    const apiResult = await query(name)
    searchRow = searchRow
      ? await prisma.wikidataSearch.update({ where: { query: name }, data: { results: apiResult } })
      : await prisma.wikidataSearch.create({ data: { query: name, results: apiResult } })
  }

  // find or create the wikidataPeople
  const existingWikidataPeopleRows = await prisma.wikidataPerson.findMany({
    where: { id: { in: searchRow.resultsParsed.map((p) => p.id) } },
  })
  people = people.concat(existingWikidataPeopleRows.map((r) => ({ ...r, isCustom: false })))
  const existingIds = existingWikidataPeopleRows.map((r) => r.id)
  const newWikidataPeopleRows = await Promise.all(
    searchRow.resultsParsed.filter((r) => !existingIds.includes(r.id)).map((data) => prisma.wikidataPerson.create({ data }))
  )
  people = people.concat(newWikidataPeopleRows.map((r) => ({ ...r, isCustom: false })))

  // add custom people
  const customPeopleRows = await prisma.customPerson.findMany({
    where: { name: { startsWith: name } },
    take: 100,
    orderBy: { listEntriesCount: 'asc' },
  })
  people = people.concat(customPeopleRows.map((r) => ({ ...r, isCustom: true })))

  return respond()
}
