// In vanilla, active items will be charged in the following order:
// 1) ActiveSlot.PRIMARY
// 2) ActiveSlot.SECONDARY
// 3) ActiveSlot.POCKET

// In Racing+, this behavior is usually not what the player wants, because they have a D6 on the
// pocket active. Change the precedence such that the pocket active has priority.

// This feature handles the following situations:
// - Batteries (all sub-types)
// - Charged keys
// - Coins with the Charged Penny trinket
// - 48 Hour Energy pill
// - Hairpin trinket
// - Battery Bum
// - 9 Volt
// - Battery Pack

import {
  ActiveSlot,
  BatterySubType,
  ButtonAction,
  CollectibleType,
  KeySubType,
  PickupVariant,
  RoomType,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  DefaultMap,
  defaultMapGetPlayer,
  ensureAllCases,
  getCollectibleMaxCharges,
  getTotalCharge,
  isActiveSlotEmpty,
  log,
  playChargeSoundEffect,
  PlayerIndex,
  saveDataManager,
} from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";

interface ChargeSituation {
  numCharges: int;
  overcharge?: boolean;
}

const ACTIVE_SLOTS_PRECEDENCE: readonly ActiveSlot[] = [
  ActiveSlot.POCKET,
  ActiveSlot.PRIMARY,
  ActiveSlot.SECONDARY,
];

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

export function init(): void {
  saveDataManager("chargePocketItemFirst", v, featureEnabled);
}

function featureEnabled() {
  return config.chargePocketItemFirst;
}

function chargePocketFeatureShouldApply(player: EntityPlayer) {
  return config.chargePocketItemFirst && !dropButtonPressed(player);
}

function dropButtonPressed(player: EntityPlayer) {
  return Input.IsActionPressed(ButtonAction.DROP, player.ControllerIndex);
}

// ModCallback.POST_PEFFECT_UPDATE (4)
export function postPEffectUpdate(player: EntityPlayer): void {
  if (!chargePocketFeatureShouldApply(player)) {
    return;
  }

  checkBatteryBumCharge(player); // This must come before updating the map
  checkHairpinCharge(player); // This must come before updating the map
  updateActiveItemChargesMap(player);
}

