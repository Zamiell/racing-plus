/*

Notes:

1) If we want to prevent entities from spawning, we cannot return an entity type of 0, since the
   game will crash. Instead, in most cases we can return an effect with a variant of 0, which is a
   non-interacting invisible thing

2) Sometimes, if you return a type other than the original type (e.g. replacing a pickup with an
   effect), the game will crash. Thus, you should replace a pickup with a blank pickup (as opposed
   to a blank effect)

*/

import { log } from "isaacscript-common";
import { preEntitySpawnFunctions } from "./preEntitySpawnFunctions";

const DEBUG = false;

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
  if (DEBUG) {
    log(
      `MC_PRE_ENTITY_SPAWN - ${entityType}.${variant}.${subType} - ${initSeed}`,
    );
  }

  const preEntityFunction = preEntitySpawnFunctions.get(entityType);
  if (preEntityFunction !== undefined) {
    return preEntityFunction(variant, subType, position, spawner, initSeed);
  }

  return undefined;
}
