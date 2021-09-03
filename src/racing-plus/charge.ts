import { getCollectibleMaxCharges, getPlayers } from "isaacscript-common";
import g from "./globals";

// Give a charge to the active items of all players
export function checkAdd(): void {
  for (const player of getPlayers()) {
    for (const activeSlot of [
      ActiveSlot.SLOT_PRIMARY,
      ActiveSlot.SLOT_SECONDARY,
      ActiveSlot.SLOT_POCKET,
    ]) {
      if (player.NeedsCharge(activeSlot)) {
        add(player, activeSlot);
      }
    }
  }
}

export function add(player: EntityPlayer, activeSlot: ActiveSlot): void {
  const hud = g.g.GetHUD();

  // Find out the new charge to set on the item
  const activeCharge = player.GetActiveCharge(activeSlot);
  const batteryCharge = player.GetBatteryCharge(activeSlot);
  const chargesToAdd = getNumChargesToAdd(player, activeSlot);
  const modifiedChargesToAdd = getNumChargesWithAAAModifier(
    player,
    activeSlot,
    chargesToAdd,
  );
  const newCharge = activeCharge + batteryCharge + modifiedChargesToAdd;

  player.SetActiveCharge(newCharge, activeSlot);
  hud.FlashChargeBar(player, activeSlot);

  playSoundEffect(player, activeSlot);
}

export function playSoundEffect(
  player: EntityPlayer,
  activeSlot: ActiveSlot,
): void {
  const chargeSoundEffect = shouldPlayFullRechargeSound(player, activeSlot)
    ? SoundEffect.SOUND_BATTERYCHARGE
    : SoundEffect.SOUND_BEEP;
  if (!g.sfx.IsPlaying(chargeSoundEffect)) {
    g.sfx.Play(chargeSoundEffect);
  }
}

function getNumChargesToAdd(player: EntityPlayer, activeSlot: ActiveSlot) {
  const roomShape = g.r.GetRoomShape();
  const activeItem = player.GetActiveItem(activeSlot);
  const activeCharge = player.GetActiveCharge(activeSlot);
  const batteryCharge = player.GetBatteryCharge(activeSlot);
  const hasBattery = player.HasCollectible(CollectibleType.COLLECTIBLE_BATTERY);
  const maxCharges = getCollectibleMaxCharges(activeItem);

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
  activeSlot: ActiveSlot,
  chargesToAdd: int,
) {
  const activeItem = player.GetActiveItem(activeSlot);
  const activeCharge = player.GetActiveCharge(activeSlot);
  const batteryCharge = player.GetBatteryCharge(activeSlot);
  const hasBattery = player.HasCollectible(CollectibleType.COLLECTIBLE_BATTERY);
  const hasAAABattery = player.HasTrinket(TrinketType.TRINKET_AAA_BATTERY);
  const maxCharges = getCollectibleMaxCharges(activeItem);

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

function shouldPlayFullRechargeSound(
  player: EntityPlayer,
  activeSlot: ActiveSlot,
) {
  const activeItem = player.GetActiveItem(activeSlot);
  const activeCharge = player.GetActiveCharge(activeSlot);
  const batteryCharge = player.GetBatteryCharge(activeSlot);
  const hasBattery = player.HasCollectible(CollectibleType.COLLECTIBLE_BATTERY);
  const maxCharges = getCollectibleMaxCharges(activeItem);

  if (!hasBattery) {
    // Play the full recharge sound if we are now fully charged
    return !player.NeedsCharge(activeSlot);
  }

  // Play the full recharge sound if we are now fully charged or we are exactly half-way charged
  return (
    !player.NeedsCharge(activeSlot) ||
    (activeCharge === maxCharges && batteryCharge === 0)
  );
}
