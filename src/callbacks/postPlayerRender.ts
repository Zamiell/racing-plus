import { isChildPlayer } from "isaacscript-common";
import * as debugFunction from "../debugFunction";
import { seededDeathPostPlayerRender } from "../features/mandatory/seededDeath/callbacks/postPlayerRender";
import * as fastTeleports from "../features/optional/cutscenes/fastTeleports";

export function main(player: EntityPlayer): void {
  if (isChildPlayer(player)) {
    return;
  }

  // Mandatory
  seededDeathPostPlayerRender(player);

  // Major
  debugFunction.postPlayerRender(player);

  // Cutscenes
  fastTeleports.postPlayerRender(player);
}
