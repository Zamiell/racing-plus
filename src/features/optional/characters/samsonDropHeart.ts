import { getPlayers } from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  if (!config.samsonDropHeart) {
    return;
  }

  for (const player of getPlayers()) {
    const character = player.GetPlayerType();
    if (character === PlayerType.PLAYER_SAMSON) {
      const removed = player.TryRemoveTrinket(TrinketType.TRINKET_CHILDS_HEART);
      if (removed) {
        const bottomRightCorner = g.r.GetGridPosition(106);
        const childsHeart = Isaac.Spawn(
          EntityType.ENTITY_PICKUP,
          PickupVariant.PICKUP_TRINKET,
          TrinketType.TRINKET_CHILDS_HEART,
          bottomRightCorner,
          Vector.Zero,
          player,
        );
        const sprite = childsHeart.GetSprite();
        sprite.Play("Idle", true);
      }
    }
  }
}
