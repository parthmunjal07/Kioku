import { sha1 } from "./hash.js";
import { compressObject, decompressObject } from "./compression.js";
import {
  writeFile,
  readFile,
  exists,
} from "./filesystem.js";

export class ObjectStore {
  constructor(paths) {
    this.paths = paths;
  }


  // creates the Git object format
  serialize(type, content) {
    if (!Buffer.isBuffer(content)) {
      content = Buffer.from(content);
    }

    const header = Buffer.from(`${type} ${content.length}\0`);

    return Buffer.concat([header, content]);
  }

  // parse the Git object format.
  deserialize(buffer) {
    const nullIndex = buffer.indexOf(0);

    if (nullIndex === -1) {
      throw new Error("Invalid object format.");
    }

    const header = buffer.subarray(0, nullIndex).toString();

    const [type, size] = header.split(" ");

    const content = buffer.subarray(nullIndex + 1);

    return {
      type,
      size: Number(size),
      content,
    };
  }

  // stores an object and returns its SHA-1 hash.
  async write(type, content) {
    const serialized = this.serialize(type, content);

    const hash = sha1(serialized);

    const compressed = await compressObject(serialized);

    const objectPath = this.paths.getObjectPath(hash);

    await writeFile(objectPath, compressed);

    return hash;
  }

  // read an object from disk.
  async read(hash) {
    const objectPath = this.paths.getObjectPath(hash);

    if (!(await exists(objectPath))) {
      throw new Error(`Object '${hash}' does not exist.`);
    }

    const compressed = await readFile(objectPath);

    const serialized = await decompressObject(compressed);

    return this.deserialize(serialized);
  }

   // check whether an object exists.
  async exists(hash) {
    return exists(
      this.paths.getObjectPath(hash)
    );
  }
}
