import { ActiveSlot, SlotVariant } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  game,
  getTotalCharge,
  isActiveSlotDoubleCharged,
  isActiveSlotEmpty,
} from "isaacscript-common";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

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

/**
 * In vanilla, Battery Bums will not charge the pocket active item if the player has no active item.
 * (This is not the case if the player has an active item. If the active item is already fully
 * double-charged, then the pocket item will be charged properly.)
 */
export class BatteryBumFix extends ConfigurableModFeature {
  configKey: keyof Config = "BatteryBumFix";
  v = v;

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const gameFrameCount = game.GetFrameCount();
    if (
      v.run.checkForHappyAnimationFrame === null ||
      gameFrameCount < v.run.checkForHappyAnimationFrame
    ) {
      return;
    }
    v.run.checkForHappyAnimationFrame = null;

    if (!this.isBeginningHappyAnimation(player)) {
      return;
    }

    // Battery Bum is only bugged when the active slot is missing entirely.
    if (!isActiveSlotEmpty(player, ActiveSlot.PRIMARY)) {
      return;
    }

    // In vanilla, Battery Bum can grant between 1 and 3 charges over the course of 40 frames.
    // Default to giving 1 charge immediately to minimize the surface for bugs and other
    // interactions.
    this.addChargesToActiveItem(player, 1, ActiveSlot.POCKET);
  }

  isBeginningHappyAnimation(player: EntityPlayer): boolean {
    const sprite = player.GetSprite();
    const animation = sprite.GetAnimation();
    const frame = sprite.GetFrame();

    return animation === "Happy" && frame <= 1;
  }

  /** This function allows the item to be over-charged. */
  addChargesToActiveItem(
    player: EntityPlayer,
    numCharges: int,
    activeSlot: ActiveSlot,
  ): void {
    if (isActiveSlotDoubleCharged(player, activeSlot)) {
      return;
    }

    const charge = getTotalCharge(player, activeSlot);
    const newCharge = charge + numCharges;
    player.SetActiveCharge(newCharge, activeSlot);
    const hud = game.GetHUD();
    hud.FlashChargeBar(player, activeSlot);
  }

  @CallbackCustom(
    ModCallbackCustom.POST_SLOT_ANIMATION_CHANGED,
    SlotVariant.BATTERY_BUM,
  )
  postSlotAnimationChangedBatteryBum(
    _slot: Entity,
    _previousAnimation: string,
    currentAnimation: string,
  ): void {
    const gameFrameCount = game.GetFrameCount();

    if (currentAnimation === "Prize") {
      v.run.checkForHappyAnimationFrame =
        gameFrameCount + BATTERY_BUM_CHARGE_DELAY_FRAMES;
    }
  }
}
