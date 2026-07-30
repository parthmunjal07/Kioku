export class Commit {
  constructor(objectStore, data) {
    this.objectStore = objectStore;

    this.tree = data.tree;
    this.parents = data.parents ?? [];
    this.author = data.author;
    this.timestamp = data.timestamp;
    this.message = data.message;
  }

  async save() {
    const content = Buffer.from(
      JSON.stringify({
        tree: this.tree,
        parents: this.parents,
        author: this.author,
        timestamp: this.timestamp,
        message: this.message
      })
    );

    return this.objectStore.write(
      "commit",
      content
    );
  }

  static async load(objectStore, hash) {
    const object = await objectStore.read(hash);

    if (object.type !== "commit") {
      throw new Error(`${hash} is not a commit.`);
    }

    return new Commit(
      objectStore,
      JSON.parse(object.content.toString())
    );
  }

  getMessage() {
    return this.message;
  }

  getTree() {
    return this.tree;
  }

  getParents() {
    return this.parents;
  }
}
