import { PlayerForm } from "isaac-typescript-definitions";
import { ModCallbacksCustom, ModUpgraded } from "isaacscript-common";
import * as streakText from "../features/mandatory/streakText";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbacksCustom.MC_POST_TRANSFORMATION, main);
}

function main(_player: EntityPlayer, playerForm: PlayerForm, hasForm: boolean) {
  streakText.postTransformation(playerForm, hasForm);
}
