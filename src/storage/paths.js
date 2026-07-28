import path from "node:path";

const KIROKU_DIR = ".kiroku";

export class PathManager {
  constructor(repositoryRoot) {
    this.root = repositoryRoot;
  }

  // Repository Root
  getRepositoryRoot() {
    return this.root;
  }

  // .kiroku/
  getKirokuDir() {
    return path.join(this.root, KIROKU_DIR);
  }

  // .kiroku/objects/
  getObjectsDir() {
    return path.join(this.getKirokuDir(), "objects");
  }

  // .kiroku/refs/
  getRefsDir() {
    return path.join(this.getKirokuDir(), "refs");
  }

  // .kiroku/refs/heads/
  getHeadsDir() {
    return path.join(this.getRefsDir(), "heads");
  }

  // .kiroku/refs/tags/
  getTagsDir() {
    return path.join(this.getRefsDir(), "tags");
  }

  // .kiroku/logs/
  getLogsDir() {
    return path.join(this.getKirokuDir(), "logs");
  }

  // .kiroku/index
  getIndexPath() {
    return path.join(this.getKirokuDir(), "index");
  }

  // .kiroku/HEAD
  getHeadPath() {
    return path.join(this.getKirokuDir(), "HEAD");
  }

  // .kiroku/config
  getConfigPath() {
    return path.join(this.getKirokuDir(), "config");
  }

  // .kiroku/objects/ab/cdef...
  getObjectPath(hash) {
    const directory = hash.slice(0, 2);
    const filename = hash.slice(2);

    return path.join(
      this.getObjectsDir(),
      directory,
      filename
    );
  }

  // .kiroku/refs/heads/main
  getBranchPath(branchName) {
    return path.join(
      this.getHeadsDir(),
      branchName
    );
  }

  // .kiroku/refs/tags/v1.0.0
  getTagPath(tagName) {
    return path.join(
      this.getTagsDir(),
      tagName
    );
  }
}
