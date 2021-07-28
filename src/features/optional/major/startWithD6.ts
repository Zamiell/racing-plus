import g from "../../../globals";
import log from "../../../log";
import { getPlayerLuaTableIndex } from "../../../types/GlobalsRun";
import { getPlayers, giveItemAndRemoveFromPools } from "../../../utilGlobals";

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

// ModCallbacks.MC_POST_UPDATE (1)
export function postUpdate(): void {
  for (const player of getPlayers()) {
    const index = getPlayerLuaTableIndex(player);
    const pocketActiveCharge = player.GetActiveCharge(ActiveSlot.SLOT_POCKET);
    g.run.pocketActiveD6Charge.set(index, pocketActiveCharge);
  }
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  if (!g.config.startWithD6) {
    return;
  }

  for (const player of getPlayers()) {
    if (shouldGetPocketActiveD6(player)) {
      givePocketActiveD6(player);
    } else if (shouldGetActiveD6(player)) {
      giveActiveD6(player);
    }
    // Note that modded characters are not given anything (except Random Baby)
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
    character === PlayerType.PLAYER_JACOB ||
    character === PlayerType.PLAYER_ESAU
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
}

function giveActiveD6(player: EntityPlayer) {
  giveItemAndRemoveFromPools(player, CollectibleType.COLLECTIBLE_D6);
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  checkGenesisRoom();
}

// When the player uses Genesis, it will strip the pocket D6 from them
// Give it back to them if this is the case
function checkGenesisRoom() {
  const roomDesc = g.l.GetCurrentRoomDesc();
  const roomType = g.r.GetType();

  if (roomType === RoomType.ROOM_ISAACS && roomDesc.Data.Variant === 1000) {
    for (const player of getPlayers()) {
      if (shouldGetPocketActiveD6(player)) {
        givePocketActiveD6(player);
      }
    }
  }
}

// The game will remove the pocket D6 if they switch characters (e.g. with Judas' Shadow)
// Give another D6 if needed
export function postPlayerChange(player: EntityPlayer): void {
  giveD6(player);
}

export function postFirstFlip(player: EntityPlayer): void {
  giveD6(player);
}

export function postFirstEsauJr(player: EntityPlayer): void {
  if (shouldGetPocketActiveD6(player)) {
    givePocketActiveD6(player, 6); // Always start the Esau Jr. character with a full D6
    log(
      "Awarded another pocket D6 (due to using Esau Jr. for the first time).",
    );
  }
}

function giveD6(player: EntityPlayer) {
  if (shouldGetPocketActiveD6(player)) {
    const index = getPlayerLuaTableIndex(player);
    const charge = g.run.pocketActiveD6Charge.get(index);
    givePocketActiveD6(player, charge);
    log("Awarded another pocket D6 (due to character change).");
  } else if (shouldGetActiveD6(player)) {
    giveActiveD6(player);
    log("Awarded another active D6 (due to character change).");
  } else {
    log("Not awarding the D6.");
  }
}
