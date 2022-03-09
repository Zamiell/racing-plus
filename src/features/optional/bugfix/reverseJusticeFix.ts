// There is a bug where using a Reverse Justice card will remove N collectibles from the pool
// Work around this by checking if a player used a Reverse Justice card on this frame
// If so, assume that this collectible is from the Reverse Justice card, and return an arbitrary
// placeholder item from the PreGetCollectible callback
// TODO: replace this after the next vanilla patch after testing to see if it is fixed

import {
  DefaultMap,
  getPlayerIndex,
  getPlayers,
  log,
  PlayerIndex,
} from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../types/CollectibleTypeCustom";

const v = {
  run: {
    playersReverseJusticeMap: new DefaultMap<PlayerIndex, boolean>(false),
  },
};

// ModCallbacks.MC_POST_UPDATE (1)
export function postUpdate(): void {
  for (const player of getPlayers()) {
    const playerIndex = getPlayerIndex(player);
    const firstCard = player.GetCard(PocketItemSlot.SLOT_1);
    const hasReverseJusticeInFirstSlot =
      firstCard === Card.CARD_REVERSE_JUSTICE;

    v.run.playersReverseJusticeMap.set(
      playerIndex,
      hasReverseJusticeInFirstSlot,
    );
  }
}

// ModCallbacks.MC_PRE_GET_COLLECTIBLE (62)
export function preGetCollectible(): CollectibleType | int | void {
  if (anyPlayerUsedReverseJusticeCardOnThisFrame()) {
    log("Fixing the Reverse Justice card bug.");
    return CollectibleTypeCustom.COLLECTIBLE_DEBUG;
  }

  return undefined;
}

function anyPlayerUsedReverseJusticeCardOnThisFrame() {
  const players = getPlayers();

  return players.some((player) => {
    const playerIndex = getPlayerIndex(player);
    const hadReverseJusticeEarlierOnThisFrame =
      v.run.playersReverseJusticeMap.get(playerIndex);
    const firstCard = player.GetCard(PocketItemSlot.SLOT_1);
    const hasReverseJusticeCard = firstCard === Card.CARD_REVERSE_JUSTICE;
    return (
      hadReverseJusticeEarlierOnThisFrame === true && !hasReverseJusticeCard
    );
  });
}
