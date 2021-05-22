import g from "../globals";
import { gridToPos } from "../misc";

export function postGameStarted(): void {
  if (!g.config.samsonDropHeart) {
    return;
  }

  const character = g.p.GetPlayerType();
  if (character === PlayerType.PLAYER_SAMSON) {
    g.p.TryRemoveTrinket(TrinketType.TRINKET_CHILDS_HEART);
    const childsHeart = Isaac.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_TRINKET,
      TrinketType.TRINKET_CHILDS_HEART,
      gridToPos(0, 6),
      Vector.Zero,
      g.p,
    );
    childsHeart.GetSprite().Play("Idle", true);
  }
}
