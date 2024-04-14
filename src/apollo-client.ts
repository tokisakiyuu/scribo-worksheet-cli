import * as apolloClientPkg from '@apollo/client/core/index.js'
import { homedir } from 'node:os'
import fs from 'node:fs'
import memoize from 'memoizee'

const { ApolloClient, InMemoryCache } = apolloClientPkg
const tokenFilePath = `${homedir()}/.config/scribo-worksheet/token`

const getCachedToken = memoize(() => {
  if (!fs.existsSync(tokenFilePath)) return process.exit()
  return fs.readFileSync(tokenFilePath).toString()
})

export function createApolloClient() {
  return new ApolloClient({
    uri: 'https://scribo-worksheet.tokisakiyuu.com/api_v2/graphql',
    cache: new InMemoryCache(),
    headers: {
      Authorization: `Bearer ${getCachedToken()}`,
    },
  })
}
