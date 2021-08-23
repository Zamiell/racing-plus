import { getRoomIndex, log, saveDataManager } from "isaacscript-common";
import g from "../../globals";
import EntityLocation from "../../types/EntityLocation";
import { CollectibleTypeCustom, EntityTypeCustom } from "../../types/enums";
import raceFinish from "../race/raceFinish";
import { isSeededDeathActive } from "../race/v";
import * as speedrun from "../speedrun/speedrun";
import { speedrunIsFinished } from "../speedrun/v";

const TROPHY_TOUCH_DISTANCE = 24; // 25 is a bit too big

const v = {
  level: {
    trophy: null as EntityLocation | null,
  },
};

export function init(): void {
  saveDataManager("trophy", v);
}

export function spawn(position: Vector): void {
  const roomIndex = getRoomIndex();

  Isaac.Spawn(
    EntityTypeCustom.ENTITY_RACE_TROPHY,
    0,
    0,
    position,
    Vector.Zero,
    null,
  );

  // Keep track that we spawned it so that we can respawn it if the player re-enters the room
  v.level.trophy = {
    roomIndex,
    position,
  };
}

// ModCallbacks.MC_POST_UPDATE (1)
export function postUpdate(): void {
  checkTouch();
}

function checkTouch() {
  // Don't check anything if we have already finished the race / speedrun
  if (g.raceVars.finished || speedrunIsFinished()) {
    return;
  }

  // We cannot perform this check in the NPCUpdate callback since it will not fire during the
  // "Appear" animation
  const trophies = Isaac.FindByType(EntityTypeCustom.ENTITY_RACE_TROPHY);
  for (const trophy of trophies) {
    const playersInRange = Isaac.FindInRadius(
      trophy.Position,
      TROPHY_TOUCH_DISTANCE,
      EntityPartition.PLAYER,
    );
    for (const entity of playersInRange) {
      const player = entity.ToPlayer();

      // Players should not be able to finish the race if they died at the same time as defeating
      // the boss
      if (player !== null && !player.IsDead() && !isSeededDeathActive()) {
        touch(trophy, player);
        return;
      }
    }
  }
}

function touch(trophy: Entity, player: EntityPlayer) {
  trophy.Remove();
  v.level.trophy = null;

  // Make the player pick it up and have it sparkle
  player.AnimateCollectible(
    CollectibleTypeCustom.COLLECTIBLE_TROPHY,
    "Pickup",
    // We use a custom "PlayerPickupSparkle" animation so that the sparkle appears higher
    // (the trophy is taller than a normal collectible, so the sparkle is misaligned)
    "PlayerPickupSparkle2" as CollectibleAnimationName,
  );

  if (speedrun.inSpeedrun()) {
    speedrun.finish(player);
  } else {
    raceFinish();
  }
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  checkRespawn();
}

function checkRespawn() {
  const roomIndex = getRoomIndex();

  if (v.level.trophy === null || roomIndex !== v.level.trophy.roomIndex) {
    return;
  }

  // Don't do anything if a trophy already exists in the room
  // (this can happen if code earlier on in the PostNewRoom callback spawned a Big Chest or a
  // trophy)
  const existingTrophies = Isaac.FindByType(
    EntityTypeCustom.ENTITY_RACE_TROPHY,
  );
  if (existingTrophies.length > 0) {
    return;
  }

  // We are re-entering a room where a trophy spawned (which is a custom entity),
  // so we need to respawn it
  Isaac.Spawn(
    EntityTypeCustom.ENTITY_RACE_TROPHY,
    0,
    0,
    v.level.trophy.position,
    Vector.Zero,
    null,
  );
  log("Respawned a Race Trophy since we re-entered the room.");
}

export function trophyHasSpawned(): boolean {
  return v.level.trophy !== null;
}
