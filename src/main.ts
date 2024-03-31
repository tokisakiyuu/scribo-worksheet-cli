#!/usr/bin/env node
import { program } from 'commander'

program.name('scribo').version('1.0.0')

program
  .command('ls')
  .description('list all jira issues')
  .action((_str, _options) => {
    console.log('列出所有jira任务')
  })

program
  .command('start')
  .description('start a task')
  .argument('<key>', 'jira issue key. like DEV-999')
  .option('--repo <repo>', 'which github repo')
  .option('--base <base>', 'which branch is the new branch based on')
  .option('--head <head>', 'new branch name')
  .action((key, options) => {
    console.log(key, options)
  })

program
  .command('end')
  .description('end a task')
  .argument('<key>', 'jira issue key. like DEV-999')
  .option('--repo <repo>', 'which github repo')
  .option('--base <base>', 'which branch is the new branch based on')
  .option('--head <head>', 'new branch name')
  .action((key, options) => {
    console.log(key, options)
  })

program
  .command('login')
  .description('login with your token')
  .argument('<token>', 'your token')
  .action(token => {
    console.log(token)
  })

program.parse()
