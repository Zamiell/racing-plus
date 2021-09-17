// In vanilla, active items will be charged in the following order:
// 1) ActiveSlot.SLOT_PRIMARY
// 2) ActiveSlot.SLOT_SECONDARY
// 3) ActiveSlot.SLOT_POCKET
// In Racing+, this behavior is usually not what the player wants,
// because they have a D6 on the pocket active
// Change the precedence such that the pocket active has priority

// This feature handles the following situations:
// 1) Batteries (all subtypes)
// 2) Charged keys
// 3) Coins with the Charged Penny trinket
// 4) 48 Hour Energy! pill
// 5) Hairpin trinket

import {
  ensureAllCases,
  getCollectibleMaxCharges,
  getPlayerIndex,
  getTotalCharge,
  PlayerIndex,
  saveDataManager,
} from "isaacscript-common";
import * as charge from "../../../charge";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";

interface ChargeSituation {
  chargeType: ChargeType;
  numCharges?: int;
  overcharge?: boolean;
}

enum ChargeType {
  NONE,
  N_CHARGES,
}

const ACTIVE_SLOTS_PRECEDENCE = [
  ActiveSlot.SLOT_POCKET,
  ActiveSlot.SLOT_PRIMARY,
  ActiveSlot.SLOT_SECONDARY,
];

// The maximum amount of charges that a Battery Bum can grant is 3
// The third charge occurs on the 40th frame after the "Prize" animation begins
const BATTERY_BUM_CHARGE_DELAY_FRAMES = 40;

const LIL_BATTERY_CHARGES = 6;
const MICRO_BATTERY_CHARGES = 2;

const v = {
  run: {
    activeItemChargesMap: new Map<PlayerIndex, Map<ActiveSlot, int>>(),
    checkForBatteryBumChargesUntilFrame: null as int | null,
  },

  room: {
    checkedHairpin: false,
    batteryBumAnimationMap: new Map<PtrHash, string>(),
  },
};

export function init(): void {
  saveDataManager("chargePocketItemFirst", v, featureEnabled);
}

function featureEnabled() {
  return config.chargePocketItemFirst;
}

// ModCallbacks.MC_USE_PILL (10)
export function usePill48HourEnergy(player: EntityPlayer): void {
  if (!chargePocketFeatureShouldApply(player)) {
    return;
  }

  const chargeSituation: ChargeSituation = {
    chargeType: ChargeType.N_CHARGES,
    numCharges: LIL_BATTERY_CHARGES,
  };
  checkSwitchCharge(player, chargeSituation);
}

// ModCallbacks.MC_POST_PLAYER_UPDATE (31)
export function postPlayerUpdate(player: EntityPlayer): void {
  if (!chargePocketFeatureShouldApply(player)) {
    return;
  }

  checkBatteryBumCharge(player); // This must come before updating the map
  checkHairpinCharge(player); // This must come before updating the map
  updateActiveItemChargesMap(player);
}

function checkBatteryBumCharge(player: EntityPlayer) {
  if (v.run.checkForBatteryBumChargesUntilFrame === null) {
    return;
  }

  const gameFrameCount = g.g.GetFrameCount();
  if (gameFrameCount > v.run.checkForBatteryBumChargesUntilFrame) {
    v.run.checkForBatteryBumChargesUntilFrame = null;
    return;
  }

  const chargeSituation: ChargeSituation = {
    chargeType: ChargeType.N_CHARGES,
    numCharges: 1,
    overcharge: true,
  };
  checkSwitchCharge(player, chargeSituation);
}

function checkHairpinCharge(player: EntityPlayer) {
  const roomType = g.r.GetType();
  const roomFrameCount = g.r.GetFrameCount();
  const firstVisit = g.r.IsFirstVisit();
  const hasHairpin = player.HasTrinket(TrinketType.TRINKET_HAIRPIN);

  if (
    roomType !== RoomType.ROOM_BOSS ||
    roomFrameCount !== 1 ||
    !firstVisit ||
    !hasHairpin ||
    v.room.checkedHairpin
  ) {
    return;
  }

  // The PostPlayerUpdate callback will fire multiple times per frame,
  // but we only need to check for the Hairpin once
  v.room.checkedHairpin = true;

  // Hairpin charges the active item on the 1st frame of the room
  // Thus, we have to perform this check in the PostPlayerUpdate callback instead of the PostNewRoom
  // callback
  const chargeSituation: ChargeSituation = {
    chargeType: ChargeType.N_CHARGES,
    numCharges: LIL_BATTERY_CHARGES,
  };
  checkSwitchCharge(player, chargeSituation);
}

