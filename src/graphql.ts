import { gql } from '@apollo/client/core/index.js'

export const ListJiraIssues = gql`
  query ListJiraIssues {
    tasks {
      key
      id
      title
      webURL
    }
  }
`

export const ConfigureAccount = gql`
  mutation ConfigureAccount($input: AccountConfigInput!) {
    configureAccount(input: $input)
  }
`

export const Issue = gql`
  query Task($taskId: String!) {
    task(id: $taskId) {
      key
      id
      title
      webURL
    }
  }
`

export const WorkBranchNames = gql`
  query WorkBranchNames($taskId: String!, $repo: String!) {
    workBranchNames(taskId: $taskId, repo: $repo)
  }
`

export const SearchPullRequest = gql`
  query SearchPullRequest($repoName: String!, $keywordInTitle: String!) {
    github {
      searchPullRequest(repoName: $repoName, keywordInTitle: $keywordInTitle) {
        title
        number
        state
        createdAt
        head
        base
      }
    }
  }
`

export const StartTask = gql`
  mutation StartTask(
    $issueId: String!
    $repo: String!
    $base: String!
    $head: String!
  ) {
    startTask(issueId: $issueId, repo: $repo, base: $base, head: $head)
  }
`

export const EndTask = gql`
  mutation EndTask(
    $issueId: String!
    $repo: String!
    $base: String!
    $head: String!
  ) {
    endTask(issueId: $issueId, repo: $repo, base: $base, head: $head)
  }
`
