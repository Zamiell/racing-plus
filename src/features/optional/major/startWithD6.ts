import g from "../../../globals";
import log from "../../../log";
import { getPlayers, giveItemAndRemoveFromPools } from "../../../misc";
import { getPlayerLuaTableIndex } from "../../../types/GlobalsRun";

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

  return (
    // The original characters, minus Jacob & Esau
    (character >= PlayerType.PLAYER_ISAAC &&
      character <= PlayerType.PLAYER_BETHANY) ||
    TAINTED_CHARACTERS_WITHOUT_POCKET_ACTIVES.includes(character)
  );
}

export function shouldGetActiveD6(player: EntityPlayer): boolean {
  const character = player.GetPlayerType();
  return (
    character === PlayerType.PLAYER_JACOB ||
    TAINTED_CHARACTERS_WITH_POCKET_ACTIVES.includes(character)
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
// Give another pocket D6 if needed
export function postPlayerChange(player: EntityPlayer): void {
  if (shouldGetPocketActiveD6(player)) {
    const index = getPlayerLuaTableIndex(player);
    const charge = g.run.pocketActiveD6Charge.get(index);
    givePocketActiveD6(player, charge);

    log("Awarded another pocket D6 (due to character change).");
  }
}
