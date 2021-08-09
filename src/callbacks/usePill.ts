import * as seededTeleports from "../features/mandatory/seededTeleports";
import * as streakText from "../features/mandatory/streakText";
import * as showPills from "../features/optional/quality/showPills";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_USE_PILL,
    telepills,
    PillEffect.PILLEFFECT_TELEPILLS,
  );
}

export function main(pillEffect: PillEffect): void {
  // This callback does not pass the player, so we have to assume player 0 ate the pill
  const player = Isaac.GetPlayer();

  showPills.usePill(player, pillEffect);
  streakText.usePill(pillEffect);
}

// PillEffect.PILLEFFECT_TELEPILLS (19)
function telepills() {
  seededTeleports.usePillTelepills();
}
