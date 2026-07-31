import { Command } from "commander";
import { addCommand } from "./commands/add";
import { initCommand } from "./commands/init";

const program = new Command()

program
  .name("kioku")
  .description("a small implementation of Git written in JavaScipt purely.")
  .version("0.1.0")

program
  .command("init")
  .description("initialize a new repo")
  .action(initCommand)

program
  .command("add <path>")
  .description("Stage a file")
  .action(addCommand(filePath));

export { program }
