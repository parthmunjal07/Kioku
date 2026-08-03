// Returns true if ancestorHash is an ancestor of descendantHash
export function isAncestor(ancestorHash, descendantHash, store) {
  const stack = [descendantHash]
  const visited = new Set()

  while (stack.length) {
    const hash = stack.pop()

    if (visited.has(hash)) continue;
    visited.add(hash)

    if (hash === ancestorHash) return true

    const commit = store.get(hash)
    if (!commit) continue

    stack.push(...commit.parents)
  }
  return false
}

export function collectAncestors(startHash, store) {
    const visited = new Set();
    const stack = [startHash];

    while (stack.length) {
        const hash = stack.pop();

        if (visited.has(hash)) continue;
        visited.add(hash);

        const commit = store.get(hash);
        if (!commit) continue;

        for (const parent of commit.parents) {
          stack.push(parent);
        }
    }

    return visited;
}

export function mergeBase(hashA, hashB, store) {
  const ancestorsA = collectAncestors(hashA, store)

  const stack = [hashB]
  const visited = new Set()

  while (stack.length) {
    const hash = stack.pop()

    if (visited.has(hash)) continue
    visited.add(hash)

    if (ancestorsA.has(hash)) return hash

    const commit = store.get(hash)
    if (!commit) continue

    stack.push(...commit.parents)
  }
  return null
}

export function canReach(fromHash, toHash, store) {
  const stack = [fromHash];
  const visited = new Set();

  while (stack.length) {
    const hash = stack.pop()

    if (visited.has(hash)) continue
    visited.add(hash)

    if (hash === toHash) return true

    const commit = store.get(hash)
    if (!commit) continue

    stack.push(...commit.parents)
  }

  return false
}

export function aheadBehind(branchA, branchB, store) {
  const ancestorsA = collectAncestors(branchA, store);
  const ancestorsB = collectAncestors(branchB, store);

  let ahead = 0;
  let behind = 0;

  for (const hash of ancestorsA) {
    if (!ancestorsB.has(hash)) {
      ahead++;
    }
  }

  for (const hash of ancestorsB) {
      if (!ancestorsA.has(hash)) {
          behind++;
      }
  }

  return { ahead, behind };
}

export function findChildren(hash, store) {
  const children = [];

  for (const commit of store.values()) {
    if (commit.parents.includes(hash)) {
      children.push(commit.hash);
    }
  }

  return children;
}

export function detectCycle(store) {
  const color = new Map()

  function dfs(hash) {
    const state = color.get(hash) ?? 0
    if (state === 1) return true
    if (state === 2) return false

    color.set(hash, 1)
    const commit = store.get(hash)
    if (commit) {
      for (const parent of commit.parents) {
        if (dfs(parent)) return true
      }
    }

    color.set(hash, 2)
    return false
  }

  for (const hash of store.keys()) {
    if ((color.get(hash) ?? 0) === 0) {
      if (dfs(hash)) return true
    }
  }

  return false
}

export function topologicalSort(store) {
  const childCount = new Map();

  for (const hash of store.keys()) {
    childCount.set(hash, 0);
  }

  for (const commit of store.values()) {
    for (const parent of commit.parents) {
      childCount.set(
        parent,
        (childCount.get(parent) ?? 0) + 1);
    }
  }

  const queue = [];

  // Branch tips (no children)
  for (const [hash, count] of childCount) {
    if (count === 0) {
        queue.push(hash);
    }
  }

  const order = [];

  while (queue.length) {
    const hash = queue.shift();
      order.push(hash);

      const commit = store.get(hash);
      if (!commit) continue;

      for (const parent of commit.parents) {
        childCount.set(parent, childCount.get(parent) - 1);

        if (childCount.get(parent) === 0) {
            queue.push(parent);
        }
      }
    }
  return order;
}
