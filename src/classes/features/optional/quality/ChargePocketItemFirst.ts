import {
  ActiveSlot,
  BatterySubType,
  ButtonAction,
  CollectibleType,
  InputHook,
  ItemType,
  KeySubType,
  ModCallback,
  PickupVariant,
  PillEffect,
  RoomType,
  SlotVariant,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  asNumber,
  Callback,
  CallbackCustom,
  DefaultMap,
  defaultMapGetPlayer,
  game,
  getCollectibleMaxCharges,
  getTotalCharge,
  inRoomType,
  isActiveSlotEmpty,
  logError,
  ModCallbackCustom,
  playChargeSoundEffect,
  PlayerIndex,
} from "isaacscript-common";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

interface ChargeSituation {
  numCharges: int;
  overcharge?: boolean;
}

const ACTIVE_SLOTS_PRECEDENCE = [
  ActiveSlot.POCKET,
  ActiveSlot.PRIMARY,
  ActiveSlot.SECONDARY,
] as const;

/**
 * The maximum amount of charges that a Battery Bum can grant is 3. The third charge occurs on this
 * many frames after the "Prize" animation begins.
 */
const BATTERY_BUM_CHARGE_DELAY_FRAMES = 40;

const LIL_BATTERY_CHARGES = 6;
const MICRO_BATTERY_CHARGES = 2;

const v = {
  run: {
    activeItemChargesMap: new DefaultMap<PlayerIndex, Map<ActiveSlot, int>>(
      () => new Map(),
    ),
    checkForBatteryBumChargesUntilGameFrame: null as int | null,
  },
};

/**
 * In vanilla, active items will be charged in the following order:
 *
 * - `ActiveSlot.PRIMARY`
 * - `ActiveSlot.SECONDARY`
 * - `ActiveSlot.POCKET`
 *
 * In Racing+, this behavior is usually not what the player wants, because they have a D6 on the
 * pocket active. Change the precedence such that the pocket active has priority.
 *
 * This feature handles the following situations:
 *
 * - Batteries (all sub-types)
 * - Charged keys
 * - Coins with the Charged Penny trinket
 * - 48 Hour Energy pill
 * - Hairpin trinket
 * - Battery Bum
 * - 9 Volt
 * - Battery Pack
 */
export class ChargePocketItemFirst extends ConfigurableModFeature {
  configKey: keyof Config = "ChargePocketItemFirst";
  v = v;

  // 10, 20
  @Callback(ModCallback.POST_USE_PILL, PillEffect.FORTY_EIGHT_HOUR_ENERGY)
  postUsePill48HourEnergy(_pillEffect: PillEffect, player: EntityPlayer): void {
    if (dropButtonPressed(player)) {
      return;
    }

    const chargeSituation: ChargeSituation = {
      numCharges: LIL_BATTERY_CHARGES,
    };
    checkSwitchCharge(player, chargeSituation);
  }

  @CallbackCustom(
    ModCallbackCustom.INPUT_ACTION_FILTER,
    InputHook.IS_ACTION_TRIGGERED,
    ButtonAction.ITEM,
  )
  inputActionIsActionTriggeredItem(
    entity: Entity | undefined,
  ): boolean | undefined {
    if (entity === undefined) {
      return undefined;
    }

    const player = entity.ToPlayer();
    if (player === undefined) {
      return undefined;
    }

    if (dropButtonPressed(player)) {
      return undefined;
    }

    // Prevent using the active item before the charges have been swapped.
    const room = game.GetRoom(); // We cannot use the cached room class inside of an input callback.
    const roomFrameCount = room.GetFrameCount();
    const hasHairpin = player.HasTrinket(TrinketType.HAIRPIN);

    const batteryBumCharging =
      v.run.checkForBatteryBumChargesUntilGameFrame !== null;
    const hairpinActivating = hasHairpin && roomFrameCount <= 1;
    const shouldStopActiveItemUses = batteryBumCharging || hairpinActivating;

    return shouldStopActiveItemUses ? false : undefined;
  }

  @CallbackCustom(
    ModCallbackCustom.POST_ITEM_PICKUP,
    ItemType.PASSIVE,
    CollectibleType.NINE_VOLT,
  )
  postItemPickup9Volt(player: EntityPlayer): void {
    if (dropButtonPressed(player)) {
      return;
    }

    const chargeSituation: ChargeSituation = {
      numCharges: LIL_BATTERY_CHARGES,
    };
    checkSwitchCharge(player, chargeSituation);
  }

