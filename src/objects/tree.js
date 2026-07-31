export class Tree {
  constructor(objectStore, entries = []) {
    this.objectStore = objectStore;
    this.entries = entries;
  }

  addEntry(entry) {
    this.entries.push(entry);
  }

  getEntries() {
    return [...this.entries];
  }

  serialize() {
    return Buffer.from(
      JSON.stringify(this.entries)
    );
  }

  async save() {
    return this.objectStore.write(
      "tree",
      this.serialize()
    );
  }

  static async load(objectStore, hash) {
    const object = await objectStore.read(hash);

    if (object.type !== "tree") {
      throw new Error(
        `${hash} is not a tree.`
      );
    }

    const entries = JSON.parse(
      object.content.toString()
    );

    return new Tree(
      objectStore,
      entries
    );
  }
}
