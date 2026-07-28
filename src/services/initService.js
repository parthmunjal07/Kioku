import { Repository } from "../core/repository";

export async function initService() {
  const repository = new Repository(process.cwd())
  await repository.init()
}
