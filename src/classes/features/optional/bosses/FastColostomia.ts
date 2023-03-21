import {
  ColostomiaState,
  EffectVariant,
  EntityType,
  ModCallback,
  PoofSubType,
} from "isaac-typescript-definitions";
import { Callback, asNPCState, spawnEffect } from "isaacscript-common";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

/**
 * In vanilla, Colostomia takes a second or two to drop down from the ceiling. Instead, just make it
 * appear on the ground like every other boss in the game does.
 */
export class FastColostomia extends ConfigurableModFeature {
  configKey: keyof Config = "FastColostomia";

  // 27, 917
  @Callback(ModCallback.POST_NPC_INIT, EntityType.COLOSTOMIA)
  postNPCInitColostomia(npc: EntityNPC): void {
    // The state starts at `ColostomiaState.IDLE_PHASE_1` and then always transitions to
    // `ColostomiaState.SPIT_POOP_BOMB`. By immediately setting the state to
    // `ColostomiaState.SPIT_POOP_BOMB`, it will force the NPC to be on the ground.
    npc.State = asNPCState(ColostomiaState.SPIT_POOP_BOMB);

    // Make it have a poof of smoke like a normal boss.
    spawnEffect(
      EffectVariant.POOF_1,
      PoofSubType.LARGE, // This is the sub-type that the Monstro poof has.
      npc.Position,
    );
  }
}
