import { inspect } from 'util'

export const query = async (name: string) => {
  const sparqlQuery = `SELECT (SAMPLE(?item) as ?item) (SAMPLE(?itemLabel) as ?itemLabel) (SAMPLE(?itemDescription) as ?itemDescription) (MIN(?image) as ?mainImage) WHERE {
  SERVICE wikibase:mwapi {
    bd:serviceParam wikibase:api "EntitySearch" .
    bd:serviceParam wikibase:endpoint "www.wikidata.org" .
    bd:serviceParam mwapi:search "${name}" .
    bd:serviceParam mwapi:language "en" .
    ?item wikibase:apiOutputItem mwapi:item 
  }
  ?item wdt:P31 wd:Q5 .
  ?item wdt:P18 ?image
          
  SERVICE wikibase:label { 
    bd:serviceParam wikibase:language "en" .
    ?item rdfs:label ?itemLabel .
    ?item schema:description ?itemDescription
  }
} 
GROUP BY ?item
LIMIT 20`

  const fullUrl = 'https://query.wikidata.org/sparql' + '?query=' + encodeURIComponent(sparqlQuery)
  const headers = { Accept: 'application/sparql-results+json' }

  const result = (await fetch(fullUrl, { headers }).then((body) => body.json())) as {
    results: {
      bindings: {
        item: { value: string }
        itemLabel: { value: string }
        itemDescription?: { value: string }
        mainImage?: { value: string }
      }[]
    }
  }

  return result.results.bindings.map((b) => ({
    id: Number(b.item.value.match(/\/Q(.+?)$/)?.[1]),
    name: b.itemLabel?.value,
    description: b.itemDescription?.value,
    imageUrl: b.mainImage?.value,
  }))
}

const deepLog = (data: unknown) => console.log(inspect(data, false, null, true))

query('jay-z').then(deepLog)
