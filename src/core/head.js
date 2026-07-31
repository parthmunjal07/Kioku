import fs from "node:fs/promises";

export class Head {
  constructor(paths) {
    this.paths = paths;
  }

  /**
   * Read the HEAD file.
   *
   * Examples:
   * "ref: refs/heads/main"
   * "a81cd91..." (detached HEAD)
   */
  async read() {
    const head = await fs.readFile(
      this.paths.getHeadPath(),
      "utf8"
    );

    return head.trim();
  }

  // Overwrite HEAD.
  async write(value) {
    await fs.writeFile(
      this.paths.getHeadPath(),
      value
    );
  }

  // Returns true if HEAD points to a branch.
  async isSymbolic() {
    const head = await this.read();

    return head.startsWith("ref: ");
  }

  // Returns: refs/heads/main
  async getRef() {
    const head = await this.read();

    if (!head.startsWith("ref: ")) {
      throw new Error(
        "HEAD is detached."
      );
    }

    return head.slice(5);
  }

  // Returns: main
  async getCurrentBranch() {
    const ref = await this.getRef();

    return ref.replace(
      "refs/heads/",
      ""
    );
  }

  // Make HEAD point to a branch.
  async pointToBranch(branch) {
    await this.write(
      `ref: refs/heads/${branch}`
    );
  }

  // Detached HEAD.
  async detach(commitHash) {
    await this.write(commitHash);
  }
}
