import g from "../globals";
import { initPlayerVariables } from "../types/GlobalsRun";

export function main(player: EntityPlayer): void {
  const gameFrameCount = g.g.GetFrameCount();

  if (gameFrameCount !== 0) {
    // If this is the start of a new run,
    // we cannot initialize player variables because the "g.run" table is not initialized yet
    initPlayerVariables(player, g.run);
  }
}
