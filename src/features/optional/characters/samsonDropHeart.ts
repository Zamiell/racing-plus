import {
  EntityCollisionClass,
  PlayerType,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  game,
  getPlayersOfType,
  spawnTrinket,
  VectorZero,
} from "isaacscript-common";
import { config } from "../../../modConfigMenu";

const BOTTOM_LEFT_GRID_INDEX = 106;

// ModCallback.POST_GAME_STARTED (15)
export function postGameStarted(): void {
  if (!config.SamsonDropHeart) {
    return;
  }

  const samsons = getPlayersOfType(PlayerType.SAMSON);

  for (const samson of samsons) {
    const removed = samson.TryRemoveTrinket(TrinketType.CHILDS_HEART);
    if (!removed) {
      return;
    }

    spawnDroppedChildsHeart(samson);
  }
}

export function spawnDroppedChildsHeart(player: EntityPlayer): void {
  const room = game.GetRoom();
  const bottomRightPosition = room.GetGridPosition(BOTTOM_LEFT_GRID_INDEX);
  const childsHeart = spawnTrinket(
    TrinketType.CHILDS_HEART,
    bottomRightPosition,
    VectorZero,
    player,
    player.InitSeed,
  );

  // Bypass the drop animation, since it is distracting when resetting.
  const sprite = childsHeart.GetSprite();
  sprite.Play("Idle", true);

  // An artifact of bypassing the normal animation is that the item does not have any collision;
  // manually account for this.
  childsHeart.EntityCollisionClass = EntityCollisionClass.ALL;
}
