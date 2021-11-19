import { config } from "../../../modConfigMenu";

// When beginning a death animation, make bosses faded so that it makes it easier to see

const FADE_AMOUNT = 0.4;
const FADE_COLOR = Color(1, 1, 1, FADE_AMOUNT, 0, 0, 0);

const MULTI_SEGMENT_BOSSES = new Set<EntityType>([
  EntityType.ENTITY_LARRYJR, // 19 (and The Hollow / Tuff Twins / The Shell)
  EntityType.ENTITY_PIN, // 62 (and Scolex / Frail / Wormwood)
  EntityType.ENTITY_GEMINI, // 79 (and Steven / Blighted Ovum)
  EntityType.ENTITY_HEART_OF_INFAMY, // 98
  EntityType.ENTITY_TURDLET, // 918
]);

export function postEntityKill(entity: Entity): void {
  if (!config.fadeBosses) {
    return;
  }

  // We only want to fade bosses
  const npc = entity.ToNPC();
  if (npc === undefined || !npc.IsBoss()) {
    return;
  }

  // We don't want to fade multi-segment bosses since killing one segment will fade the rest of the
  // segments
  if (MULTI_SEGMENT_BOSSES.has(entity.Type)) {
    return;
  }

  // A low duration won't work;
  // the longer the duration, the more fade, and a fade of 1000 looks nice
  // The priority doesn't matter
  entity.SetColor(FADE_COLOR, 1000, 0, true, true);
}
