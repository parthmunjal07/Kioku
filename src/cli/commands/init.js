import { initService } from "../../services/initService.js";

export async function initCommand() {
  try {
    await initService();
    console.log("Initialized empty Kiroku repository.");
  } catch (err) {
    console.error(err.message);
  }
}
