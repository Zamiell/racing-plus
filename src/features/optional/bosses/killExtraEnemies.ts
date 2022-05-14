// After killing Mom, Mom's Heart, or It Lives!, all entities in the room are killed. However, the
// developers did not consider that Globins need to be killed twice (to kill their flesh pile
// forms). Blisters also need to be killed twice (to kill the spawned Sacks).

// Racing+ manually fixes this bug by explicitly killing them (and removing Fistula and Teratoma).

import { EntityType } from "isaac-typescript-definitions";
import { getNPCs, saveDataManager } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

const BUGGED_NPC_TYPES: ReadonlySet<EntityType> = new Set([
  EntityType.GLOBIN, // 24
  EntityType.BOIL, // 30
  EntityType.FISTULA_BIG, // 71 (also includes Teratoma)
  EntityType.FISTULA_MEDIUM, // 72 (also includes Teratoma)
  EntityType.FISTULA_SMALL, // 73 (also includes Teratoma)
  EntityType.BLISTER, // 303
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

// ModCallback.POST_ENTITY_KILL (68)
// EntityType.MOM (45)
export function postEntityKillMom(): void {
  if (!config.killExtraEnemies) {
    return;
  }

  // There can be up to 5 Mom entities in the room.
  if (v.room.killedExtraEnemies) {
    return;
  }

  killExtraEnemies();
}

// ModCallback.POST_ENTITY_KILL (68)
// EntityType.MOMS_HEART (78)
export function postEntityKillMomsHeart(): void {
  if (!config.killExtraEnemies) {
    return;
  }

  // It Lives! will trigger this callback twice.
  if (v.room.killedExtraEnemies) {
    return;
  }

  killExtraEnemies();
}

function killExtraEnemies() {
  v.room.killedExtraEnemies = true;

  for (const npc of getNPCs()) {
    if (BUGGED_NPC_TYPES.has(npc.Type)) {
      // Removing it just causes it to disappear, which looks buggy. Thus, show a small blood
      // explosion as well.
      npc.BloodExplode();
      npc.Remove();
    }
  }
}