function checkBatteryBumCharge(player: EntityPlayer) {
  if (v.run.checkForBatteryBumChargesUntilGameFrame === null) {
    return;
  }

  const gameFrameCount = g.g.GetFrameCount();
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

function checkHairpinCharge(player: EntityPlayer) {
  const roomType = g.r.GetType();
  const roomFrameCount = g.r.GetFrameCount();
  const firstVisit = g.r.IsFirstVisit();
  const hasHairpin = player.HasTrinket(TrinketType.HAIRPIN);

  if (
    roomType !== RoomType.BOSS ||
    roomFrameCount !== 1 ||
    !firstVisit ||
    !hasHairpin
  ) {
    return;
  }

  // Hairpin charges the active item on the 1st frame of the room. Thus, we have to perform this
  // check in the PostPEffectUpdate callback instead of the PostNewRoom callback.
  const chargeSituation: ChargeSituation = {
    numCharges: LIL_BATTERY_CHARGES,
  };
  checkSwitchCharge(player, chargeSituation);
}

function updateActiveItemChargesMap(player: EntityPlayer) {
  // On every frame, we need to track the current charges for each active item that a player has for
  // the purposes of rewinding the charges.
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

// ModCallback.POST_USE_PILL (10)
// PillEffect.FORTY_EIGHT_HOUR_ENERGY (20)
export function usePill48HourEnergy(player: EntityPlayer): void {
  if (!chargePocketFeatureShouldApply(player)) {
    return;
  }

  const chargeSituation: ChargeSituation = {
    numCharges: LIL_BATTERY_CHARGES,
  };
  checkSwitchCharge(player, chargeSituation);
}

// ModCallback.INPUT_ACTION (13)
export function isActionTriggeredItem(
  entity: Entity | undefined,
): boolean | undefined {
  if (entity === undefined) {
    return undefined;
  }

  const player = entity.ToPlayer();
  if (player === undefined) {
    return undefined;
  }

  if (!chargePocketFeatureShouldApply(player)) {
    return undefined;
  }

  // Prevent using the active item before the charges have been swapped.
  const roomFrameCount = g.r.GetFrameCount();
  const hasHairpin = player.HasTrinket(TrinketType.HAIRPIN);

  const batteryBumCharging =
    v.run.checkForBatteryBumChargesUntilGameFrame !== null;
  const hairpinActivating = hasHairpin && roomFrameCount <= 1;
  const shouldStopActiveItemUses = batteryBumCharging || hairpinActivating;

  return shouldStopActiveItemUses ? false : undefined;
}

// ModCallbackCustom.POST_PICKUP_COLLECT
export function postPickupCollect(
  pickup: EntityPickup,
  player: EntityPlayer,
): void {
  if (!chargePocketFeatureShouldApply(player)) {
    return;
  }

  const chargeSituation = getChargeSituationForPickup(
    pickup.Variant,
    pickup.SubType,
    player,
  );
  checkSwitchCharge(player, chargeSituation);
}

// ModCallbackCustom.POST_ITEM_PICKUP
// ItemType.PASSIVE (1)
// CollectibleType.9_VOLT (116)
export function postItemPickup9Volt(player: EntityPlayer): void {
  if (!chargePocketFeatureShouldApply(player)) {
    return;
  }

  const chargeSituation: ChargeSituation = {
    numCharges: LIL_BATTERY_CHARGES,
  };
  checkSwitchCharge(player, chargeSituation);
}

// ModCallbackCustom.POST_ITEM_PICKUP
// ItemType.PASSIVE (1)
// CollectibleType.BATTERY_PACK (603)
export function postItemPickupBatteryPack(player: EntityPlayer): void {
  if (!chargePocketFeatureShouldApply(player)) {
    return;
  }

  const chargeSituation: ChargeSituation = {
    numCharges: LIL_BATTERY_CHARGES,
  };
  checkSwitchCharge(player, chargeSituation);
}

// ModCallbackCustom.POST_PURCHASE
export function postPurchase(player: EntityPlayer, pickup: EntityPickup): void {
  if (!chargePocketFeatureShouldApply(player)) {
    return;
  }

  const chargeSituation = getChargeSituationForPickup(
    pickup.Variant,
    pickup.SubType,
    player,
  );
  checkSwitchCharge(player, chargeSituation);
}

// ModCallbackCustom.POST_SLOT_ANIMATION_CHANGED
// SlotVariant.BATTERY_BUM (13)
export function postSlotAnimationChangedBatteryBum(
  _slot: Entity,
  _previousAnimation: string,
  currentAnimation: string,
): void {
  const player = Isaac.GetPlayer();
  const gameFrameCount = g.g.GetFrameCount();

  if (!chargePocketFeatureShouldApply(player)) {
    return;
  }

  if (currentAnimation === "Prize") {
    v.run.checkForBatteryBumChargesUntilGameFrame =
      gameFrameCount + BATTERY_BUM_CHARGE_DELAY_FRAMES;
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
      if ((pickupSubType as KeySubType) === KeySubType.CHARGED) {
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
      return getChargeSituationForBattery(pickupSubType as BatterySubType);
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
      ensureAllCases(batterySubType);

      // Handle modded battery types.
      // @ts-expect-error Modded pickups fall outside of the type system.
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
    log(
      'Error: The activeItemCharges map was not initialized yet in the "checkActiveItemsChargeChange" function.',
    );
    return false;
  }

  const activeItemsChanged = new Set<ActiveSlot>();
  for (const [activeSlot, oldTotalCharge] of activeItemCharges.entries()) {
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
    log(
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
  const hud = g.g.GetHUD();

  // Now, charge the active items in the proper order.
  for (const activeSlot of ACTIVE_SLOTS_PRECEDENCE) {
    if (!needsCharge(player, activeSlot, chargeSituation.overcharge)) {
      continue;
    }

    const totalCharge = getTotalCharge(player, activeSlot);
    if (chargeSituation.numCharges === undefined) {
      error(
        "Failed to find the number of charges in the charge situation object.",
      );
    }
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
