// Give a charge to the player's active item

import g from "../../../../globals";
import { getItemMaxCharges, getPlayers } from "../../../../misc";

// Give a charge to the active items of all players
export function checkAdd(): void {
  for (const player of getPlayers()) {
    for (const slot of [
      ActiveSlot.SLOT_PRIMARY,
      ActiveSlot.SLOT_SECONDARY,
      ActiveSlot.SLOT_POCKET,
    ]) {
      if (player.NeedsCharge(slot)) {
        add(player, slot);
      }
    }
  }
}

function add(player: EntityPlayer, slot: ActiveSlot) {
  const hud = g.g.GetHUD();

  // Find out the new charge to set on the item
  const currentCharge = player.GetActiveCharge(slot);
  const batteryCharge = player.GetBatteryCharge(slot);
  const chargesToAdd = getNumChargesToAdd(player, slot);
  const modifiedChargesToAdd = getNumChargesWithAAAModifier(
    player,
    slot,
    chargesToAdd,
  );
  const newCharge = currentCharge + batteryCharge + modifiedChargesToAdd;

  player.SetActiveCharge(newCharge, slot);
  hud.FlashChargeBar(player, slot);

  const chargeSoundEffect = shouldPlayFullRechargeSound(player, slot)
    ? SoundEffect.SOUND_BATTERYCHARGE
    : SoundEffect.SOUND_BEEP;
  if (!g.sfx.IsPlaying(chargeSoundEffect)) {
    g.sfx.Play(chargeSoundEffect);
  }
}

function getNumChargesToAdd(player: EntityPlayer, slot: ActiveSlot) {
  const roomShape = g.r.GetRoomShape();
  const activeItem = player.GetActiveItem(slot);
  const activeCharge = player.GetActiveCharge(slot);
  const batteryCharge = player.GetBatteryCharge(slot);
  const hasBattery = player.HasCollectible(CollectibleType.COLLECTIBLE_BATTERY);
  const maxCharges = getItemMaxCharges(activeItem);

  if (!hasBattery && activeCharge === maxCharges) {
    return 0;
  }

  if (hasBattery && batteryCharge === maxCharges) {
    return 0;
  }

  if (!hasBattery && activeCharge + 1 === maxCharges) {
    // We are only 1 charge away from a full charge,
    // so only add one charge to avoid an overcharge
    // (it is possible to set orange charges without the player actually having The Battery)
    return 1;
  }

  if (hasBattery && batteryCharge + 1 === maxCharges) {
    // We are only 1 charge away from a full double-charge
    // so only add one charge to avoid an overcharge
    return 1;
  }

  if (roomShape >= RoomShape.ROOMSHAPE_2x2) {
    // 2x2 rooms and L rooms should grant 2 charges
    return 2;
  }

  // Clearing a room grants 1 charge by default
  return 1;
}

// The AAA Battery should grant an extra charge when the active item is one away from being fully
// charged
function getNumChargesWithAAAModifier(
  player: EntityPlayer,
  slot: ActiveSlot,
  chargesToAdd: int,
) {
  const activeItem = player.GetActiveItem(slot);
  const activeCharge = player.GetActiveCharge(slot);
  const batteryCharge = player.GetBatteryCharge(slot);
  const hasBattery = player.HasCollectible(CollectibleType.COLLECTIBLE_BATTERY);
  const hasAAABattery = player.HasTrinket(TrinketType.TRINKET_AAA_BATTERY);
  const maxCharges = getItemMaxCharges(activeItem);

  if (!hasAAABattery) {
    return chargesToAdd;
  }

  if (!hasBattery && activeCharge + chargesToAdd === maxCharges - 1) {
    return maxCharges + 1;
  }

  if (hasBattery && batteryCharge + chargesToAdd === maxCharges - 1) {
    return maxCharges + 1;
  }

  return chargesToAdd;
}

function shouldPlayFullRechargeSound(player: EntityPlayer, slot: ActiveSlot) {
  const activeItem = player.GetActiveItem(slot);
  const activeCharge = player.GetActiveCharge(slot);
  const batteryCharge = player.GetBatteryCharge(slot);
  const hasBattery = player.HasCollectible(CollectibleType.COLLECTIBLE_BATTERY);
  const maxCharges = getItemMaxCharges(activeItem);

  if (!hasBattery) {
    // Play the full recharge sound if we are now fully charged
    return !player.NeedsCharge(slot);
  }

  // Play the full recharge sound if we are now fully charged or we are exactly half-way charged
  return (
    !player.NeedsCharge(slot) ||
    (activeCharge === maxCharges && batteryCharge === 0)
  );
}
