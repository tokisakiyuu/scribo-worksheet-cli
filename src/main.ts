#!/usr/bin/env node
import { program } from 'commander'
import * as command from './command.js'
import path from 'path'
import { currentGitBranchName, tryCurrentGitBaseBranchName } from './utils.js'

program.name('scribo')

program
  .command('ls')
  .description('list all jira issues')
  .action(() => command.ls())

program
  .command('open')
  .description('open issue url in the browser')
  .argument('<key>', 'jira issue key')
  .action(key => command.open(key))

program
  .command('start')
  .description('start a task')
  .argument('<key>', 'jira issue key. like DEV-999')
  .option('--repo <repo>', 'which github repo', path.basename(process.cwd()))
  .option(
    '--base <base>',
    'which branch is the new branch based on',
    tryCurrentGitBaseBranchName('staging'),
  )
  .option('--head <head>', 'new branch name')
  .action(command.start)

program
  .command('end')
  .description('end a task')
  .argument('<key>', 'jira issue key. like DEV-999')
  .option('--repo <repo>', 'which github repo', path.basename(process.cwd()))
  .option(
    '--base <base>',
    'which branch is the new branch based on',
    tryCurrentGitBaseBranchName('staging'),
  )
  .option('--head <head>', 'new branch name', currentGitBranchName())
  .action(command.end)

program
  .command('init')
  .description('init your client')
  .argument('<token>', 'your token')
  .action(command.saveToken)

program.parse()
