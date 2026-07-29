import { promisify } from "node:util";
import { deflate, inflate } from "node:zlib";

const compress = promisify(deflate);
const decompress = promisify(inflate);

export async function compressObject(data) {
    return compress(data);
}

export async function decompressObject(data) {
    return decompress(data);
}