  @CallbackCustom(
    ModCallbackCustom.POST_ITEM_PICKUP,
    ItemType.PASSIVE,
    CollectibleType.BATTERY_PACK,
  )
  postItemPickupBatteryPack(player: EntityPlayer): void {
    if (dropButtonPressed(player)) {
      return;
    }

    const chargeSituation: ChargeSituation = {
      numCharges: LIL_BATTERY_CHARGES,
    };
    checkSwitchCharge(player, chargeSituation);
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    if (dropButtonPressed(player)) {
      return;
    }

    this.checkBatteryBumCharge(player); // This must come before updating the map.
    this.checkHairpinCharge(player); // This must come before updating the map.
    this.updateActiveItemChargesMap(player);
  }

  checkBatteryBumCharge(player: EntityPlayer): void {
    if (v.run.checkForBatteryBumChargesUntilGameFrame === null) {
      return;
    }

    const gameFrameCount = game.GetFrameCount();
    if (gameFrameCount > v.run.checkForBatteryBumChargesUntilGameFrame) {
      v.run.checkForBatteryBumChargesUntilGameFrame = null;
      return;
    }

    const chargeSituation: ChargeSituation = {
      numCharges: 1,
      overcharge: true,
    };
    checkSwitchCharge(player, chargeSituation);
  }

  checkHairpinCharge(player: EntityPlayer): void {
    const room = game.GetRoom();
    const roomFrameCount = room.GetFrameCount();
    const firstVisit = room.IsFirstVisit();
    const hasHairpin = player.HasTrinket(TrinketType.HAIRPIN);

    if (
      !inRoomType(RoomType.BOSS) ||
      roomFrameCount !== 1 ||
      !firstVisit ||
      !hasHairpin
    ) {
      return;
    }

    // Hairpin charges the active item on the 1st frame of the room. Thus, we have to perform this
    // check in the PostPEffectUpdate callback instead of the `POST_NEW_ROOM` callback.
    const chargeSituation: ChargeSituation = {
      numCharges: LIL_BATTERY_CHARGES,
    };
    checkSwitchCharge(player, chargeSituation);
  }

