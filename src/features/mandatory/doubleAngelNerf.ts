// ModCallback.ENTITY_TAKE_DMG (11)

import { EntityType } from "isaac-typescript-definitions";

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
