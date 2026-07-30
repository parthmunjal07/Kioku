export class Tree {
  constructor(objectStore, entries = []) {
    this.objectStore = objectStore
    this.entries = entries
  }

  addEntry(entry) {
    this.entries.push(entry)
  }

  async save() {
    const content = Buffer.from(
      JSON.stringify(this.entries)
    )

    return this.objectStore.write(
      "tree",
      content
    )
  }

  static async load(objectStore, hash) {
    const object = await objectStore.read(hash);
    if (object.type !== "tree") {
      throw new Error(`${hash} is not a tree.`);
    }

    return new Tree(
      objectStore,
      JSON.parse(object.content.toString())
    );
  }

  getEntries() {
    return this.entries
  }
}
