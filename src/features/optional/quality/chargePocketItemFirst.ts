// In vanilla, batteries will charge normal active items first over pocket active items
// In Racing+, this behavior is usually not what the player wants,
// because they have a D6 on the pocket active
// Flip this behavior

import {
  ensureAllCases,
  getCollectibleMaxCharges,
  getPlayerIndex,
  PlayerIndex,
  saveDataManager,
} from "isaacscript-common";
import * as charge from "../../../charge";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import { PickupVariantCustom } from "../../../types/enums";

const COLLECT_ANIMATION = "Collect";
const MICRO_BATTERY_CHARGES = 2;

const ACTIVE_SLOTS_PRECEDENCE = [
  ActiveSlot.SLOT_POCKET,
  ActiveSlot.SLOT_PRIMARY,
  ActiveSlot.SLOT_SECONDARY,
];

const v = {
  run: {
    activeItemChargesMap: new Map<PlayerIndex, Map<ActiveSlot, int>>(),
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
  rewindActiveChargesToLastFrame(player);

  // Now, charge the active items in the proper order
  for (const activeSlot of ACTIVE_SLOTS_PRECEDENCE) {
    if (player.NeedsCharge(activeSlot)) {
      player.FullCharge(activeSlot);

      // Only one item gets a full charge
      return;
    }
  }
}

function rewindActiveChargesToLastFrame(player: EntityPlayer) {
  const playerIndex = getPlayerIndex(player);
  const activeItemCharges = v.run.activeItemChargesMap.get(playerIndex);
  if (activeItemCharges === undefined) {
    error(`Failed to get the active charges for player: ${playerIndex}`);
  }

  for (const activeSlot of [
    ActiveSlot.SLOT_PRIMARY,
    ActiveSlot.SLOT_SECONDARY,
    ActiveSlot.SLOT_POCKET,
  ]) {
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

// ModCallbacks.MC_POST_PICKUP_RENDER (36)
export function postPickupRenderInvisiblePickup(pickup: EntityPickup): void {
  if (!config.chargePocketItemFirst) {
    return;
  }

  // Clean up the invisible pickups after they are finished playing the animation
  const sprite = pickup.GetSprite();
  if (!sprite.IsPlaying(COLLECT_ANIMATION)) {
    pickup.Remove();
  }
}

// ModCallbacks.MC_PRE_PICKUP_COLLISION (38)
// PickupVariant.PICKUP_LIL_BATTERY (90)
export function prePickupCollisionLilBattery(
  pickup: EntityPickup,
  collider: Entity,
): boolean | void {
  if (!config.chargePocketItemFirst) {
    return undefined;
  }

  // We don't have to re-implement Mega Batteries, because they fully charge every slot
  if (pickup.SubType === BatterySubType.BATTERY_MEGA) {
    return undefined;
  }

  // Since Golden Batteries cause other golden batteries to spawn in random rooms,
  // this would be too much work to re-implement from scratch
  // Thus, let Golden Batteries retain the vanilla behavior
  if (pickup.SubType === BatterySubType.BATTERY_GOLDEN) {
    return undefined;
  }

  const player = collider.ToPlayer();
  if (player === null) {
    return undefined;
  }

  for (const activeSlot of ACTIVE_SLOTS_PRECEDENCE) {
    if (player.NeedsCharge(activeSlot)) {
      collectBatteryPickup(player, pickup, activeSlot);
      return true; // Ignore collision
    }
  }

  return undefined;
}

function collectBatteryPickup(
  player: EntityPlayer,
  pickup: EntityPickup,
  activeSlot: ActiveSlot,
) {
  const hud = g.g.GetHUD();

  pickup.Remove();
  spawnInvisiblePickup(pickup);
  giveChargeToPlayer(player, pickup, activeSlot);
  hud.FlashChargeBar(player, activeSlot);
  charge.playSoundEffect(player, activeSlot);
}

function spawnInvisiblePickup(pickup: EntityPickup) {
  // If we play the "Collect" animation on the existing pickup,
  // it will look buggy because the shadow will remain
  // It is not possible to modify entity shadows using Lua
  // Thus, we delete the pickup and spawn an invisible pickup purely for the purposes of showing the
  // "Collect" animation
  const invisiblePickup = Isaac.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariantCustom.INVISIBLE_PICKUP,
    0,
    pickup.Position,
    Vector.Zero,
    null,
  );
  const sprite = invisiblePickup.GetSprite();
  const filename = getBatteryFilename(pickup);
  sprite.Load(filename, true);
  sprite.Play(COLLECT_ANIMATION, true);
}

function getBatteryFilename(pickup: EntityPickup) {
  const batterySubType = pickup.SubType as BatterySubType;

  switch (batterySubType) {
    case BatterySubType.BATTERY_NORMAL: {
      return "gfx/005.090_LittleBattery.anm2";
    }

    case BatterySubType.BATTERY_MICRO: {
      return "gfx/005.090_microbattery.anm2";
    }

    case BatterySubType.BATTERY_MEGA: {
      return "gfx/005.090_megabattery.anm2";
    }

    case BatterySubType.BATTERY_GOLDEN: {
      return "gfx/005.090_golden battery.anm2";
    }

    default: {
      ensureAllCases(batterySubType);
      return "";
    }
  }
}

function giveChargeToPlayer(
  player: EntityPlayer,
  pickup: EntityPickup,
  activeSlot: ActiveSlot,
) {
  const batterySubType = pickup.SubType as BatterySubType;

  // Note that AAA Battery does not synergize with batteries in vanilla
  switch (batterySubType) {
    case BatterySubType.BATTERY_NORMAL: {
      player.FullCharge(activeSlot);

      return;
    }

    case BatterySubType.BATTERY_MICRO: {
      const activeCharge = player.GetActiveCharge(activeSlot);
      const batteryCharge = player.GetBatteryCharge(activeSlot);
      const chargesToAdd = getNumChargesToAdd(
        player,
        activeSlot,
        MICRO_BATTERY_CHARGES,
      );
      const newCharge = activeCharge + batteryCharge + chargesToAdd;
      player.SetActiveCharge(newCharge, activeSlot);

      return;
    }

    case BatterySubType.BATTERY_MEGA: {
      // Intentionally not implemented
      return;
    }

    case BatterySubType.BATTERY_GOLDEN: {
      // Intentionally not implemented
      return;
    }

    default: {
      ensureAllCases(batterySubType);
    }
  }
}

function getNumChargesToAdd(
  player: EntityPlayer,
  activeSlot: ActiveSlot,
  charges: int,
) {
  const activeItem = player.GetActiveItem(activeSlot);
  const activeCharge = player.GetActiveCharge(activeSlot);
  const batteryCharge = player.GetBatteryCharge(activeSlot);
  const hasBattery = player.HasCollectible(CollectibleType.COLLECTIBLE_BATTERY);
  const maxCharges = getCollectibleMaxCharges(activeItem);

  for (let i = 0; i < charges; i++) {
    if (!hasBattery && activeCharge + i === maxCharges) {
      return i;
    }

    if (hasBattery && batteryCharge + i === maxCharges) {
      return i;
    }
  }

  return charges;
}

// ModCallbacks.MC_POST_PLAYER_UPDATE (31)
export function postPlayerUpdate(player: EntityPlayer): void {
  if (!config.chargePocketItemFirst) {
    return;
  }

  updateActiveItemChargesMap(player);
}

function updateActiveItemChargesMap(player: EntityPlayer) {
  // On every frame, we need to track the current charges for each active item that a player has so
  // that we can rewind the charges when a player uses a 48 Hour Energy! pill
  const playerIndex = getPlayerIndex(player);
  let activeItemCharges = v.run.activeItemChargesMap.get(playerIndex);
  if (activeItemCharges === undefined) {
    activeItemCharges = new Map();
    v.run.activeItemChargesMap.set(playerIndex, activeItemCharges);
  }

  for (const activeSlot of [
    ActiveSlot.SLOT_PRIMARY,
    ActiveSlot.SLOT_SECONDARY,
    ActiveSlot.SLOT_POCKET,
  ]) {
    const activeItem = player.GetActiveItem(activeSlot);
    if (activeItem === CollectibleType.COLLECTIBLE_NULL) {
      continue;
    }
    const activeCharge = player.GetActiveCharge(activeSlot);
    const batteryCharge = player.GetBatteryCharge(activeSlot);
    const totalCharge = activeCharge + batteryCharge;
    activeItemCharges.set(activeSlot, totalCharge);
  }
}
