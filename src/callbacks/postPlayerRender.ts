import { isChildPlayer } from "isaacscript-common";
import * as fastTeleports from "../features/optional/cutscenes/fastTeleports";

export function main(player: EntityPlayer): void {
  if (isChildPlayer(player)) {
    return;
  }

  // Cutscenes
  fastTeleports.postPlayerRender(player);
}
