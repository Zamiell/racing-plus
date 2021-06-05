import g from "../../../globals";

export function preEntitySpawn(initSeed: int): [int, int, int, int] | null {
  if (g.config.replaceCodWorms) {
    // Replace Cod Worms with Para-Bites
    return [EntityType.ENTITY_PARA_BITE, 0, 0, initSeed];
  }

  return null;
}
