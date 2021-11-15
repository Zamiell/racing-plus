import g from "../../../../../globals";
import { config } from "../../../../../modConfigMenu";
import * as spawnPerfection from "../spawnPerfection";
import v from "../v";

export function main(entity: Entity): void {
  if (!config.fastTravel) {
    return;
  }

  spawnPerfection.postEntityKill(entity);
}

// EntityType.ENTITY_MOM (45)
export function mom(_entity: Entity): void {
  if (!config.fastTravel) {
    return;
  }

  const gameFrameCount = g.g.GetFrameCount();
  v.room.momKilledFrame = gameFrameCount;
}
