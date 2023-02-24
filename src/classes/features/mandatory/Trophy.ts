import {
  CollectibleAnimation,
  EntityPartition,
  ModCallback,
  PlayerItemAnimation,
} from "isaac-typescript-definitions";
import {
  Callback,
  doesEntityExist,
  getEntities,
  logError,
} from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../enums/CollectibleTypeCustom";
import { EntityTypeCustom } from "../../../enums/EntityTypeCustom";
import { isSeededDeathActive } from "../../../features/mandatory/seededDeath/v";
import { raceFinish } from "../../../features/race/raceFinish";
import * as speedrun from "../../../features/speedrun/speedrun";
import { speedrunIsFinished } from "../../../features/speedrun/v";
import { g } from "../../../globals";
import { mod } from "../../../mod";
import { MandatoryModFeature } from "../../MandatoryModFeature";

const TROPHY_TOUCH_DISTANCE = 24; // 25 is a bit too big

const v = {
  level: {
    trophyPersistentIndex: null as int | null,
  },
};

export class Trophy extends MandatoryModFeature {
  v = v;

  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    this.checkTouch();
  }

  checkTouch(): void {
    // Don't check anything if we have already finished the race / speedrun.
    if (g.raceVars.finished || speedrunIsFinished()) {
      return;
    }

    // We cannot perform this check in the `POST_NPC_UPDATE` callback since it will not fire during
    // the "Appear" animation.
    const trophies = getEntities(EntityTypeCustom.TROPHY_CUSTOM);
    for (const trophy of trophies) {
      const playersInRange = Isaac.FindInRadius(
        trophy.Position,
        TROPHY_TOUCH_DISTANCE,
        EntityPartition.PLAYER,
      );
      for (const entity of playersInRange) {
        const player = entity.ToPlayer();

        // Players should not be able to finish the race if they died at the same time as defeating
        // the boss.
        if (
          player !== undefined &&
          !player.IsDead() &&
          !isSeededDeathActive()
        ) {
          this.touch(trophy, player);
          return;
        }
      }
    }
  }

  touch(entity: Entity, player: EntityPlayer): void {
    if (v.level.trophyPersistentIndex === null) {
      logError("A trophy was touched without the index being present.");
      entity.Remove();
    } else {
      mod.removePersistentEntity(v.level.trophyPersistentIndex);
      v.level.trophyPersistentIndex = null;
    }

    // Make the player pick it up and have it sparkle.
    player.AnimateCollectible(
      CollectibleTypeCustom.TROPHY,
      PlayerItemAnimation.PICKUP,
      // We use a custom "PlayerPickupSparkle" animation so that the sparkle appears higher. (The
      // trophy is taller than a normal collectible, so the sparkle is misaligned.)
      "PlayerPickupSparkle2" as CollectibleAnimation,
    );

    if (speedrun.inSpeedrun()) {
      speedrun.finish(player);
    } else {
      raceFinish();
    }
  }
}

export function spawnTrophy(position: Vector): void {
  // Don't do anything if a trophy already exists in the floor. (This can happen if code earlier on
  // in the `POST_NEW_ROOM` callback spawned a Big Chest or a trophy.)
  if (v.level.trophyPersistentIndex !== null) {
    return;
  }

  const { persistentIndex } = mod.spawnPersistentEntity(
    EntityTypeCustom.TROPHY_CUSTOM,
    0,
    0,
    position,
  );
  v.level.trophyPersistentIndex = persistentIndex;
}

export function doesTrophyExist(): boolean {
  return doesEntityExist(EntityTypeCustom.TROPHY_CUSTOM);
}
