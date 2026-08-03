import { Commit } from "../objects/commit.js";

export async function logService(repository) {
  const branch =
    await repository.head.getCurrentBranch();

  let currentHash =
    await repository.refs.getBranchHash(branch);

  if (!currentHash) {
    console.log("No commits yet.");
    return;
  }

  const commits = [];

  while (currentHash) {
    const commit = await Commit.load(
      repository.objectStore,
      currentHash
    );

    commits.push({
      hash: currentHash,
      message: commit.getMessage(),
      author: commit.getAuthor(),
      timestamp: commit.getTimestamp()
    });

    const parents = commit.getParents();

    currentHash =
      parents.length > 0 ? parents[0] : null;
  }

  return commits;
}
