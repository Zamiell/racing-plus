import { isChildPlayer } from "isaacscript-common";
import * as debugFunction from "../debugFunction";
import * as fastTeleports from "../features/optional/cutscenes/fastTeleports";

export function main(player: EntityPlayer): void {
  if (isChildPlayer(player)) {
    return;
  }

  // Major
  debugFunction.postPlayerRender(player);

  // Cutscenes
  fastTeleports.postPlayerRender(player);
}
