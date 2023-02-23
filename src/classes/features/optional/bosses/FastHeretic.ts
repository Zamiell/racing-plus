import {
  EntityCollisionClass,
  EntityType,
  ExorcistVariant,
  ModCallback,
  NPCState,
} from "isaac-typescript-definitions";
import { Callback, getNPCs } from "isaacscript-common";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

export class FastHeretic extends ConfigurableModFeature {
  configKey: keyof Config = "FastHeretic";

  // 28, 905
  @Callback(ModCallback.POST_NPC_RENDER, EntityType.HERETIC)
  postNPCRenderHeretic(npc: EntityNPC): void {
    // The Heretic starts the encounter by spending a long time summoning, so we just immediately
    // end the animation.
    const sprite = npc.GetSprite();
    const animation = sprite.GetAnimation();
    if (animation !== "Summoning") {
      return;
    }
    sprite.SetLastFrame();

    // We also have to manually set the collision class, or else The Heretic will still be
    // `EntityCollisionClass.NONE` (0) when all of the Fanatics being killed.
    npc.EntityCollisionClass = EntityCollisionClass.ALL;

    // We also need to manually "enable" all of the Fanatics in the room, or they will permanently
    // be stuck in the state `NPCState.SPECIAL` (16).
    const fanatics = getNPCs(EntityType.EXORCIST, ExorcistVariant.FANATIC);
    for (const fanatic of fanatics) {
      // They start at `NPCState.SPECIAL` (16) when summoning and then go to state
      // `NPCState.SUICIDE` when the Heretic frees them.
      fanatic.State = NPCState.SUICIDE;
    }
  }
}
