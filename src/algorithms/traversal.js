// dfs for git graph traversal
export function* walkGraphCommit(startHash, commits) {
  const stack = [startHash]
  const visited = new Set()

  while (stack.length) {
    const hash = stack.pop()
    if (visited.has(hash)) continue;
    visited.add(hash)

    const commit = commits.get(hash)
    if (!commit) continue

    yield commit;

    for (let i = commit.parents.length - 1; i>=0 ; i--) {
      stack.push(commit.parents[i])
    }
  }
}

// bfs for git graph traversal
export function* walkGraphCommitBFS(startHash, commits) {
  const queue = [startHash]
  const visited = new Set()

  while (queue.length) {
    const hash = queue.shift();

    if (visited.has(hash)) continue
    visited.add(hash)

    const commit = commits.get(hash)
    if (!commit) continue

    yield commit

    for (const parent of commit.parents) {
      queue.push(parent)
    }
  }
}