function updateActiveItemChargesMap(player: EntityPlayer) {
  // On every frame, we need to track the current charges for each active item that a player has for
  // the purposes of rewinding the charges
  const playerIndex = getPlayerIndex(player);
  let activeItemCharges = v.run.activeItemChargesMap.get(playerIndex);
  if (activeItemCharges === undefined) {
    activeItemCharges = new Map();
    v.run.activeItemChargesMap.set(playerIndex, activeItemCharges);
  }

  for (const activeSlot of ACTIVE_SLOTS_PRECEDENCE) {
    const activeItem = player.GetActiveItem(activeSlot);
    if (activeItem === CollectibleType.COLLECTIBLE_NULL) {
      continue;
    }

    const totalCharge = getTotalCharge(player, activeSlot);
    activeItemCharges.set(activeSlot, totalCharge);
  }
}

// ModCallbacksCustom.MC_POST_PICKUP_COLLECT
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

// ModCallbacksCustom.MC_POST_ITEM_PICKUP
// ItemType.ITEM_PASSIVE (1)
// CollectibleType.COLLECTIBLE_9_VOLT (116)
export function postItemPickup9Volt(player: EntityPlayer): void {
  if (!chargePocketFeatureShouldApply(player)) {
    return;
  }

  const chargeSituation: ChargeSituation = {
    chargeType: ChargeType.N_CHARGES,
    numCharges: LIL_BATTERY_CHARGES,
  };
  checkSwitchCharge(player, chargeSituation);
}

// ModCallbacksCustom.MC_POST_ITEM_PICKUP
// ItemType.ITEM_PASSIVE (1)
// CollectibleType.COLLECTIBLE_BATTERY_PACK (603)
export function postItemPickupBatteryPack(player: EntityPlayer): void {
  if (!chargePocketFeatureShouldApply(player)) {
    return;
  }

  const chargeSituation: ChargeSituation = {
    chargeType: ChargeType.N_CHARGES,
    numCharges: LIL_BATTERY_CHARGES,
  };
  checkSwitchCharge(player, chargeSituation);
}

// ModCallbacksCustom.MC_POST_PURCHASE
export function postPurchase(
  player: EntityPlayer,
  pickupVariant: PickupVariant,
  pickupSubType: int,
): void {
  if (!chargePocketFeatureShouldApply(player)) {
    return;
  }

  const chargeSituation = getChargeSituationForPickup(
    pickupVariant,
    pickupSubType,
    player,
  );
  checkSwitchCharge(player, chargeSituation);
}

// ModCallbacksCustom.MC_POST_SLOT_UPDATE
// SlotVariant.BATTERY_BUM (13)
export function postSlotUpdateBatteryBum(slot: Entity): void {
  const player = Isaac.GetPlayer();

  if (!chargePocketFeatureShouldApply(player)) {
    return;
  }

  const gameFrameCount = g.g.GetFrameCount();
  const ptrHash = GetPtrHash(slot);
  const lastAnimation = v.room.batteryBumAnimationMap.get(ptrHash);
  const sprite = slot.GetSprite();
  const animation = sprite.GetAnimation();
  if (animation === lastAnimation) {
    return;
  }
  v.room.batteryBumAnimationMap.set(ptrHash, animation);

  if (animation === "Prize") {
    v.run.checkForBatteryBumChargesUntilFrame =
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
    case PickupVariant.PICKUP_COIN: {
      if (player.HasTrinket(TrinketType.TRINKET_CHARGED_PENNY)) {
        return {
          chargeType: ChargeType.N_CHARGES,
          numCharges: 1,
        };
      }

      return {
        chargeType: ChargeType.NONE,
      };
    }

    // 30
    case PickupVariant.PICKUP_KEY: {
      if (pickupSubType === KeySubType.KEY_CHARGED) {
        return {
          chargeType: ChargeType.N_CHARGES,
          numCharges: LIL_BATTERY_CHARGES,
        };
      }

      return {
        chargeType: ChargeType.NONE,
      };
    }

    // 90
    case PickupVariant.PICKUP_LIL_BATTERY: {
      return getChargeSituationForBattery(pickupSubType);
    }

    default: {
      return {
        chargeType: ChargeType.NONE,
      };
    }
  }
}

function getChargeSituationForBattery(batterySubType: BatterySubType) {
  switch (batterySubType) {
    case BatterySubType.BATTERY_NORMAL: {
      return {
        chargeType: ChargeType.N_CHARGES,
        numCharges: LIL_BATTERY_CHARGES,
      };
    }

    case BatterySubType.BATTERY_MICRO: {
      return {
        chargeType: ChargeType.N_CHARGES,
        numCharges: MICRO_BATTERY_CHARGES,
      };
    }

    case BatterySubType.BATTERY_MEGA: {
      // This fully-charges every active item, so this feature does not need to handle it
      return {
        chargeType: ChargeType.NONE,
      };
    }

    case BatterySubType.BATTERY_GOLDEN: {
      return {
        chargeType: ChargeType.N_CHARGES,
        numCharges: LIL_BATTERY_CHARGES,
      };
    }

    default: {
      ensureAllCases(batterySubType);
      return {
        chargeType: ChargeType.NONE,
      };
    }
  }
}

