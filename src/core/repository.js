import fs from 'node:fs'
import { PathManager } from '../storage/paths'

export class Repository {
  constructor(repositoryRoot) {
    this.paths = new PathManager(repositoryRoot)
  }

  async exists() {
    try {
      fs.access(this.paths.getKirokuDir())
      return true
    } catch {
      return false
    }
  }

  async init() {
    if (await this.exists()) {
      throw new Error("Repository Already Exists")
    }

    // if new repo is created
    fs.mkdir(this.paths.getObjectsDir(), { recursive: true });
    fs.mkdir(this.paths.getHeadsDir(), { recursive: true });
    fs.mkdir(this.paths.getTagsDir(), { recursive: true });
    fs.mkdir(this.paths.getLogsDir(), { recursive: true });

    fs.writeFile(
          this.paths.getHeadPath(),
          "ref: refs/heads/main\n"
    );

    // creating the main branch
    fs.writeFile(
      this.paths.getBranchPath("main")
    )

    // just creatted an empty index file here
    fs.writeFile(
      this.paths.getIndexPath(),
      ""
    );

    fs.writeFile(
      this.paths.getConfigPath(),
      [
        "[core]",
        "\trepositoryformatversion = 0",
        "\tbare = false",
        ""
      ].join("\n")
    );
  }
}
