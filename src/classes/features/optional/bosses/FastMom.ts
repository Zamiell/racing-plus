import { EntityType, ModCallback } from "isaac-typescript-definitions";
import { Callback, getNPCs, ReadonlySet } from "isaacscript-common";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const BUGGED_NPC_TYPES = new ReadonlySet<EntityType>([
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

/**
 * After killing Mom, Mom's Heart, or It Lives!, all entities in the room are killed. However, the
 * developers did not consider that Globins need to be killed twice (to kill their flesh pile
 * forms). Blisters also need to be killed twice (to kill the spawned Sacks).
 *
 * Racing+ manually fixes this bug by explicitly killing them (and removing Fistula and Teratoma).
 */
export class FastMom extends ConfigurableModFeature {
  configKey: keyof Config = "FastMom";
  v = v;

  // 68, 45
  @Callback(ModCallback.POST_ENTITY_KILL, EntityType.MOM)
  postEntityKillMom(): void {
    this.killLeftoverEnemies();
  }

  // 68, 78
  @Callback(ModCallback.POST_ENTITY_KILL, EntityType.MOMS_HEART)
  postEntityKillMomsHeart(): void {
    this.killLeftoverEnemies();
  }

  killLeftoverEnemies(): void {
    // - There can be up to 5 Mom entities in the room.
    // - It Lives will trigger this callback twice.
    if (v.room.killedExtraEnemies) {
      return;
    }
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
}
