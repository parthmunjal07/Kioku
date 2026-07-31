import fs from "node:fs/promises";

export class Refs {
  constructor(paths) {
    this.paths = paths;
  }

  // Reads .kioku/HEAD
  async getHead() {
    const head = await fs.readFile(
      this.paths.getHeadPath(),
      "utf8"
    );

    return head.trim();
  }

  // Returns "main" from:
  // ref: refs/heads/main
  async getCurrentBranch() {
    const head = await this.getHead();

    if (!head.startsWith("ref: ")) {
      throw new Error("Detached HEAD not supported yet.");
    }

    return head.replace(
      "ref: refs/heads/",
      ""
    );
  }

  // Reads the hash stored in a branch.
  async getBranchHash(branch) {
    const hash = await fs.readFile(
      this.paths.getBranchPath(branch),
      "utf8"
    );

    return hash.trim();
  }

  // Updates a branch to point to a commit.
  async updateBranch(branch, hash) {
    await fs.writeFile(
      this.paths.getBranchPath(branch),
      hash
    );
  }

  // Creates a new branch.
  async createBranch(branch, hash = "") {
    await this.updateBranch(
      branch,
      hash
    );
  }

  // Returns true if branch exists.
  async branchExists(branch) {
    try {
      await fs.access(
        this.paths.getBranchPath(branch)
      );

      return true;
    } catch {
      return false;
    }
  }

  // Returns the commit pointed to by HEAD.
  async getHeadCommit() {
    const branch =
      await this.getCurrentBranch();

    return this.getBranchHash(branch);
  }

  // Move HEAD's branch to a new commit.
  async updateHead(hash) {
    const branch =
      await this.getCurrentBranch();

    await this.updateBranch(
      branch,
      hash
    );
  }
}
