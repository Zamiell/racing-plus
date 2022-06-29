// ModCallback.ENTITY_TAKE_DMG (11)

import { EntityType } from "isaac-typescript-definitions";

// EntityType.URIEL (271)
export function entityTakeDmgUriel(
  damageSource: EntityRef,
): boolean | undefined {
  return preventDamageFromAngels(damageSource);
}

// ModCallback.ENTITY_TAKE_DMG (11)
// EntityType.GABRIEL (272)
export function entityTakeDmgGabriel(
  damageSource: EntityRef,
): boolean | undefined {
  return preventDamageFromAngels(damageSource);
}

function preventDamageFromAngels(damageSource: EntityRef): boolean | undefined {
  const entity = damageSource.Entity;
  if (entity === undefined || !entity.Exists()) {
    return undefined;
  }

  if (entity.Type === EntityType.URIEL || entity.Type === EntityType.GABRIEL) {
    return false;
  }

  return undefined;
}
