import { config } from "../../../modConfigMenu";

export function preEntitySpawn(initSeed: int): [int, int, int, int] | void {
  if (!config.replaceCodWorms) {
    return undefined;
  }

  // Replace Cod Worms with Para-Bites
  return [EntityType.ENTITY_PARA_BITE, 0, 0, initSeed];
}
