const { Command } = require("commander");
const { initCommand } = require("./commands/init");

const program = new Command()

program
  .name("kioku")
  .description("a small implementation of Git written in JavaScipt purely.")
  .version("0.1.0")

program
  .command("init")
  .description("initialize a new repo")
  .action(initCommand)

export { program }
