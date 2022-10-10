import { PlayerForm } from "isaac-typescript-definitions";
import { ModCallbackCustom } from "isaacscript-common";
import * as streakText from "../features/mandatory/streakText";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_TRANSFORMATION, main);
}

function main(_player: EntityPlayer, playerForm: PlayerForm, hasForm: boolean) {
  streakText.postTransformation(playerForm, hasForm);
}
