import fs from "node:fs/promises";
import path from "node:path";

// ensures a directory exists.
export async function ensureDirectory(dirPath) {
    await fs.mkdir(dirPath, { recursive: true });
}

// writes bytes to disk.
export async function writeFile(filePath, data) {
    await ensureDirectory(path.dirname(filePath));
    await fs.writeFile(filePath, data);
}

// reads bytes from disk.
export async function readFile(filePath) {
    return await fs.readFile(filePath);
}

// check if a file exists.
export async function exists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

// delete file
export async function removeFile(filePath) {
    await fs.unlink(filePath);
}
