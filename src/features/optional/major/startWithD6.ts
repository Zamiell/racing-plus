// A major feature of Racing+ is to give every character the D6,
// since it heavily reduces run disparity

// We choose to give the D6 as a pocket active item
// If we instead gave the D6 as a normal active item, the vast majority of the active items in the
// game would go unused, since players hardly ever drop the D6 for anything
// Giving the D6 as a pocket active fixes this problem

// Some characters already have pocket active items
// In these cases, we could award the D6 as an active item
// However, we want players to have consistent muscle memory for which key to use the D6 on
// Thus, we strip the vanilla pocket active item and move it to the active item slot
// (the exception for this is Tainted Cain, since the Bag of Crafting does not work properly in the
// active slot)

import {
  findFreePosition,
  getCollectibleMaxCharges,
  getPlayerIndex,
  getPlayers,
  getPlayersOfType,
  hasOpenActiveItemSlot,
  inGenesisRoom,
  isJacobOrEsau,
  log,
  PlayerIndex,
  runNextFrame,
  saveDataManager,
  spawnCollectible,
} from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import { CollectibleTypeCustom } from "../../../types/CollectibleTypeCustom";

const D6_STARTING_CHARGE = 6;

const v = {
  run: {
    pocketActiveD6Charge: new Map<PlayerIndex, int>(),
    currentFlipCharge: 0,
  },
};

export function init(): void {
  saveDataManager("startWithD6", v, featureEnabled);
}

function featureEnabled() {
  return config.startWithD6;
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  if (!config.startWithD6) {
    return;
  }

  for (const player of getPlayers()) {
    giveD6(player);
  }
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (!config.startWithD6) {
    return;
  }

  checkGenesisRoom();
}

// When the player uses Genesis, it will strip the pocket D6 from them
// Give it back to them if this is the case
function checkGenesisRoom() {
  if (!inGenesisRoom()) {
    return;
  }

  for (const player of getPlayers()) {
    giveD6(player);
  }
}

// ModCallbacks.MC_PRE_USE_ITEM (23)
export function preUseItemFlip(player: EntityPlayer, useFlags: int): void {
  const character = player.GetPlayerType();
  if (
    character !== PlayerType.PLAYER_LAZARUS_B &&
    character !== PlayerType.PLAYER_LAZARUS2_B
  ) {
    return;
  }

  // This function is triggered when:
  // 1) Flip is used by the player
  // 2) Flip is triggered automatically by clearing a room
  // Record the current charge so that we can propagate it to the other Flip
  // We can't use the ActiveSlot passed by the callback because it will be -1 when Flip is triggered
  // via a room clear
  const flipActiveSlot = getFlipActiveSlot(player);
  if (flipActiveSlot === null) {
    return;
  }

  const flipCharge = player.GetActiveCharge(flipActiveSlot);

  // UseFlag.USE_OWNED will be set if this is a manual invocation
  const flipTriggeredByRoomClear = useFlags === 0;

  v.run.currentFlipCharge = flipTriggeredByRoomClear ? flipCharge : 0;
}

function getFlipActiveSlot(player: EntityPlayer) {
  for (const activeSlot of [
    ActiveSlot.SLOT_PRIMARY,
    ActiveSlot.SLOT_SECONDARY,
  ]) {
    const activeItem = player.GetActiveItem(activeSlot);
    if (
      activeItem === CollectibleType.COLLECTIBLE_FLIP ||
      activeItem === CollectibleTypeCustom.COLLECTIBLE_FLIP_CUSTOM
    ) {
      return activeSlot;
    }
  }

  return null;
}

// ModCallbacks.MC_POST_PEFFECT_UPDATE (4)
export function postPEffectUpdate(player: EntityPlayer): void {
  if (!config.startWithD6) {
    return;
  }

  const index = getPlayerIndex(player);
  const pocketActiveCharge = player.GetActiveCharge(ActiveSlot.SLOT_POCKET);
  v.run.pocketActiveD6Charge.set(index, pocketActiveCharge);
}

// ModCallbacksCustom.MC_POST_PLAYER_CHANGE_TYPE
export function postPlayerChangeType(player: EntityPlayer): void {
  if (!config.startWithD6) {
    return;
  }

  changedCharacterInSomeWay(player);
}

// ModCallbacksCustom.MC_POST_FLIP
export function postFlip(player: EntityPlayer): void {
  const character = player.GetPlayerType();
  if (
    character !== PlayerType.PLAYER_LAZARUS_B &&
    character !== PlayerType.PLAYER_LAZARUS2_B
  ) {
    return;
  }

  // Normally, Tainted Lazarus has Flip in a pocket active slot,
  // and the amount of charges on the Flip is maintained between characters
  // However, this does not happen if the item is in a normal active slot,
  // so we have to manually ensure that the charge state is duplicated
  const flipActiveSlot = getFlipActiveSlot(player);
  if (flipActiveSlot === null) {
    return;
  }

  // We cannot simply set the active charge, because Tainted Lazarus will get an additional charge
  // on the next frame, causing them to get a double-charge for clearing a room
  // Thus, defer setting the charge for a frame
  runNextFrame(() => {
    player.SetActiveCharge(v.run.currentFlipCharge, flipActiveSlot);
  });
}

// ModCallbacksCustom.MC_POST_FIRST_FLIP
export function postFirstFlip(player: EntityPlayer): void {
  if (!config.startWithD6) {
    return;
  }

  changedCharacterInSomeWay(player);
}

