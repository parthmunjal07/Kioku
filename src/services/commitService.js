import { Commit } from "../objects/commit.js";

export async function commitService(
  repository,
  { message, author }
) {
  const currentBranch =
    await repository.head.getCurrentBranch();

  let parent = null;

  try {
    parent = await repository.refs.getBranchHash(
      currentBranch
    );

    if (!parent) {
      parent = null;
    }
  } catch {
    parent = null;
  }

  const rootTreeHash =
    await repository.treeBuilder.build();

  const commit = new Commit(
    repository.objectStore,
    {
      tree: rootTreeHash,
      parents: parent ? [parent] : [],
      author,
      committer: author,
      timestamp: Date.now(),
      message
    }
  );

  const commitHash =
    await commit.save();

  await repository.refs.updateBranch(
    currentBranch,
    commitHash
  );

  await repository.index.clear();

  return commitHash;
}
