import { isChildPlayer } from "isaacscript-common";
import * as debugFunction from "../debugFunction";
import * as fastTeleports from "../features/optional/cutscenes/fastTeleports";
import racePostPlayerRender from "../features/race/callbacks/postPlayerRender";

export function main(player: EntityPlayer): void {
  if (isChildPlayer(player)) {
    return;
  }

  // Major
  racePostPlayerRender(player);
  debugFunction.postPlayerRender(player);

  // Cutscenes
  fastTeleports.postPlayerRender(player);
}