function checkSwitchCharge(
  player: EntityPlayer,
  chargeSituation: ChargeSituation,
) {
  if (chargeSituation.chargeType === ChargeType.NONE) {
    return;
  }

  if (!checkActiveItemsChargeChange(player)) {
    return;
  }

  rewindActiveChargesToLastFrame(player);
  giveCharge(player, chargeSituation);
}

function checkActiveItemsChargeChange(player: EntityPlayer) {
  const playerIndex = getPlayerIndex(player);
  const activeItemCharges = v.run.activeItemChargesMap.get(playerIndex);
  if (activeItemCharges === undefined) {
    error(
      `Failed to get the stored active item charges for player: ${playerIndex}`,
    );
  }

  const activeItemsChanged = new Set<ActiveSlot>();
  for (const [activeSlot, oldTotalCharge] of activeItemCharges.entries()) {
    const activeItem = player.GetActiveItem(activeSlot);
    if (activeItem === CollectibleType.COLLECTIBLE_NULL) {
      continue;
    }

    const totalCharge = getTotalCharge(player, activeSlot);
    if (totalCharge !== oldTotalCharge) {
      Isaac.DebugString(
        `GETTING HERE ACTIVE SLOT CHANGED ${activeSlot}, from ${oldTotalCharge} to ${totalCharge}`,
      );
      Isaac.DebugString(
        `GETTING HERE TYPES ${type(activeSlot)}, from ${type(
          oldTotalCharge,
        )} to ${type(totalCharge)}`,
      );
      activeItemsChanged.add(activeSlot);
    }
  }

  if (activeItemsChanged.has(ActiveSlot.SLOT_POCKET)) {
    // We do not need to reorder any charges if it is the pocket active that got charged
    return false;
  }

  // We do not want to reorder charges in situations where all of the active items are charged,
  // so do nothing if more than one active item changed
  return activeItemsChanged.size === 1;
}

function rewindActiveChargesToLastFrame(player: EntityPlayer) {
  const playerIndex = getPlayerIndex(player);
  const activeItemCharges = v.run.activeItemChargesMap.get(playerIndex);
  if (activeItemCharges === undefined) {
    error(`Failed to get the active charges for player: ${playerIndex}`);
  }

  for (const activeSlot of ACTIVE_SLOTS_PRECEDENCE) {
    const activeItem = player.GetActiveItem(activeSlot);
    if (activeItem === CollectibleType.COLLECTIBLE_NULL) {
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

  // Now, charge the active items in the proper order
  for (const activeSlot of ACTIVE_SLOTS_PRECEDENCE) {
    if (!needsCharge(player, activeSlot, chargeSituation.overcharge)) {
      continue;
    }

    if (chargeSituation.chargeType === ChargeType.N_CHARGES) {
      const totalCharge = getTotalCharge(player, activeSlot);
      if (chargeSituation.numCharges === undefined) {
        error(
          "Failed to find the number of charges in the charge situation object.",
        );
      }
      let newCharge = totalCharge + chargeSituation.numCharges;
      const activeItem = player.GetActiveItem(activeSlot);
      let maxCharges = getCollectibleMaxCharges(activeItem);
      const hasBattery = player.HasCollectible(
        CollectibleType.COLLECTIBLE_BATTERY,
      );
      if (hasBattery || chargeSituation.overcharge === true) {
        maxCharges *= 2;
      }
      if (newCharge > maxCharges) {
        newCharge = maxCharges;
      }

      player.SetActiveCharge(newCharge, activeSlot);
    }

    hud.FlashChargeBar(player, activeSlot);
    charge.playSoundEffect(player, activeSlot);

    // Only one item should get charged
    return;
  }
}

// We cannot use the "player.NeedsCharge()" method because we might be overcharging an item from a
// Battery Bum
function needsCharge(
  player: EntityPlayer,
  activeSlot: ActiveSlot,
  overcharge?: boolean,
) {
  const activeItem = player.GetActiveItem(activeSlot);
  if (activeItem === CollectibleType.COLLECTIBLE_NULL) {
    return false;
  }

  const totalCharge = getTotalCharge(player, activeSlot);
  const maxCharges = getCollectibleMaxCharges(activeItem);
  const hasBattery = player.HasCollectible(CollectibleType.COLLECTIBLE_BATTERY);
  const adjustedMaxCharges =
    hasBattery || overcharge === true ? maxCharges * 2 : maxCharges;

  return totalCharge < adjustedMaxCharges;
}

function chargePocketFeatureShouldApply(player: EntityPlayer) {
  return config.chargePocketItemFirst && !dropButtonPressed(player);
}

function dropButtonPressed(player: EntityPlayer) {
  return Input.IsActionPressed(
    ButtonAction.ACTION_DROP,
    player.ControllerIndex,
  );
}
