import { config } from "../../../modConfigMenu";

// ModCallbacks.MC_PRE_ENTITY_SPAWN (24)
// EntityType.ENTITY_COD_WORM (221)
export function preEntitySpawnCodWorm(
  initSeed: int,
): [int, int, int, int] | void {
  if (!config.replaceCodWorms) {
    return undefined;
  }

  // Replace Cod Worms with Para-Bites
  return [EntityType.ENTITY_PARA_BITE, 0, 0, initSeed];
}
