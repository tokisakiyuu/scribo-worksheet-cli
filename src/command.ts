import { createApolloClient } from './apollo-client.js'
import { ListJiraIssues } from './graphql.js'
import { default as openx, apps } from 'open'
import fs from 'node:fs'
import { homedir } from 'node:os'
import path from 'node:path'

const tokenFilePath = `${homedir()}/.config/scribo-worksheet/token`

export async function ls() {
  const client = createApolloClient()
  const res = await client.query({
    query: ListJiraIssues,
  })

  console.log(
    res.data.tasks.map((task: any) => `${task.key} ${task.title}`).join('\n'),
  )
}

export async function open(key: string) {
  const client = createApolloClient()
  const res = await client.query({
    query: ListJiraIssues,
  })

  const target = res.data.tasks.find((task: any) => task.key === key)
  if (!target) {
    console.error(`issue ${key} not found.`)
  }
  await openx(target.webURL, {
    app: { name: apps.browser },
  })
}

export async function start(key: string, options: Record<string, string>) {
  console.log(key, options)
}

export async function end(key: string, options: Record<string, string>) {
  console.log(key, options)
}

export function saveToken(token: string) {
  const dir = path.dirname(tokenFilePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(tokenFilePath, token.trim())
}
