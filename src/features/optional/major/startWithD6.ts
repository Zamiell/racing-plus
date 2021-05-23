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

export function postGameStarted(): void {
  if (!g.config.startWithD6) {
    return;
  }

  const character = g.p.GetPlayerType();

  if (
    // The original characters
    character >= PlayerType.PLAYER_ISAAC &&
    character <= PlayerType.PLAYER_ESAU
  ) {
    givePocketActiveD6();
  } else if (TAINTED_CHARACTERS_WITH_POCKET_ACTIVES.includes(character)) {
    giveActiveD6();
  } else if (TAINTED_CHARACTERS_WITHOUT_POCKET_ACTIVES.includes(character)) {
    givePocketActiveD6();
  }

  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_D6);
}

function givePocketActiveD6() {
  g.p.SetPocketActiveItem(
    CollectibleType.COLLECTIBLE_D6,
    ActiveSlot.SLOT_POCKET,
  );
  // (the above function also removes it from item pools)
}

function giveActiveD6() {
  g.p.AddCollectible(CollectibleType.COLLECTIBLE_D6, 6);
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_D6);
}
