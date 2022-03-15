import g from "../../../globals";
import { config } from "../../../modConfigMenu";

// The maximum amount of charges that a Battery Bum can grant is 3
// The third charge occurs on the 40th frame after the "Prize" animation begins
const BATTERY_BUM_CHARGE_DELAY_FRAMES = 40;

const v = {
  run: {
    checkForBatteryBumChargesUntilFrame: null as int | null,
  },
};

// ModCallbacks.MC_POST_PEFFECT_UPDATE (4)
export function postPEffectUpdate(player: EntityPlayer): void {
  if (!config.batteryBumFix) {
    return;
  }

  const gameFrameCount = g.g.GetFrameCount();
  const sprite = player.GetSprite();
  const animation = sprite.GetAnimation();

  Isaac.DebugString(
    `GETTING HERE - ANIM: ${animation}, GAME FRAME: ${gameFrameCount}`,
  );
}

// ModCallbacksCustom.MC_POST_SLOT_ANIMATION_CHANGED
// SlotVariant.BATTERY_BUM (13)
export function postSlotAnimationChangedBatteryBum(
  slot: Entity,
  previousAnimation: string,
  currentAnimation: string,
): void {
  if (!config.batteryBumFix) {
    return;
  }

  const gameFrameCount = g.g.GetFrameCount();

  if (currentAnimation === "Prize") {
    v.run.checkForBatteryBumChargesUntilFrame =
      gameFrameCount + BATTERY_BUM_CHARGE_DELAY_FRAMES;
  }
  Isaac.DebugString(`GETTING HERE - PRIZE ON: ${gameFrameCount}`);
}
