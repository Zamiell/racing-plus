import { PlayerType } from "isaac-typescript-definitions";
import { ModCallbackCustom } from "isaacscript-common";
import * as startWithD6 from "../features/optional/major/startWithD6";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_PLAYER_CHANGE_TYPE, main);
}

function main(
  player: EntityPlayer,
  _oldCharacter: PlayerType,
  _newCharacter: PlayerType,
) {
  startWithD6.postPlayerChangeType(player);
}
