import { nextSeed, removeEntities } from "isaacscript-common";
import g from "../../globals";
import { RaceFormat } from "./types/RaceFormat";
import { RacerStatus } from "./types/RacerStatus";
import { RaceStatus } from "./types/RaceStatus";

// In seeded races, we replace Scolex with two Frails to reduce RNG

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (
    g.race.status !== RaceStatus.IN_PROGRESS ||
    g.race.myStatus !== RacerStatus.RACING ||
    g.race.format !== RaceFormat.SEEDED
  ) {
    return;
  }

  const roomClear = g.r.IsClear();
  const roomSeed = g.r.GetSpawnSeed();
  const centerPos = g.r.GetCenterPos();

  if (roomClear) {
    return;
  }

  const scolexes = Isaac.FindByType(EntityType.ENTITY_PIN, PinVariant.SCOLEX);
  if (scolexes.length === 0) {
    return;
  }

  // There are 10 Scolex entities for each scolex
  removeEntities(scolexes);

  let seed = roomSeed;
  for (let i = 0; i < 2; i++) {
    // We don't want to spawn both of them on top of each other since that would make them behave
    // a little glitchy
    // Note that pos.X += 200 causes the hitbox to appear too close to the left/right side,
    // causing damage if the player moves into the room too quickly
    let modification: Vector;
    if (i === 0) {
      modification = Vector(-150, 0);
    } else {
      modification = Vector(150, 0);
    }
    const position = centerPos.add(modification);
    seed = nextSeed(seed);
    const frail = g.g.Spawn(
      EntityType.ENTITY_PIN,
      PinVariant.FRAIL,
      position,
      Vector.Zero,
      undefined,
      0,
      seed,
    );

    // It will show the head on the first frame after spawning unless we hide it
    // The game will automatically make the entity visible later on
    frail.Visible = false;
  }
}