// ModCallbacksCustom.MC_POST_FIRST_ESAU_JR
export function postFirstEsauJr(player: EntityPlayer): void {
  if (!config.startWithD6) {
    return;
  }

  changedCharacterInSomeWay(player, true);
}

function changedCharacterInSomeWay(
  player: EntityPlayer,
  gotHereFromEsauJr = false,
) {
  const character = player.GetPlayerType();
  if (character === PlayerType.PLAYER_JACOB) {
    // Calling giveD6 on Jacob doesn't grant the D6 to Esau for an unknown reason so we have
    // to call the function on Esau
    for (const newPlayer of getPlayersOfType(PlayerType.PLAYER_ESAU)) {
      giveD6(newPlayer, gotHereFromEsauJr);
    }
  }

  // In some cases, switching the character will delete the D6, so we may need to give another one
  giveD6(player, gotHereFromEsauJr);
}

// ModCallbacksCustom.MC_POST_ITEM_PICKUP
// ItemType.ITEM_PASSIVE (1)
// CollectibleType.COLLECTIBLE_BIRTHRIGHT (619)
export function postItemPickupBirthright(player: EntityPlayer): void {
  if (!config.startWithD6) {
    return;
  }

  const character = player.GetPlayerType();
  if (character !== PlayerType.PLAYER_THEFORGOTTEN_B) {
    return;
  }

  // Birthright will give a pocket active item of Recall, which will replace the D6
  // Give the D6 back and make Recall a normal active item
  const pocketActive = player.GetActiveItem(ActiveSlot.SLOT_POCKET);
  const itemToReplace = CollectibleType.COLLECTIBLE_RECALL;
  if (pocketActive !== itemToReplace) {
    return;
  }

  const index = getPlayerIndex(player);
  let d6Charge = v.run.pocketActiveD6Charge.get(index);
  if (d6Charge === undefined) {
    d6Charge = D6_STARTING_CHARGE;
  }

  player.SetPocketActiveItem(
    CollectibleType.COLLECTIBLE_D6,
    ActiveSlot.SLOT_POCKET,
  );
  player.SetActiveCharge(d6Charge, ActiveSlot.SLOT_POCKET);

  const itemCharges = getCollectibleMaxCharges(itemToReplace);
  giveActiveItem(player, itemToReplace, itemCharges);
}

function giveD6(player: EntityPlayer, gotHereFromEsauJr = false) {
  const character = player.GetPlayerType();
  const pocketItem = player.GetActiveItem(ActiveSlot.SLOT_POCKET);
  const pocketItemCharge = player.GetActiveCharge(ActiveSlot.SLOT_POCKET);
  const pocketItemBatteryCharge = player.GetBatteryCharge(
    ActiveSlot.SLOT_POCKET,
  );
  const pocketItemTotalCharge = pocketItemCharge + pocketItemBatteryCharge;
  const hasPocketD6 = pocketItem === CollectibleType.COLLECTIBLE_D6;

  // Jacob & Esau (19, 20) are a special case;
  // since pocket actives do not work on them properly, give each of them a normal D6
  // Don't give a D6 to Jacob if we transformed to them with Clicker
  if (isJacobOrEsau(player) && hasOpenActiveItemSlot(player)) {
    player.AddCollectible(CollectibleType.COLLECTIBLE_D6, D6_STARTING_CHARGE);
    return;
  }

  // Tainted Cain (23) is a special case;
  // the Bag of Crafting does not work properly in the normal active slot
  // Since the D6 is useless on Tainted Cain anyway, he does not need to be awarded the D6
  if (character === PlayerType.PLAYER_CAIN_B) {
    return;
  }

  // Tainted Soul (40) is a special case; he cannot pick up items
  if (character === PlayerType.PLAYER_THESOUL_B) {
    return;
  }

  if (hasPocketD6) {
    return;
  }

  // If they are switching characters, get the charge from the D6 on the previous frame
  const index = getPlayerIndex(player);
  let d6Charge = v.run.pocketActiveD6Charge.get(index);
  if (d6Charge === undefined) {
    d6Charge = D6_STARTING_CHARGE;
  }

  // Jacob and Esau can't have pocket active items
  if (!isJacobOrEsau(player)) {
    // The "SetPocketActiveItem()" method also removes it from item pools
    player.SetPocketActiveItem(
      CollectibleType.COLLECTIBLE_D6,
      ActiveSlot.SLOT_POCKET,
    );
    player.SetActiveCharge(d6Charge, ActiveSlot.SLOT_POCKET);
  }

  // If they previously had a pocket active item, move it to the normal active item slot
  if (pocketItem !== CollectibleType.COLLECTIBLE_NULL && !gotHereFromEsauJr) {
    giveActiveItem(player, pocketItem, pocketItemTotalCharge);
  }

  log("Awarded a pocket active D6.");
}

function giveActiveItem(
  player: EntityPlayer,
  collectibleType: CollectibleType,
  itemCharge: int,
) {
  if (hasOpenActiveItemSlot(player)) {
    player.AddCollectible(collectibleType, itemCharge);
  } else {
    // Spawn it on the ground instead
    const position = findFreePosition(player.Position);
    const startSeed = g.seeds.GetStartSeed();
    const collectible = spawnCollectible(collectibleType, position, startSeed);
    collectible.Charge = itemCharge;
  }
}
