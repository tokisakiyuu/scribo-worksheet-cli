import { execSync } from 'node:child_process'

export function currentGitBranchName() {
  return execSync('git name-rev --name-only HEAD').toString().trim()
}

export function currentGitBaseBranchName() {
  const currentBranch = currentGitBranchName()
  const logStr = execSync(
    `git reflog --date=local ${currentBranch} | tail -n 1`,
  )
    .toString()
    .trim()
  const matched = logStr.match(
    /^([a-z0-9]{7}) (\S+)@\{(.+)\}: branch: Created from refs\/heads\/(\S+)$/,
  )
  if (!matched) {
    throw new Error("Cannot get current git base branch name, maybe 'staging'?")
  }
  const [, _sha, cb, _date, baseBranch] = matched
  if (cb === currentBranch) {
    return baseBranch
  } else {
    throw new Error('Got a unexpected output when get base branch')
  }
}

export function getCurrentGitLocalBranchList() {
  const result = execSync('git branch --list').toString().trim()
  return result.split('\n').map(l => l.slice(2))
}

export function checkoutFromRemoteBranch(branchName: string) {
  const localBranches = getCurrentGitLocalBranchList()
  if (localBranches.includes(branchName)) {
    execSync(`git checkout ${branchName}`)
  } else {
    execSync(`git fetch`)
    execSync(`git checkout -b ${branchName} origin/${branchName}`)
  }
  execSync('git pull')
}
