import { Result, query } from '@/app/server/wikidata-api'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const name = url.searchParams.get('name')

  let people: Result = []

  if (name) {
    people = await query(name)
  }

  return Response.json({ people })
}
