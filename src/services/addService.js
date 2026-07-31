import { Blob } from "../objects/blob.js";

export async function addService(
  workspace,
  index,
  objectStore,
  filePath
) {
  // Verify the file exists
  if (!(await workspace.exists(filePath))) {
    throw new Error(`File not found: ${filePath}`);
  }

  // Read file contents
  const content = await workspace.readFile(filePath);

  // Store as a blob
  const blob = new Blob(objectStore, content);

  const hash = await blob.save();

  // Stage it
  await index.add(filePath, hash);

  return hash;
}
