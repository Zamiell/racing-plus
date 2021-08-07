import { getPlayers, gridToPos } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

export function postGameStarted(): void {
  if (!config.samsonDropHeart) {
    return;
  }

  for (const player of getPlayers()) {
    const character = player.GetPlayerType();
    if (character === PlayerType.PLAYER_SAMSON) {
      const removed = player.TryRemoveTrinket(TrinketType.TRINKET_CHILDS_HEART);
      if (removed) {
        const childsHeart = Isaac.Spawn(
          EntityType.ENTITY_PICKUP,
          PickupVariant.PICKUP_TRINKET,
          TrinketType.TRINKET_CHILDS_HEART,
          gridToPos(0, 6),
          Vector.Zero,
          player,
        );
        childsHeart.GetSprite().Play("Idle", true);
      }
    }
  }
}
