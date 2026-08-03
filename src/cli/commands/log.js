import { Repository } from "../../core/repository.js";
import { logService } from "../../services/logService.js";

export async function logCommand() {
  try {
    const repository =
      await Repository.open(process.cwd());

    const commits =
      await logService(repository);

    if (!commits?.length) {
      return;
    }

    for (const commit of commits) {
      console.log(
        `commit ${commit.hash}`
      );

      console.log(
        `Author: ${commit.author.name} <${commit.author.email}>`
      );

      console.log(
        `Date: ${new Date(
          commit.timestamp
        ).toLocaleString()}`
      );

      console.log();

      console.log(`    ${commit.message}`);

      console.log();
    }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
