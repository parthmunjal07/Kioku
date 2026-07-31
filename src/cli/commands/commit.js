import { Repository } from "../../core/repository.js";
import { commitService } from "../../services/commitService.js";

export async function commitCommand(options) {
  try {
    const repository = await Repository.open(process.cwd());

    const message = options.message?.trim();

    if (!message) {
      throw new Error("Commit message cannot be empty.");
    }

    // Temporary author until config support is added
    const author = {
      name: "Parth Munjal",
      email: "parth@example.com"
    };

    const hash = await commitService(repository, {
      message,
      author
    });

    console.log(
      `Created commit ${hash.slice(0, 7)}`
    );
    console.log(`Message: ${message}`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
