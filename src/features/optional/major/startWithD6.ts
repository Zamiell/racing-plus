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
  getPlayerIndex,
  getPlayers,
  inGenesisRoom,
  isJacobOrEsau,
  log,
  PlayerIndex,
  saveDataManager,
} from "isaacscript-common";
import { config } from "../../../modConfigMenu";

const D6_STARTING_CHARGE = 6;

const v = {
  run: {
    pocketActiveD6Charge: new Map<PlayerIndex, int>(),
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

// ModCallbacks.MC_POST_PLAYER_UPDATE (31)
export function postPlayerUpdate(player: EntityPlayer): void {
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

  changedCharacterInSomeWay(player);
}

function changedCharacterInSomeWay(player: EntityPlayer) {
  // In some cases, switching the character will delete the D6, so we may need to give another one
  giveD6(player);
}

function giveD6(player: EntityPlayer) {
  const character = player.GetPlayerType();
  const pocketItem = player.GetActiveItem(ActiveSlot.SLOT_POCKET);
  const pocketItemCharge = player.GetActiveCharge(ActiveSlot.SLOT_POCKET);
  const pocketItemBatteryCharge = player.GetBatteryCharge(
    ActiveSlot.SLOT_POCKET,
  );
  const pocketItemTotalCharge = pocketItemCharge + pocketItemBatteryCharge;
  const hasPocketD6 = pocketItem === CollectibleType.COLLECTIBLE_D6;

  // Tainted Cain is a special case;
  // the Bag of Crafting does not work properly in the normal active slot
  // Since the D6 is useless on Tainted Cain anyway, he does not need to be awarded the D6
  if (character === PlayerType.PLAYER_CAIN_B) {
    return;
  }

  // Jacob & Esau are a special case;
  // since pocket actives do not work on them properly, give each of them a normal D6
  if (isJacobOrEsau(player)) {
    player.AddCollectible(CollectibleType.COLLECTIBLE_D6, D6_STARTING_CHARGE);
    return;
  }

  if (hasPocketD6) {
    return;
  }

  // If they are switching characters, re-use the charge from the D6 on the previous frame
  const index = getPlayerIndex(player);
  let charge = v.run.pocketActiveD6Charge.get(index);
  if (charge === undefined) {
    charge = D6_STARTING_CHARGE;
  }

  // The "SetPocketActiveItem()" method also removes it from item pools
  player.SetPocketActiveItem(
    CollectibleType.COLLECTIBLE_D6,
    ActiveSlot.SLOT_POCKET,
  );
  player.SetActiveCharge(charge, ActiveSlot.SLOT_POCKET);

  // If they previously had a pocket active item, move it to the normal active item slot
  if (pocketItem !== CollectibleType.COLLECTIBLE_NULL) {
    player.AddCollectible(pocketItem, pocketItemTotalCharge, false);
  }

  log("Awarded a pocket active D6.");
}
