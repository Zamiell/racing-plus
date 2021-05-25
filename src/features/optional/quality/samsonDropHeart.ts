import g from "../../../globals";
import { getPlayers, gridToPos } from "../../../misc";

export function postGameStarted(): void {
  if (!g.config.samsonDropHeart) {
    return;
  }

  for (const player of getPlayers()) {
    const character = player.GetPlayerType();
    if (character === PlayerType.PLAYER_SAMSON) {
      player.TryRemoveTrinket(TrinketType.TRINKET_CHILDS_HEART);
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
