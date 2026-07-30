import { Blob } from "./blob.js";
import { Tree } from "./tree.js";
import { Commit } from "./commit.js";

export class ObjectFactory {
  constructor(objectStore) {
    this.objectStore = objectStore;
  }

  async load(hash) {
    const object = await this.objectStore.read(hash);

    switch (object.type) {
      case "blob":
        return new Blob(
          this.objectStore,
          object.content
        );

      case "tree":
        return new Tree(
          this.objectStore,
          object.content
        );

      case "commit":
        return new Commit(
          this.objectStore,
          object.content
        );

      default:
        throw new Error(
          `Unknown object type: ${object.type}`
        );
    }
  }
}
