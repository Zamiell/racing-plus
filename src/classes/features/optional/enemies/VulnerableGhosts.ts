import {
  EntityCollisionClass,
  EntityType,
  HauntVariant,
} from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

/**
 * In vanilla, tears will pass through ghosts during their "Appear" animation, granting them
 * invulnerability. This is because the ghost is set to `EntityCollisionClass.NONE` when they spawn,
 * and then set to `EntityCollisionClass.PLAYER_OBJECTS` during their first reappearance.
 *
 * Fix the invulnerability by manually setting the `EntityCollisionClass`. This cannot be done in
 * the `POST_NPC_INIT` callback because setting the `EntityCollisionClass` there has no effect.
 */
export class VulnerableGhosts extends ConfigurableModFeature {
  configKey: keyof Config = "VulnerableGhosts";

  @CallbackCustom(ModCallbackCustom.POST_NPC_INIT_LATE, EntityType.WIZOOB)
  postNPCInitLateWizoob(npc: EntityNPC): void {
    setGhostCollisionClass(npc);
  }

  @CallbackCustom(
    ModCallbackCustom.POST_NPC_INIT_LATE,
    EntityType.HAUNT,
    HauntVariant.LIL_HAUNT,
  )
  postNPCInitLateLilHaunt(npc: EntityNPC): void {
    setGhostCollisionClass(npc);
  }

  @CallbackCustom(ModCallbackCustom.POST_NPC_INIT_LATE, EntityType.RED_GHOST)
  postNPCInitLateRedGhost(npc: EntityNPC): void {
    setGhostCollisionClass(npc);
  }
}

function setGhostCollisionClass(npc: EntityNPC) {
  npc.EntityCollisionClass = EntityCollisionClass.PLAYER_OBJECTS;
}
