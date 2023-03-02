import { ModCallback, PillEffect, UseFlag } from "isaac-typescript-definitions";
import * as streakText from "../features/mandatory/streakText";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(ModCallback.POST_USE_PILL, main);
}

function main(
  pillEffect: PillEffect,
  _player: EntityPlayer,
  useFlags: BitFlags<UseFlag>,
) {
  streakText.postUsePill(pillEffect, useFlags);
}
