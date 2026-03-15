import { showHUD, showToast, Toast } from "@raycast/api";
import { runCricketsCommand } from "./lib/play-crickets";

export default async function Command() {
  await runCricketsCommand({
    showHud: (message) => showHUD(message),
    showFailure: (title, message) =>
      showToast({
        style: Toast.Style.Failure,
        title,
        message,
      }),
  });
}
