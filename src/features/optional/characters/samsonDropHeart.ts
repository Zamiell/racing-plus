import { PlayerType, TrinketType } from "isaac-typescript-definitions";
import { getPlayersOfType, spawnTrinket, VectorZero } from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";

const BOTTOM_RIGHT_GRID_INDEX = 106;

// ModCallback.POST_GAME_STARTED (15)
export function postGameStarted(): void {
  if (!config.samsonDropHeart) {
    return;
  }

  const samsons = getPlayersOfType(PlayerType.SAMSON);

  for (const samson of samsons) {
    const removed = samson.TryRemoveTrinket(TrinketType.CHILDS_HEART);
    if (!removed) {
      return;
    }

    const bottomRightPosition = g.r.GetGridPosition(BOTTOM_RIGHT_GRID_INDEX);
    const childsHeart = spawnTrinket(
      TrinketType.CHILDS_HEART,
      bottomRightPosition,
      VectorZero,
      samson,
      samson.InitSeed,
    );
    const sprite = childsHeart.GetSprite();
    sprite.Play("Idle", true);
  }
}
