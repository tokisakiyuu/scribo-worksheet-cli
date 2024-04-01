import * as apolloClientPkg from '@apollo/client/core/index.js'
import { homedir } from 'node:os'
import fs from 'node:fs'
import { Command } from 'commander'

const { ApolloClient, InMemoryCache } = apolloClientPkg
const tokenFilePath = `${homedir()}/.config/scribo-worksheet/token`

export function createApolloClient() {
  if (!fs.existsSync(tokenFilePath)) {
    const command = new Command()
    const result = command.parse(process.argv)
    if (result.args.at(0) !== 'init') {
      console.log('Please init first:\n     scribo init <token>')
    }
    process.exit()
  }

  return new ApolloClient({
    uri: 'https://scribo-worksheet.tokisakiyuu.com/api_v2/graphql',
    cache: new InMemoryCache(),
    headers: {
      Authorization: `Bearer ${fs.readFileSync(tokenFilePath).toString()}`,
    },
  })
}
