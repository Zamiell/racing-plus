import * as seededTeleports from "../features/mandatory/seededTeleports";
import * as streakText from "../features/mandatory/streakText";
import * as pillsCancelAnimations from "../features/optional/gameplay/pillsCancelAnimations";
import * as showPills from "../features/optional/quality/showPills";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_USE_PILL,
    telepills,
    PillEffect.PILLEFFECT_TELEPILLS, // 19
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

export function main(pillEffect: PillEffect): void {
  // This callback does not pass the player, so we have to assume player 0 ate the pill
  const player = Isaac.GetPlayer();

  showPills.usePill(player, pillEffect);
  streakText.usePill(pillEffect);
}

// PillEffect.PILLEFFECT_TELEPILLS (19)
function telepills(
  _pillEffect: PillEffect,
  _player: EntityPlayer,
  _userFlags: int,
) {
  seededTeleports.usePillTelepills();
}

// PillEffect.PILLEFFECT_POWER (36)
function powerPill(
  _pillEffect: PillEffect,
  player: EntityPlayer,
  _userFlags: int,
) {
  pillsCancelAnimations.usePillPowerPill(player);
}

// PillEffect.PILLEFFECT_HORF (44)
function horf(_pillEffect: PillEffect, player: EntityPlayer, _userFlags: int) {
  pillsCancelAnimations.usePillHorf(player);
}
