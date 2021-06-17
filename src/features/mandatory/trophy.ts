import g from "../../globals";
import { getRoomIndex } from "../../misc";
import { CollectibleTypeCustom, EntityTypeCustom } from "../../types/enums";
import * as race from "../race/race";
import SeededDeathState from "../race/types/SeededDeathState";
import * as speedrun from "../speedrun/speedrun";

const TROPHY_TOUCH_DISTANCE = 24; // 25 is a bit too big

// ModCallbacks.MC_POST_UPDATE (1)
export function postUpdate(): void {
  checkTouch();
}

function checkTouch() {
  // Don't check anything if ( we have already finished the race / speedrun
  if (g.raceVars.finished || g.speedrun.finished) {
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
      if (
        player !== null &&
        !player.IsDead() &&
        g.run.seededDeath.state === SeededDeathState.Disabled
      ) {
        touch(trophy, player);
        return;
      }
    }
  }
}

function touch(trophy: Entity, player: EntityPlayer) {
  trophy.Remove();

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
    race.finish();
  }
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  checkRespawn();
}

function checkRespawn() {
  const roomIndex = getRoomIndex();
  const stage = g.l.GetStage();

  if (
    !g.run.trophy.spawned ||
    stage !== g.run.trophy.stage ||
    roomIndex !== g.run.trophy.roomIndex
  ) {
    return;
  }

  // Don't respawn the trophy if we already touched it
  if (g.raceVars.finished || g.speedrun.finished) {
    return;
  }

  // We are re-entering a room where a trophy spawned (which is a custom entity),
  // so we need to respawn it
  Isaac.Spawn(
    EntityTypeCustom.ENTITY_RACE_TROPHY,
    0,
    0,
    g.run.trophy.position,
    Vector.Zero,
    null,
  );
}
