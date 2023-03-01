import { ModCallback, PillEffect, UseFlag } from "isaac-typescript-definitions";
import * as seededTeleports from "../features/mandatory/seededTeleports";
import * as streakText from "../features/mandatory/streakText";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(ModCallback.POST_USE_PILL, main);

  mod.AddCallback(
    ModCallback.POST_USE_PILL,
    telepills,
    PillEffect.TELEPILLS, // 19
  );
}

function main(
  pillEffect: PillEffect,
  _player: EntityPlayer,
  useFlags: BitFlags<UseFlag>,
) {
  streakText.postUsePill(pillEffect, useFlags);
}

// PillEffect.TELEPILLS (19)
function telepills(
  _pillEffect: PillEffect,
  _player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
) {
  seededTeleports.postUsePillTelepills();
}
