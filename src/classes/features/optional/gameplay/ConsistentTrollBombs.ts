import { BombVariant, ModCallback } from "isaac-typescript-definitions";
import { Callback, GAME_FRAMES_PER_SECOND } from "isaacscript-common";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const CONSISTENT_EXPLOSION_TIME_IN_SECONDS = 2;

/**
 * Make Troll Bomb and Mega Troll Bomb fuses deterministic by making them exactly N seconds long. In
 * vanilla, the fuse is: 45 + random(1, 2147483647) % 30
 *
 * Note that game physics occur at 30 frames per second instead of 60.
 */
export class ConsistentTrollBombs extends ConfigurableModFeature {
  configKey: keyof Config = "ConsistentTrollBombs";

  // 57, 3
  @Callback(ModCallback.POST_BOMB_INIT, BombVariant.TROLL)
  postBombInitTroll(bomb: EntityBomb): void {
    this.setFuse(bomb);
  }

  // 57, 4
  @Callback(ModCallback.POST_BOMB_INIT, BombVariant.MEGA_TROLL)
  postBombInitMegaTroll(bomb: EntityBomb): void {
    this.setFuse(bomb);
  }

  // 57, 18
  @Callback(ModCallback.POST_BOMB_INIT, BombVariant.GOLDEN_TROLL)
  postBombInitGoldenTroll(bomb: EntityBomb): void {
    this.setFuse(bomb);
  }

  setFuse(bomb: EntityBomb): void {
    bomb.SetExplosionCountdown(
      CONSISTENT_EXPLOSION_TIME_IN_SECONDS * GAME_FRAMES_PER_SECOND,
    );
  }
}
