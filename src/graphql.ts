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
