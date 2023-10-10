import { Result as WikidataPerson, query } from '@/app/server/wikidata-api'
import { differenceInMinutes } from 'date-fns'
import { prisma } from '@/app/server/prisma'

export type Result = WikidataPerson & { isCustom?: boolean }

export async function GET(request: Request) {
  let people: Result[] = []
  const addPeople = (newPeople: Result[], isCustom: boolean) => {
    people = people.concat(newPeople.map((r) => ({ ...r, isCustom })))
  }
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
  addPeople(existingWikidataPeopleRows, false)
  const existingIds = existingWikidataPeopleRows.map((r) => r.id)
  const newWikidataPeopleRows = await Promise.all(
    searchRow.resultsParsed.filter((r) => !existingIds.includes(r.id)).map((data) => prisma.wikidataPerson.create({ data }))
  )
  addPeople(newWikidataPeopleRows, false)

  // add custom people
  const customPeopleRows = await prisma.customPerson.findMany({
    where: { name: { startsWith: name } },
    orderBy: { listEntriesCount: 'asc' },
    take: 100,
  })
  addPeople(customPeopleRows, true)

  return respond()
}
