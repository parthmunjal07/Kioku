import fs from "node:fs/promises";

export class Index {
  constructor(paths) {
    this.paths = paths;
  }

  /**
   * Reads the index file.
   *
   * Returns:
   * {
   *   "README.md": "...",
   *   "src/index.js": "..."
   * }
   */
  async load() {
    try {
      const data = await fs.readFile(
        this.paths.getIndexPath(),
        "utf8"
      );

      if (!data.trim()) {
        return {};
      }

      return JSON.parse(data);
    } catch (err) {
      // Missing index → treat as empty
      if (err.code === "ENOENT") {
        return {};
      }

      throw err;
    }
  }

  /**
   * Writes the entire index to disk.
   */
  async save(index) {
    await fs.writeFile(
      this.paths.getIndexPath(),
      JSON.stringify(index, null, 2)
    );
  }

  /**
   * Stage or update a file.
   */
  async add(filePath, hash) {
    const index = await this.load();

    index[filePath] = hash;

    await this.save(index);
  }

  /**
   * Remove a staged file.
   */
  async remove(filePath) {
    const index = await this.load();

    delete index[filePath];

    await this.save(index);
  }

  // get the hash for a staged file.
  async get(filePath) {
    const index = await this.load();

    return index[filePath] ?? null;
  }

  // check if a file is staged.
  async has(filePath) {
    const index = await this.load();

    return filePath in index;
  }

  // return all staged entries.
  async entries() {
    return await this.load();
  }

  // clear the staging area.
  async clear() {
    await this.save({});
  }
}
