import {
  getPlayerIndex,
  getPlayers,
  inGenesisRoom,
  isJacobOrEsau,
  log,
  PlayerIndex,
  saveDataManager,
} from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import { giveCollectibleAndRemoveFromPools } from "../../../utilGlobals";

const D6_STARTING_CHARGE = 6;

const TAINTED_CHARACTERS_WITH_POCKET_ACTIVES: PlayerType[] = [
  PlayerType.PLAYER_MAGDALENA_B,
  PlayerType.PLAYER_CAIN_B,
  PlayerType.PLAYER_JUDAS_B,
  PlayerType.PLAYER_XXX_B,
  PlayerType.PLAYER_EVE_B,
  PlayerType.PLAYER_LAZARUS_B,
  PlayerType.PLAYER_APOLLYON_B,
  PlayerType.PLAYER_BETHANY_B,
  PlayerType.PLAYER_JACOB_B,
  PlayerType.PLAYER_LAZARUS2_B,
  PlayerType.PLAYER_JACOB2_B,
];

const TAINTED_CHARACTERS_WITHOUT_POCKET_ACTIVES: PlayerType[] = [
  PlayerType.PLAYER_ISAAC_B,
  PlayerType.PLAYER_SAMSON_B,
  PlayerType.PLAYER_AZAZEL_B,
  PlayerType.PLAYER_EDEN_B,
  PlayerType.PLAYER_THELOST_B,
  PlayerType.PLAYER_LILITH_B,
  PlayerType.PLAYER_KEEPER_B,
  PlayerType.PLAYER_THEFORGOTTEN_B,
  PlayerType.PLAYER_THESOUL_B,
];

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
    // Note that modded characters are not given anything (except Random Baby)
    giveD6(player);
  }
}

function shouldGetPocketActiveD6(player: EntityPlayer) {
  const character = player.GetPlayerType();

  // First, handle the special case of "Random Baby" from The Babies Mod
  const randomBaby = Isaac.GetPlayerTypeByName("Random Baby");
  if (character === randomBaby) {
    return true;
  }

  return (
    // The original characters, minus Jacob & Esau
    (character >= PlayerType.PLAYER_ISAAC &&
      character <= PlayerType.PLAYER_BETHANY) ||
    TAINTED_CHARACTERS_WITHOUT_POCKET_ACTIVES.includes(character)
  );
}

export function shouldGetActiveD6(player: EntityPlayer): boolean {
  const gameFrameCount = g.g.GetFrameCount();
  const character = player.GetPlayerType();

  // When Tainted Jacob changes from his ghost form to his normal form
  // (i.e. at the beginning of a floor), he should not be re-given a D6
  if (character === PlayerType.PLAYER_JACOB_B && gameFrameCount !== 0) {
    return false;
  }

  // When Tainted Jacob changes into his ghost form, the character will change
  // However, the ghost form does not need to be re-given the D6, because he will still have it
  if (character === PlayerType.PLAYER_JACOB2_B) {
    return false;
  }

  return (
    // Since some tainted characters start with a pocket active item,
    // we give them the D6 as an active item
    TAINTED_CHARACTERS_WITH_POCKET_ACTIVES.includes(character) ||
    // Jacob & Esau cannot use pocket active items, so we give the active D6 to both of them
    // (we could give the D6 to just Esau, but since the Jacob & Esau are so weak,
    // it makes more sense to give it to both of them)
    isJacobOrEsau(player)
  );
}

function givePocketActiveD6(player: EntityPlayer, charge?: int) {
  player.SetPocketActiveItem(
    CollectibleType.COLLECTIBLE_D6,
    ActiveSlot.SLOT_POCKET,
  );
  // (the above function also removes it from item pools)

  if (charge !== undefined) {
    player.SetActiveCharge(charge, ActiveSlot.SLOT_POCKET);
  }

  log("Awarded a pocket active D6.");
}

function giveActiveD6(player: EntityPlayer) {
  giveCollectibleAndRemoveFromPools(player, CollectibleType.COLLECTIBLE_D6);
  log("Awarded an active D6.");
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
    if (shouldGetPocketActiveD6(player)) {
      givePocketActiveD6(player);
    }
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
  changedCharacterInSomeWay(player);
}

// ModCallbacksCustom.MC_POST_FIRST_FLIP
export function postFirstFlip(player: EntityPlayer): void {
  changedCharacterInSomeWay(player);
}

// ModCallbacksCustom.MC_POST_FIRST_ESAU_JR
export function postFirstEsauJr(player: EntityPlayer): void {
  changedCharacterInSomeWay(player);
}

function changedCharacterInSomeWay(player: EntityPlayer) {
  // In some cases, switching the character will delete the D6, so we may need to give another one
  const activeItem = player.GetActiveItem(ActiveSlot.SLOT_PRIMARY);
  const hasActiveItem = activeItem !== CollectibleType.COLLECTIBLE_NULL;
  const pocketItem = player.GetActiveItem(ActiveSlot.SLOT_POCKET);
  const hasPocketD6 = pocketItem === CollectibleType.COLLECTIBLE_D6;

  if (shouldGetPocketActiveD6(player) && !hasPocketD6) {
    givePocketActiveD6(player);
  }

  // Give another D6 if needed
  if (shouldGetActiveD6(player) && !hasActiveItem) {
    giveActiveD6(player);
  }
}

function giveD6(player: EntityPlayer) {
  if (shouldGetPocketActiveD6(player)) {
    const index = getPlayerIndex(player);
    let charge = v.run.pocketActiveD6Charge.get(index);
    if (charge === undefined) {
      charge = D6_STARTING_CHARGE;
    }
    givePocketActiveD6(player, charge);
  } else if (shouldGetActiveD6(player)) {
    giveActiveD6(player);
  }
}
