/*

Notes:

1) If we want to prevent entities from spawning, we cannot return an entity type of 0,
   since the game will crash
   Instead, in most cases we can return an effect with a variant of 0,
   which is a non-interacting invisible thing

2) Sometimes if you return something other than the type (e.g. replacing a pickup with an effect),
   the game will crash, so you need to replace a pickup with a blank pickup
   (as opposed to a blank effect)

*/

import { preEntitySpawnFunctions } from "./preEntitySpawnFunctions";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_PRE_ENTITY_SPAWN, main);
}

function main(
  entityType: EntityType | int,
  variant: int,
  subType: int,
  position: Vector,
  _velocity: Vector,
  spawner: Entity,
  initSeed: int,
): [EntityType, int, int, int] | void {
  const preEntityFunction = preEntitySpawnFunctions.get(entityType);
  if (preEntityFunction !== undefined) {
    return preEntityFunction(variant, subType, position, spawner, initSeed);
  }

  return undefined;
}
