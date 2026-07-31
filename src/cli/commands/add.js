import { Repository } from "../../core/repository.js";
import { Workspace } from "../../core/workspace.js";
import { ObjectStore } from "../../storage/objectStore.js";
import { Index } from "../../core/index.js";
import { addService } from "../../services/addService.js";

export async function addCommand(filePath) {
  try {
    const repository = new Repository(process.cwd());

    if (!(await repository.exists())) {
      throw new Error("Not a Kiroku repository.");
    }

    const workspace = new Workspace(process.cwd());

    const objectStore = new ObjectStore(repository.paths);

    const index = new Index(repository.paths);

    const hash = await addService(
      workspace,
      index,
      objectStore,
      filePath
    );

    console.log(`Added '${filePath}'`);
    console.log(`Blob: ${hash}`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