  /**
   * On every frame, we need to track the current charges for each active item that a player has for
   * the purposes of rewinding the charges.
   */
  updateActiveItemChargesMap(player: EntityPlayer): void {
    const activeItemCharges = defaultMapGetPlayer(
      v.run.activeItemChargesMap,
      player,
    );

    for (const activeSlot of ACTIVE_SLOTS_PRECEDENCE) {
      if (isActiveSlotEmpty(player, activeSlot)) {
        continue;
      }

      const totalCharge = getTotalCharge(player, activeSlot);
      activeItemCharges.set(activeSlot, totalCharge);
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_PICKUP_COLLECT)
  postPickupCollect(pickup: EntityPickup, player: EntityPlayer): void {
    if (dropButtonPressed(player)) {
      return;
    }

    const chargeSituation = getChargeSituationForPickup(
      pickup.Variant,
      pickup.SubType,
      player,
    );
    checkSwitchCharge(player, chargeSituation);
  }

  @CallbackCustom(ModCallbackCustom.POST_PURCHASE)
  postPurchase(player: EntityPlayer, pickup: EntityPickup): void {
    if (dropButtonPressed(player)) {
      return;
    }

    const chargeSituation = getChargeSituationForPickup(
      pickup.Variant,
      pickup.SubType,
      player,
    );
    checkSwitchCharge(player, chargeSituation);
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
    const player = Isaac.GetPlayer();
    const gameFrameCount = game.GetFrameCount();

    if (dropButtonPressed(player)) {
      return;
    }

    if (currentAnimation === "Prize") {
      v.run.checkForBatteryBumChargesUntilGameFrame =
        gameFrameCount + BATTERY_BUM_CHARGE_DELAY_FRAMES;
    }
  }
}

function getChargeSituationForPickup(
  pickupVariant: PickupVariant,
  pickupSubType: int,
  player: EntityPlayer,
): ChargeSituation {
  switch (pickupVariant) {
    // 20
    case PickupVariant.COIN: {
      if (player.HasTrinket(TrinketType.CHARGED_PENNY)) {
        return {
          numCharges: 1,
        };
      }

      return {
        numCharges: 0,
      };
    }

    // 30
    case PickupVariant.KEY: {
      if (pickupSubType === asNumber(KeySubType.CHARGED)) {
        return {
          numCharges: LIL_BATTERY_CHARGES,
        };
      }

      return {
        numCharges: 0,
      };
    }

    // 90
    case PickupVariant.LIL_BATTERY: {
      const batterySubType = pickupSubType as BatterySubType;
      return getChargeSituationForBattery(batterySubType);
    }

    default: {
      return {
        numCharges: 0,
      };
    }
  }
}

function getChargeSituationForBattery(
  batterySubType: BatterySubType,
): ChargeSituation {
  switch (batterySubType) {
    case BatterySubType.NULL: {
      return {
        numCharges: 0,
      };
    }

    case BatterySubType.NORMAL: {
      return {
        numCharges: LIL_BATTERY_CHARGES,
      };
    }

    case BatterySubType.MICRO: {
      return {
        numCharges: MICRO_BATTERY_CHARGES,
      };
    }

    case BatterySubType.MEGA: {
      // This fully-charges every active item, so this feature does not need to handle it.
      return {
        numCharges: 0,
      };
    }

    case BatterySubType.GOLDEN: {
      return {
        numCharges: LIL_BATTERY_CHARGES,
      };
    }

    default: {
      // Handle modded battery types.
      return {
        numCharges: 0,
      };
    }
  }
}

function checkSwitchCharge(
  player: EntityPlayer,
  chargeSituation: ChargeSituation,
) {
  if (chargeSituation.numCharges === 0) {
    return;
  }

  if (!checkActiveItemsChargeChange(player)) {
    return;
  }

  rewindActiveChargesToLastFrame(player);
  giveCharge(player, chargeSituation);
}

function checkActiveItemsChargeChange(player: EntityPlayer) {
  const activeItemCharges = defaultMapGetPlayer(
    v.run.activeItemChargesMap,
    player,
  );
  if (activeItemCharges.size === 0) {
    logError(
      'Error: The activeItemCharges map was not initialized yet in the "checkActiveItemsChargeChange" function.',
    );
    return false;
  }

  const activeItemsChanged = new Set<ActiveSlot>();
  for (const [activeSlot, oldTotalCharge] of activeItemCharges) {
    if (isActiveSlotEmpty(player, activeSlot)) {
      continue;
    }

    const totalCharge = getTotalCharge(player, activeSlot);
    if (totalCharge !== oldTotalCharge) {
      activeItemsChanged.add(activeSlot);
    }
  }

  if (activeItemsChanged.has(ActiveSlot.POCKET)) {
    // We do not need to reorder any charges if it is the pocket active that got charged.
    return false;
  }

  // We do not want to reorder charges in situations where all of the active items are charged, so
  // do nothing if more than one active item changed.
  return activeItemsChanged.size === 1;
}

function rewindActiveChargesToLastFrame(player: EntityPlayer) {
  const activeItemCharges = defaultMapGetPlayer(
    v.run.activeItemChargesMap,
    player,
  );
  if (activeItemCharges.size === 0) {
    logError(
      'Error: The activeItemCharges map was not initialized yet in the "rewindActiveChargesToLastFrame" function.',
    );
    return;
  }

  for (const activeSlot of ACTIVE_SLOTS_PRECEDENCE) {
    if (isActiveSlotEmpty(player, activeSlot)) {
      continue;
    }

    const storedCharge = activeItemCharges.get(activeSlot);
    if (storedCharge === undefined) {
      continue;
    }

    player.SetActiveCharge(storedCharge, activeSlot);
  }
}

function giveCharge(player: EntityPlayer, chargeSituation: ChargeSituation) {
  const hud = game.GetHUD();

  // Now, charge the active items in the proper order.
  for (const activeSlot of ACTIVE_SLOTS_PRECEDENCE) {
    if (!needsCharge(player, activeSlot, chargeSituation.overcharge)) {
      continue;
    }

    const totalCharge = getTotalCharge(player, activeSlot);
    let newCharge = totalCharge + chargeSituation.numCharges;
    const activeItem = player.GetActiveItem(activeSlot);
    let maxCharges = getCollectibleMaxCharges(activeItem);
    const hasBattery = player.HasCollectible(CollectibleType.BATTERY);
    if (hasBattery || chargeSituation.overcharge === true) {
      maxCharges *= 2;
    }
    if (newCharge > maxCharges) {
      newCharge = maxCharges;
    }

    player.SetActiveCharge(newCharge, activeSlot);
    hud.FlashChargeBar(player, activeSlot);
    playChargeSoundEffect(player, activeSlot);

    // Only one item should get charged.
    return;
  }
}

/**
 * We cannot use the `EntityPlayer.NeedsCharge` method because we might be overcharging an item from
 * a Battery Bum.
 */
function needsCharge(
  player: EntityPlayer,
  activeSlot: ActiveSlot,
  overcharge?: boolean,
) {
  if (isActiveSlotEmpty(player, activeSlot)) {
    return false;
  }

  const totalCharge = getTotalCharge(player, activeSlot);
  const activeItem = player.GetActiveItem(activeSlot);
  const maxCharges = getCollectibleMaxCharges(activeItem);
  const hasBattery = player.HasCollectible(CollectibleType.BATTERY);
  const adjustedMaxCharges =
    hasBattery || overcharge === true ? maxCharges * 2 : maxCharges;

  return totalCharge < adjustedMaxCharges;
}

function dropButtonPressed(player: EntityPlayer) {
  return Input.IsActionPressed(ButtonAction.DROP, player.ControllerIndex);
}
