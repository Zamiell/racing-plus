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
  DefaultMap,
  defaultMapGetPlayer,
  findFreePosition,
  getCollectibleMaxCharges,
  getPlayerName,
  getPlayers,
  getTotalCharge,
  hasOpenActiveItemSlot,
  inGenesisRoom,
  isJacobOrEsau,
  log,
  mapSetPlayer,
  PlayerIndex,
  runNextGameFrame,
  saveDataManager,
  spawnCollectible,
} from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../enums/CollectibleTypeCustom";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";

const D6_STARTING_CHARGE = 6;

const v = {
  run: {
    playersPocketActiveD6Charge: new DefaultMap<PlayerIndex, int>(
      D6_STARTING_CHARGE,
    ),
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
// CollectibleType.COLLECTIBLE_FLIP (711)
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

  // When using the Flip manually, "useFlags" will be equal to 27, which is the composition of the
  // following flags:
  // - UseFlags.USE_NOANIM (1 << 0)
  // - UseFlags.USE_NOCOSTUME (1 << 1)
  // - UseFlags.USE_ALLOWNONMAIN (1 << 3)
  // - UseFlags.USE_REMOVEACTIVE (1 << 4)
  // When the game uses Flip automatically after clearing a room, "useFlags" will be equal to 0
  // Since none of these flags correspond highly to using the item, default to checking for 0
  const flipCharge = getTotalCharge(player, flipActiveSlot);
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

  const pocketActiveCharge = getTotalCharge(player, ActiveSlot.SLOT_POCKET);
  mapSetPlayer(v.run.playersPocketActiveD6Charge, player, pocketActiveCharge);
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
  runNextGameFrame(() => {
    player.SetActiveCharge(v.run.currentFlipCharge, flipActiveSlot);
  });
}

// ModCallbacksCustom.MC_POST_FIRST_FLIP
export function postFirstFlip(player: EntityPlayer): void {
  if (!config.startWithD6) {
    return;
  }

  // Giving Dead Tainted Lazarus the pocket D6 using the "getTaintedLazarusSubPlayer" function does
  // not work, so we revert to using the PostFirstFlip callback
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
    const esau = player.GetOtherTwin();
    if (esau !== undefined) {
      giveD6(esau, gotHereFromEsauJr);
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

  const d6Charge = defaultMapGetPlayer(
    v.run.playersPocketActiveD6Charge,
    player,
  );

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
  const pocketItemCharge = getTotalCharge(player, ActiveSlot.SLOT_POCKET);
  const hasPocketD6 = pocketItem === CollectibleType.COLLECTIBLE_D6;

  // Jacob & Esau (19, 20) are a special case;
  // since pocket actives do not work on them properly, give each of them a normal D6
  // Don't give a D6 to Jacob if we transformed to them with Clicker
  if (isJacobOrEsau(player)) {
    if (hasOpenActiveItemSlot(player)) {
      player.AddCollectible(CollectibleType.COLLECTIBLE_D6, D6_STARTING_CHARGE);
    }

    return;
  }

  // Tainted Cain (23) is a special case;
  // the Bag of Crafting does not work properly in the normal active slot
  // Since the D6 is useless on Tainted Cain anyway, he does not need to be awarded the D6
  if (character === PlayerType.PLAYER_CAIN_B) {
    return;
  }

  // Tainted Soul (40) is a special case; he cannot use items
  if (character === PlayerType.PLAYER_THESOUL_B) {
    return;
  }

  if (hasPocketD6) {
    return;
  }

  // If we are switching characters, get the charge from the D6 on the previous frame
  const d6Charge = defaultMapGetPlayer(
    v.run.playersPocketActiveD6Charge,
    player,
  );

  // The "SetPocketActiveItem()" method also removes it from item pools
  player.SetPocketActiveItem(
    CollectibleType.COLLECTIBLE_D6,
    ActiveSlot.SLOT_POCKET,
  );
  player.SetActiveCharge(d6Charge, ActiveSlot.SLOT_POCKET);

  // If we previously had a pocket active item, move it to the normal active item slot
  if (pocketItem !== CollectibleType.COLLECTIBLE_NULL && !gotHereFromEsauJr) {
    giveActiveItem(player, pocketItem, pocketItemCharge);
  }

  const playerName = getPlayerName(player);
  log(`Awarded a pocket active D6 to: ${playerName}`);
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
