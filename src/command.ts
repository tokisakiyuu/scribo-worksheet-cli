import chalk from 'chalk'
import fs from 'node:fs'
import { homedir } from 'node:os'
import path from 'node:path'
import { apps, default as openx } from 'open'
import ora from 'ora'
import prompts from 'prompts'
import { createApolloClient } from './apollo-client.js'
import {
  ConfigureAccount,
  EndTask,
  Issue,
  ListJiraIssues,
  SearchPullRequest,
  StartTask,
  WorkBranchNames,
} from './graphql.js'
import { checkoutFromRemoteBranch } from './utils.js'

const tokenFilePath = `${homedir()}/.config/scribo-worksheet/token`
const spinner = ora()

function startLoading(text?: string) {
  spinner.text = text ?? 'Loading'
  spinner.start()
}

function endLoading() {
  spinner.stop()
}

export async function ls() {
  const client = createApolloClient()
  startLoading()
  const res = await client.query({
    query: ListJiraIssues,
  })
  endLoading()

  console.log(
    res.data.tasks.map((task: any) => `${task.key} ${task.title}`).join('\n'),
  )
}

export async function open(key: string) {
  const client = createApolloClient()
  startLoading('Processing')
  const res = await client.query({
    query: ListJiraIssues,
  })

  const target = res.data.tasks.find((task: any) => task.key === key)
  if (!target) {
    console.error(`issue ${key} not found.`)
  }
  endLoading()
  await openx(target.webURL, {
    app: { name: apps.browser },
  })
}

interface IssueToggleParams {
  repo: string
  base: string
  head?: string
}

async function getIssueTitle(key: string) {
  const client = createApolloClient()
  const res = await client.query({
    query: Issue,
    variables: { taskId: key },
  })
  return res.data.task.title
}

async function getWorkBranchs(key: string, repo: string) {
  const client = createApolloClient()
  const res = await client.query({
    query: WorkBranchNames,
    variables: {
      taskId: key,
      repo,
    },
  })
  return res.data.workBranchNames
}

function makeBranchName(title: string) {
  return title
    .replace(/[^a-zA-Z\s]/g, '')
    .split(/\s+/)
    .slice(0, 8)
    .join('-')
    .toLowerCase()
}

async function getOpendPR(repo: string, key: string) {
  const client = createApolloClient()
  const res = await client.query({
    query: SearchPullRequest,
    variables: {
      repoName: repo,
      keywordInTitle: key,
    },
  })
  const result = res.data.github.searchPullRequest as any[]
  return result
    .filter(item => item.state === 'open')
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .at(0)
}

async function getIssueWorkBranchName(repo: string, key: string) {
  // 检查有没有已经打开的PR，有的话就获取那个PR对应的head分支名
  const opendPR = await getOpendPR(repo, key)
  if (opendPR) return opendPR.head
  // 如果没有打开的PR，就使用一个新的head分支名
  const branchs = await getWorkBranchs(key, repo)
  const stage = branchs.length
  return `${key}-${stage ? `${stage}-` : ''}${makeBranchName(await getIssueTitle(key))}`
}

export async function start(key: string, options: IssueToggleParams) {
  const { repo, base, head } = options
  const client = createApolloClient()
  startLoading('Processing')
  const branchName = head || (await getIssueWorkBranchName(repo, key))
  await client.mutate({
    mutation: StartTask,
    variables: {
      issueId: key,
      repo,
      base,
      head: branchName,
    },
  })
  endLoading()
  // 切换到对应分支
  checkoutFromRemoteBranch(branchName)
  console.log(
    `${chalk.green('✅ OK')} Now switched to the working branch ${chalk.blue(branchName)}.`,
  )
}

export async function end(key: string, options: IssueToggleParams) {
  const { repo, base, head } = options
  const client = createApolloClient()
  startLoading('Processing')
  await client.mutate({
    mutation: EndTask,
    variables: {
      issueId: key,
      repo,
      base,
      head,
    },
  })
  endLoading()
  // 切换到base分支
  checkoutFromRemoteBranch(base)
  console.log(
    `${chalk.green('✅ OK')} Now switched to the base branch ${chalk.blue(base)}.`,
  )
}

export async function setup() {
  const { token, atlassian_app_token, github_access_token } = await prompts([
    {
      type: 'text',
      name: 'token',
      message: 'Your app token',
    },
    {
      type: 'text',
      name: 'atlassian_app_token',
      message: 'Your atlassian app token',
    },
    {
      type: 'text',
      name: 'github_access_token',
      message: 'Your github access token',
    },
  ])
  saveAppToken(token)
  const client = createApolloClient()
  startLoading()
  await client.mutate({
    mutation: ConfigureAccount,
    variables: {
      input: {
        atlassian_app_token,
        github_access_token,
      },
    },
  })
  endLoading()
}

function saveAppToken(token: string) {
  const dir = path.dirname(tokenFilePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(tokenFilePath, token.trim())
}
