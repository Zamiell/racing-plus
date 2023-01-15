// This feature is not configurable since it overall a nerf to vanilla.

import { EntityType } from "isaac-typescript-definitions";

/** In vanilla, this is 660. */
const NERFED_GABRIEL_HP_AMOUNT = 400;

// ModCallback.POST_NPC_INIT (27)
// EntityType.GABRIEL (272)
export function postNPCInitGabriel(npc: EntityNPC): void {
  npc.MaxHitPoints = NERFED_GABRIEL_HP_AMOUNT;
  npc.HitPoints = NERFED_GABRIEL_HP_AMOUNT;
}

// ModCallback.ENTITY_TAKE_DMG (11)
// EntityType.URIEL (271)
export function entityTakeDmgUriel(source: EntityRef): boolean | undefined {
  return preventDamageFromAngels(source);
}

// ModCallback.ENTITY_TAKE_DMG (11)
// EntityType.GABRIEL (272)
export function entityTakeDmgGabriel(source: EntityRef): boolean | undefined {
  return preventDamageFromAngels(source);
}

function preventDamageFromAngels(source: EntityRef): boolean | undefined {
  const entity = source.Entity;
  if (entity === undefined || !entity.Exists()) {
    return undefined;
  }

  if (entity.Type === EntityType.URIEL || entity.Type === EntityType.GABRIEL) {
    return false;
  }

  return undefined;
}
