// After killing Mom, Mom's Heart, or It Lives!, all entities in the room are killed
// However, the developers did not consider that Globins need to be killed twice
// (to kill their flesh pile forms)
// Blisters also need to be killed twice (to kill the spawned Sacks)
// Racing+ manually fixes this bug by explicitly killing them (and removing Fistula and Teratoma)

import { getNPCs, saveDataManager } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

const BUGGED_NPC_TYPES: ReadonlySet<EntityType> = new Set([
  EntityType.ENTITY_GLOBIN, // 24
  EntityType.ENTITY_BOIL, // 30
  EntityType.ENTITY_FISTULA_BIG, // 71 (also includes Teratoma)
  EntityType.ENTITY_FISTULA_MEDIUM, // 72 (also includes Teratoma)
  EntityType.ENTITY_FISTULA_SMALL, // 73 (also includes Teratoma)
  EntityType.ENTITY_BLISTER, // 303
]);

const v = {
  room: {
    killedExtraEnemies: false,
  },
};

export function init(): void {
  saveDataManager("killExtraEnemies", v, featureEnabled);
}

function featureEnabled() {
  return config.killExtraEnemies;
}

// ModCallbacks.MC_POST_ENTITY_KILL (68)
// EntityType.ENTITY_MOM (45)
export function postEntityKillMom(): void {
  if (!config.killExtraEnemies) {
    return;
  }

  // There can be up to 5 Mom entities in the room
  if (v.room.killedExtraEnemies) {
    return;
  }

  killExtraEnemies();
}

// ModCallbacks.MC_POST_ENTITY_KILL (68)
// EntityType.ENTITY_MOMS_HEART (78)
export function postEntityKillMomsHeart(): void {
  if (!config.killExtraEnemies) {
    return;
  }

  // It Lives! will trigger this callback twice
  if (v.room.killedExtraEnemies) {
    return;
  }

  killExtraEnemies();
}

function killExtraEnemies() {
  v.room.killedExtraEnemies = true;

  for (const npc of getNPCs()) {
    if (BUGGED_NPC_TYPES.has(npc.Type)) {
      // Removing it just causes it to disappear, which looks buggy,
      // so show a small blood explosion as well
      npc.BloodExplode();
      npc.Remove();
    }
  }
}
