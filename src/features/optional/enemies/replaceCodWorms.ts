import { EntityType } from "isaac-typescript-definitions";
import { config } from "../../../modConfigMenu";

// ModCallback.PRE_ENTITY_SPAWN (24)
// EntityType.COD_WORM (221)
export function preEntitySpawnCodWorm(
  initSeed: int,
): [EntityType | int, int, int, int] | void {
  if (!config.replaceCodWorms) {
    return undefined;
  }

  // Replace Cod Worms with Para-Bites.
  return [EntityType.PARA_BITE, 0, 0, initSeed];
}
