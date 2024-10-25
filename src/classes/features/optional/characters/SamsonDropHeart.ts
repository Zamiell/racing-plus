import {
  EntityCollisionClass,
  PlayerType,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  VectorZero,
  getPlayersOfType,
  spawnTrinket,
} from "isaacscript-common";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const BOTTOM_LEFT_GRID_INDEX = 106;

export class SamsonDropHeart extends ConfigurableModFeature {
  configKey: keyof Config = "SamsonDropHeart";

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReorderedFalse(): void {
    const samsons = getPlayersOfType(PlayerType.SAMSON);

    for (const samson of samsons) {
      const removed = samson.TryRemoveTrinket(TrinketType.CHILDS_HEART);
      if (removed) {
        spawnDroppedChildsHeart(samson);
      }
    }
  }
}

export function spawnDroppedChildsHeart(player: EntityPlayer): void {
  const childsHeart = spawnTrinket(
    TrinketType.CHILDS_HEART,
    BOTTOM_LEFT_GRID_INDEX,
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
