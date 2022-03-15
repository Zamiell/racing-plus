// In vanilla, Battery Bums will ignore pocket actives,
// even if the player does not have a normal active item

import { getActiveCharge, isActiveSlotDoubleCharged } from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";

/**
 * The number of frames between the Battery Bum beginning to play the "Prize" animation and the
 * first frame that the player plays the "Happy" animation.
 */
const BATTERY_BUM_CHARGE_DELAY_FRAMES = 29;

const v = {
  run: {
    checkForHappyAnimationFrame: null as int | null,
  },
};

// ModCallbacks.MC_POST_PEFFECT_UPDATE (4)
export function postPEffectUpdate(player: EntityPlayer): void {
  if (!config.batteryBumFix) {
    return;
  }

  const gameFrameCount = g.g.GetFrameCount();
  if (
    v.run.checkForHappyAnimationFrame === null ||
    gameFrameCount < v.run.checkForHappyAnimationFrame
  ) {
    return;
  }
  v.run.checkForHappyAnimationFrame = null;

  if (!isBeginningHappyAnimation(player)) {
    return;
  }

  // Battery Bum only charges the primary slot
  // (it ignores the Schoolbag slot and the pocket active slot)
  // Thus, detect whether the primary slot is empty or double-charged
  // (we can't use the "EntityPlayer.NeedsCharge" method because it will not account for Battery Bum
  // over-charging active items)
  if (isActiveSlotEmptyOrDoubleCharged(player, ActiveSlot.SLOT_PRIMARY)) {
    // In vanilla, Battery Bum can grant between 1 and 3 charges over the course of 40 frames
    // Default to giving 1 charge immediately to minimize the surface for bugs and other
    // interactions
    addChargesToActiveItem(player, 1, ActiveSlot.SLOT_POCKET);
  }
}

function isActiveSlotEmptyOrDoubleCharged(
  player: EntityPlayer,
  activeSlot: ActiveSlot,
) {
  const activeCollectibleType = player.GetActiveItem(activeSlot);
  if (activeCollectibleType === CollectibleType.COLLECTIBLE_NULL) {
    return true;
  }

  return isActiveSlotDoubleCharged(player, activeSlot);
}

function isBeginningHappyAnimation(player: EntityPlayer) {
  const sprite = player.GetSprite();
  const animation = sprite.GetAnimation();
  const frame = sprite.GetFrame();

  return animation === "Happy" && frame <= 1;
}

/** This function allows the item to be over-charged. */
function addChargesToActiveItem(
  player: EntityPlayer,
  numCharges: int,
  activeSlot: ActiveSlot,
) {
  if (isActiveSlotDoubleCharged(player, activeSlot)) {
    return;
  }

  const charge = getActiveCharge(player, activeSlot);
  const newCharge = charge + numCharges;
  player.SetActiveCharge(newCharge, activeSlot);
  const hud = g.g.GetHUD();
  hud.FlashChargeBar(player, activeSlot);
}

// ModCallbacksCustom.MC_POST_SLOT_ANIMATION_CHANGED
// SlotVariant.BATTERY_BUM (13)
export function postSlotAnimationChangedBatteryBum(
  _slot: Entity,
  previousAnimation: string,
  currentAnimation: string,
): void {
  if (!config.batteryBumFix) {
    return;
  }

  const gameFrameCount = g.g.GetFrameCount();

  if (currentAnimation === "Prize") {
    v.run.checkForHappyAnimationFrame =
      gameFrameCount + BATTERY_BUM_CHARGE_DELAY_FRAMES;
  }
}
