import { Tree } from "../objects/tree.js";

export class TreeBuilder {
  constructor(index, objectStore) {
    this.index = index;
    this.objectStore = objectStore;
  }

  /**
   * Builds the complete tree hierarchy.
   *
   * Returns the hash of the root tree.
   */
  async build() {
    const entries = await this.index.entries();

    return this.#buildDirectory(entries, "");
  }

  /**
   * Recursively builds a tree for one directory.
   *
   * @param {Object} indexEntries
   * @param {string} currentDir
   */
  async #buildDirectory(indexEntries, currentDir) {
    const tree = new Tree(this.objectStore);

    const directories = new Set();

    for (const [filePath, hash] of Object.entries(indexEntries)) {
      // Skip files outside this directory
      if (
        currentDir &&
        !filePath.startsWith(currentDir + "/")
      ) {
        continue;
      }

      // Remaining relative path
      const relative = currentDir
        ? filePath.slice(currentDir.length + 1)
        : filePath;

      const parts = relative.split("/");

      // File belongs directly in this directory
      if (parts.length === 1) {
        tree.addEntry({
          mode: "100644",
          type: "blob",
          hash,
          name: parts[0]
        });

        continue;
      }

      // Child directory
      directories.add(parts[0]);
    }

    // Build child trees recursively
    for (const directory of directories) {
      const childPath = currentDir
        ? `${currentDir}/${directory}`
        : directory;

      const childHash =
        await this.#buildDirectory(
          indexEntries,
          childPath
        );

      tree.addEntry({
        mode: "040000",
        type: "tree",
        hash: childHash,
        name: directory
      });
    }

    // Optional: deterministic ordering
    tree.entries.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return tree.save();
  }
}
