// In seeded races, we replace Scolex with two Frails to reduce RNG.

import { EntityType, PinVariant } from "isaac-typescript-definitions";
import {
  doesEntityExist,
  game,
  newRNG,
  removeAllMatchingEntities,
  repeat,
  spawnWithSeed,
} from "isaacscript-common";
import { RaceFormat } from "../../enums/RaceFormat";
import { RaceStatus } from "../../enums/RaceStatus";
import { RacerStatus } from "../../enums/RacerStatus";
import { g } from "../../globals";

const SCOLEX_TYPE = EntityType.PIN;
const SCOLEX_VARIANT = PinVariant.SCOLEX;
const NUM_FRAILS = 2;

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (
    g.race.status !== RaceStatus.IN_PROGRESS ||
    g.race.myStatus !== RacerStatus.RACING ||
    g.race.format !== RaceFormat.SEEDED
  ) {
    return;
  }

  const room = game.GetRoom();
  const roomClear = room.IsClear();
  const roomSeed = room.GetSpawnSeed();
  const centerPos = room.GetCenterPos();
  const rng = newRNG(roomSeed);

  if (roomClear) {
    return;
  }

  const scolexesExist = doesEntityExist(SCOLEX_TYPE, SCOLEX_VARIANT, -1, true);
  if (!scolexesExist) {
    return;
  }

  // There are 10 Scolex entities for each Scolex.
  removeAllMatchingEntities(SCOLEX_TYPE, SCOLEX_VARIANT);

  repeat(NUM_FRAILS, (i) => {
    // We don't want to spawn both of them on top of each other since that would make them behave a
    // little glitchy. Note that pos.X += 200 causes the hitbox to appear too close to the
    // left/right side, causing damage if the player moves into the room too quickly.
    let modification: Vector;
    if (i === 0) {
      modification = Vector(-150, 0);
    } else {
      modification = Vector(150, 0);
    }
    const position = centerPos.add(modification);
    const seed = rng.Next();
    const frail = spawnWithSeed(
      EntityType.PIN,
      PinVariant.FRAIL,
      0,
      position,
      seed,
    );

    // It will show the head on the first frame after spawning unless we hide it. The game will
    // automatically make the entity visible later on.
    frail.Visible = false;
  });
}
