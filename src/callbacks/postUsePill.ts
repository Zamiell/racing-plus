import { ModCallback, PillEffect, UseFlag } from "isaac-typescript-definitions";
import * as seededTeleports from "../features/mandatory/seededTeleports";
import * as streakText from "../features/mandatory/streakText";
import * as pillsCancelAnimations from "../features/optional/gameplay/pillsCancelAnimations";
import * as chargePocketItemFirst from "../features/optional/quality/chargePocketItemFirst";
import * as showPills from "../features/optional/quality/showPills";
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

  mod.AddCallback(
    ModCallback.POST_USE_PILL,
    powerPill,
    PillEffect.POWER, // 36
  );

  mod.AddCallback(
    ModCallback.POST_USE_PILL,
    horf,
    PillEffect.HORF, // 44
  );
}

function main(
  pillEffect: PillEffect,
  player: EntityPlayer,
  useFlags: BitFlags<UseFlag>,
) {
  showPills.usePill(player, pillEffect);
  streakText.usePill(pillEffect, useFlags);
}

// PillEffect.TELEPILLS (19)
function telepills(
  _pillEffect: PillEffect,
  _player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
) {
  seededTeleports.usePillTelepills();
}

// PillEffect.FORTY_EIGHT_HOUR_ENERGY (20)
function fortyEightHourEnergy(
  _pillEffect: PillEffect,
  player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
) {
  chargePocketItemFirst.usePill48HourEnergy(player);
}

// PillEffect.POWER (36)
function powerPill(
  _pillEffect: PillEffect,
  player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
) {
  pillsCancelAnimations.usePillPowerPill(player);
}

// PillEffect.HORF (44)
function horf(
  _pillEffect: PillEffect,
  player: EntityPlayer,
  _useFlags: BitFlags<UseFlag>,
) {
  pillsCancelAnimations.usePillHorf(player);
}
