import { config } from "../../../../../modConfigMenu";
import * as spawnPerfection from "../spawnPerfection";

export function main(entity: Entity): void {
  if (!config.fastTravel) {
    return;
  }

  spawnPerfection.postEntityKill(entity);
}
