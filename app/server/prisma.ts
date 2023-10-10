import { PrismaClient } from '@prisma/client'
import { env } from './env'
import { resultSchema } from './wikidata-api'
import { z } from 'zod'

export const prisma = new PrismaClient({
  log: env.nodeEnv === 'development' ? ['query', 'error', 'warn'] : ['error'],
}).$extends({
  name: 'wikidataSearchResultsParsed',
  result: {
    wikidataSearch: {
      resultsParsed: {
        needs: { results: true },
        compute(wikidataSearch) {
          return z.array(resultSchema).parse(wikidataSearch.results)
        },
      },
    },
  },
})
