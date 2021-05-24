import g from "../../../globals";

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
  g.run.pocketActiveD6Charge = g.p.GetActiveCharge(ActiveSlot.SLOT_POCKET);
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  if (!g.config.startWithD6) {
    return;
  }

  if (shouldGetPocketActiveD6()) {
    givePocketActiveD6();
  } else if (shouldGetActiveD6()) {
    giveActiveD6();
  }

  // Note that modded characters are not given anything
}

function shouldGetPocketActiveD6() {
  const character = g.p.GetPlayerType();

  return (
    // The original characters, minus Jacob & Esau
    (character >= PlayerType.PLAYER_ISAAC &&
      character <= PlayerType.PLAYER_BETHANY) ||
    TAINTED_CHARACTERS_WITHOUT_POCKET_ACTIVES.includes(character)
  );
}

function shouldGetActiveD6() {
  const character = g.p.GetPlayerType();
  return (
    character === PlayerType.PLAYER_JACOB ||
    TAINTED_CHARACTERS_WITH_POCKET_ACTIVES.includes(character)
  );
}

function givePocketActiveD6(charge?: int) {
  g.p.SetPocketActiveItem(
    CollectibleType.COLLECTIBLE_D6,
    ActiveSlot.SLOT_POCKET,
  );
  // (the above function also removes it from item pools)

  if (charge !== undefined) {
    g.p.SetActiveCharge(charge, ActiveSlot.SLOT_POCKET);
  }
}

function giveActiveD6() {
  g.p.AddCollectible(CollectibleType.COLLECTIBLE_D6, 6);
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_D6);
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

  if (
    roomType === RoomType.ROOM_ISAACS &&
    roomDesc.Data.Variant === 1000 &&
    shouldGetPocketActiveD6()
  ) {
    givePocketActiveD6(g.run.pocketActiveD6Charge);
  }
}

// The game will remove the pocket D6 if they switch characters (e.g. with Judas' Shadow)
// Give another pocket D6 if needed
export function postPlayerChange(): void {
  if (shouldGetPocketActiveD6()) {
    givePocketActiveD6(g.run.pocketActiveD6Charge);
  }
}
