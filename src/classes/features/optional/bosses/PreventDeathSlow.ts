import {
  DeathState,
  DeathVariant,
  EntityType,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  asNPCState,
} from "isaacscript-common";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

/** Stop Death from performing the attack that slows down the player. */
export class PreventDeathSlow extends ConfigurableModFeature {
  configKey: keyof Config = "PreventDeathSlow";

  @CallbackCustom(
    ModCallbackCustom.POST_NPC_UPDATE_FILTER,
    EntityType.DEATH,
    DeathVariant.DEATH,
  )
  postNPCUpdateDeath(npc: EntityNPC): void {
    if (npc.State === asNPCState(DeathState.SLOW_ATTACK)) {
      npc.State = asNPCState(DeathState.MOVE);
    }
  }
}
