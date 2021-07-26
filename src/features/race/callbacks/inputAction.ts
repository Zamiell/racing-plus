import g from "../../../globals";

// Prevent opening the console during a race
export function actionConsole(): boolean | void {
  if (g.debug) {
    return undefined;
  }

  // Allow usage of the console in custom races
  if (
    g.race.status === "in progress" &&
    g.race.myStatus === "racing" &&
    g.race.format !== "custom"
  ) {
    return false;
  }

  return undefined;
}
