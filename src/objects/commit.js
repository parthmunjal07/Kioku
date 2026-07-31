export class Commit {
  constructor(objectStore, data) {
    this.objectStore = objectStore;

    this.tree = data.tree;
    this.parents = data.parents ?? [];
    this.author = data.author;
    this.committer = data.committer ?? data.author;
    this.timestamp = data.timestamp ?? Date.now();
    this.message = data.message;
  }

  serialize() {
    return Buffer.from(
      JSON.stringify({
        tree: this.tree,
        parents: this.parents,
        author: this.author,
        committer: this.committer,
        timestamp: this.timestamp,
        message: this.message
      })
    );
  }

  async save() {
    return this.objectStore.write(
      "commit",
      this.serialize()
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

  getTree() {
    return this.tree;
  }

  getParents() {
    return [...this.parents];
  }

  getMessage() {
    return this.message;
  }

  getAuthor() {
    return this.author;
  }

  getTimestamp() {
    return this.timestamp;
  }
}
