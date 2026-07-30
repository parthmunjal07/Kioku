export class Blob {
  constructor(objectStore, content) {
    this.objectStore = objectStore

    this.content = Buffer.isBuffer(content) ? content : Buffer.from(content)
  }

  // store this blob and return its hash
  async save() {
    return await this.objectStore.write(
      "blob",
      this.content
    )
  }

  // load a blob from the object database
  static async load(objectStore, hash) {
    const object = await objectStore.read(hash);

    if (object.type !== "blob") {
      throw new Error(
        `${hash} is not a blob object.`
      );
    }

    return new Blob(
      objectStore,
      object.content
    )
  }

  // return blob contents
  getContent() {
    return this.content
  }

  // return blob as text
  toString(encoding = "utf8") {
    return this.content.toString(encoding)
  }
}
