import * as seededTeleports from "../features/mandatory/seededTeleports";
import * as streakText from "../features/mandatory/streakText";
import * as pillsCancelAnimations from "../features/optional/gameplay/pillsCancelAnimations";
import * as chargePocketItemFirst from "../features/optional/quality/chargePocketItemFirst";
import * as showPills from "../features/optional/quality/showPills";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_USE_PILL, main);

  mod.AddCallback(
    ModCallbacks.MC_USE_PILL,
    telepills,
    PillEffect.PILLEFFECT_TELEPILLS, // 19
  );

  mod.AddCallback(
    ModCallbacks.MC_USE_PILL,
    fortyEightHourEnergy,
    PillEffect.PILLEFFECT_48HOUR_ENERGY, // 20
  );

  mod.AddCallback(
    ModCallbacks.MC_USE_PILL,
    powerPill,
    PillEffect.PILLEFFECT_POWER, // 36
  );

  mod.AddCallback(
    ModCallbacks.MC_USE_PILL,
    horf,
    PillEffect.PILLEFFECT_HORF, // 44
  );
}

function main(pillEffect: PillEffect, player: EntityPlayer, _useFlags: int) {
  showPills.usePill(player, pillEffect);
  streakText.usePill(pillEffect);
}

// PillEffect.PILLEFFECT_TELEPILLS (19)
function telepills(
  _pillEffect: PillEffect,
  _player: EntityPlayer,
  _useFlags: int,
) {
  seededTeleports.usePillTelepills();
}

// PillEffect.PILLEFFECT_48HOUR_ENERGY (20)
function fortyEightHourEnergy(_pillEffect: PillEffect, player: EntityPlayer) {
  chargePocketItemFirst.usePill48HourEnergy(player);
}

// PillEffect.PILLEFFECT_POWER (36)
function powerPill(
  _pillEffect: PillEffect,
  player: EntityPlayer,
  _useFlags: int,
) {
  pillsCancelAnimations.usePillPowerPill(player);
}

// PillEffect.PILLEFFECT_HORF (44)
function horf(_pillEffect: PillEffect, player: EntityPlayer, _useFlags: int) {
  pillsCancelAnimations.usePillHorf(player);
}
