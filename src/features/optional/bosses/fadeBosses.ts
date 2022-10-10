// When beginning a death animation, make bosses faded so that it makes it easier to see.

import {
  EntityType,
  LambVariant,
  NpcState,
} from "isaac-typescript-definitions";
import { asNumber } from "isaacscript-common";
import { mod } from "../../../mod";
import { config } from "../../../modConfigMenu";

const FADE_AMOUNT = 0.4;
const FADE_COLOR = Color(1, 1, 1, FADE_AMOUNT, 0, 0, 0);

const MULTI_SEGMENT_BOSSES: ReadonlySet<EntityType> = new Set([
  EntityType.LARRY_JR, // 19 (and The Hollow / Tuff Twins / The Shell)
  EntityType.PIN, // 62 (and Scolex / Frail / Wormwood)
  EntityType.GEMINI, // 79 (and Steven / Blighted Ovum)
  EntityType.HEART_OF_INFAMY, // 98
  EntityType.TURDLET, // 918
]);

// ModCallback.POST_ENTITY_KILL (68)
export function postEntityKill(entity: Entity): void {
  if (!config.fadeBosses) {
    return;
  }

  fadeBosses(entity);
}

function fadeBosses(entity: Entity, deferred = false) {
  // We only want to fade bosses.
  const npc = entity.ToNPC();
  if (npc === undefined || !npc.IsBoss()) {
    return;
  }

  // We don't want to fade multi-segment bosses since killing one segment will fade the rest of the
  // segments.
  if (MULTI_SEGMENT_BOSSES.has(entity.Type)) {
    return;
  }

  // Killing the first phase of Hornfel will trigger the `POST_ENTITY_KILL` callback, so do not fade
  // Hornfel in this case. (Hornfel will be in `NpcState.MOVE` in his second phase when he is
  // running away from the player.)
  if (npc.Type === EntityType.HORNFEL && npc.State !== NpcState.MOVE) {
    return;
  }

  // There is an edge-case with The Lamb where if you deal fatal damage to it in phase 1, it will
  // trigger the `POST_ENTITY_KILL` callback. However, in this situation, The Lamb will not actually
  // die, and will instead proceed to transition to phase 2 anyway. To work around this, wait a
  // frame before checking to see if all of the Lamb entities are dead.
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
        fadeBosses(entity, true);
      });
      return;
    }
  }

  // A low duration won't work. The longer the duration, the more fade, and a fade of 1000 looks
  // nice. The priority doesn't matter.
  entity.SetColor(FADE_COLOR, 1000, 0, true, true);
}
