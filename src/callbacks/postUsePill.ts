import { ModCallback, PillEffect, UseFlag } from "isaac-typescript-definitions";
import * as seededTeleports from "../features/mandatory/seededTeleports";
import * as streakText from "../features/mandatory/streakText";
import * as chargePocketItemFirst from "../features/optional/quality/chargePocketItemFirst";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(ModCallback.POST_USE_PILL, main);

  mod.AddCallback(
    ModCallback.POST_USE_PILL,
    telepills,
    PillEffect.TELEPILLS, // 19
  );

  mod.AddCallback(
    ModCallback.POST_USE_PILL,
    fortyEightHourEnergy,
    PillEffect.FORTY_EIGHT_HOUR_ENERGY, // 20
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

// PillEffect.FORTY_EIGHT_HOUR_ENERGY (20)
function fortyEightHourEnergy(
  _pillEffect: PillEffect,
  player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
) {
  chargePocketItemFirst.postUsePill48HourEnergy(player);
}
