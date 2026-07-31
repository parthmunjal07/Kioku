import fs from "node:fs/promises";
import path from "node:path";

export class Workspace {
  constructor(repositoryRoot) {
    this.root = repositoryRoot;

    // ginore these directories/files by default
    this.ignored = new Set([
      ".kioku",
      ".git",
      "node_modules"
    ]);
  }

  /**
   * Recursively lists every file in the workspace.
   *
   * Returns:
   * [
   *   "README.md",
   *   "src/index.js",
   *   "package.json"
   * ]
   */
  async listFiles() {
    const files = [];

    await this.#walk(this.root, files);

    return files.sort();
  }

  // reads a file from the workspace and returns a Buffer.
  async readFile(relativePath) {
    return fs.readFile(
      this.#resolve(relativePath)
    );
  }

  // checks whether a file exists.
  async exists(relativePath) {
    try {
      await fs.access(this.#resolve(relativePath));
      return true;
    } catch {
      return false;
    }
  }

  // src/index.js -> /Users/parth/project/src/index.js
  #resolve(relativePath) {
    return path.join(
      this.root,
      relativePath
    );
  }

  // recursive directory walker.
  async #walk(currentDirectory, files) {
    const entries = await fs.readdir(
      currentDirectory,
      {
        withFileTypes: true
      }
    );

    for (const entry of entries) {
      // ignore unwanted directories/files
      if (this.ignored.has(entry.name)) {
        continue;
      }

      const absolutePath = path.join(
        currentDirectory,
        entry.name
      );

      if (entry.isDirectory()) {
        await this.#walk(
          absolutePath,
          files
        );
      } else {
        files.push(
          path.relative(
            this.root,
            absolutePath
          )
        );
      }
    }
  }
}
