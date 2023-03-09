import * as spawnPerfection from "../../../../../classes/features/optional/major/fastTravel/spawnPerfection";
import { config } from "../../../../../modConfigMenu";

export function main(entity: Entity): void {
  if (!config.FastTravel) {
    return;
  }

  spawnPerfection.postEntityKill(entity);
}
