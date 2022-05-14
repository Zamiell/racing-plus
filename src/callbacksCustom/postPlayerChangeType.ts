import { PlayerType } from "isaac-typescript-definitions";
import { ModCallbacksCustom, ModUpgraded } from "isaacscript-common";
import * as startWithD6 from "../features/optional/major/startWithD6";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbacksCustom.MC_POST_PLAYER_CHANGE_TYPE, main);
}

function main(
  player: EntityPlayer,
  _oldCharacter: PlayerType,
  _newCharacter: PlayerType,
) {
  startWithD6.postPlayerChangeType(player);
}
