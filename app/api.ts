import { inspect } from 'util'

class SPARQLQueryDispatcher {
  constructor(private endpoint: string) {}

  query(sparqlQuery: string) {
    const fullUrl = this.endpoint + '?query=' + encodeURIComponent(sparqlQuery)
    const headers = { Accept: 'application/sparql-results+json' }

    return fetch(fullUrl, { headers }).then((body) => body.json())
  }
}

const endpointUrl = 'https://query.wikidata.org/sparql'
const sparqlQuery = `SELECT DISTINCT ?item ?itemLabel ?itemDescription ?image WHERE {
  SERVICE wikibase:mwapi {
      bd:serviceParam wikibase:api "EntitySearch" .
      bd:serviceParam wikibase:endpoint "www.wikidata.org" .
      bd:serviceParam mwapi:search "michelle obama" .
      bd:serviceParam mwapi:language "en" .
      ?item wikibase:apiOutputItem mwapi:item .
  }
  ?item wdt:P31 wd:Q5 ;
  OPTIONAL {?item wdt:P18 ?image}
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
} LIMIT 20`

const deepLog = (data: unknown) => console.log(inspect(data, false, null, true))
const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl)
queryDispatcher.query(sparqlQuery).then(deepLog)
