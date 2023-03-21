import {
  EntityType,
  LambVariant,
  ModCallback,
  NPCState,
} from "isaac-typescript-definitions";
import { Callback, ReadonlySet, asNumber } from "isaacscript-common";
import { mod } from "../../../../mod";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const FADE_AMOUNT = 0.4;
const FADE_COLOR = Color(1, 1, 1, FADE_AMOUNT, 0, 0, 0);

const MULTI_SEGMENT_BOSSES = new ReadonlySet<EntityType>([
  EntityType.LARRY_JR, // 19 (and The Hollow / Tuff Twins / The Shell)
  EntityType.PIN, // 62 (and Scolex / Frail / Wormwood)
  EntityType.GEMINI, // 79 (and Steven / Blighted Ovum)
  EntityType.HEART_OF_INFAMY, // 98
  EntityType.TURDLET, // 918
]);

/** When beginning a death animation, make bosses faded so that it makes it easier to see. */
export class FadeBosses extends ConfigurableModFeature {
  configKey: keyof Config = "FadeBosses";

  // 68
  @Callback(ModCallback.POST_ENTITY_KILL)
  postEntityKill(entity: Entity): void {
    this.fadeBoss(entity);
  }

  fadeBoss(entity: Entity, deferred = false): void {
    // We only want to fade bosses.
    const npc = entity.ToNPC();
    if (npc === undefined || !npc.IsBoss()) {
      return;
    }

    // We don't want to fade multi-segment bosses since killing one segment will fade the rest of
    // the segments.
    if (MULTI_SEGMENT_BOSSES.has(entity.Type)) {
      return;
    }

    // Killing the first phase of Hornfel will trigger the `POST_ENTITY_KILL` callback, so do not
    // fade Hornfel in this case. (Hornfel will be in `NPCState.MOVE` in his second phase when he is
    // running away from the player.)
    if (npc.Type === EntityType.HORNFEL && npc.State !== NPCState.MOVE) {
      return;
    }

    // There is an edge-case with The Lamb where if you deal fatal damage to it in phase 1, it will
    // trigger the `POST_ENTITY_KILL` callback. However, in this situation, The Lamb will not
    // actually die, and will instead proceed to transition to phase 2 anyway. To work around this,
    // wait a frame before checking to see if all of the Lamb entities are dead.
    if (
      npc.Type === EntityType.THE_LAMB &&
      npc.Variant === asNumber(LambVariant.LAMB)
    ) {
      if (deferred) {
        if (!npc.IsDead()) {
          return;
        }
      } else {
        mod.runNextGameFrame(() => {
          this.fadeBoss(entity, true);
        });
        return;
      }
    }

    // A low duration won't work. The longer the duration, the more fade, and a fade of 1000 looks
    // nice. The priority doesn't matter.
    entity.SetColor(FADE_COLOR, 1000, 0, true, true);
  }
}
