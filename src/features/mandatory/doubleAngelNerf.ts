// ModCallbacks.MC_ENTITY_TAKE_DMG (11)
// EntityType.ENTITY_URIEL (271)
export function entityTakeDmgUriel(damageSource: EntityRef): boolean | void {
  return preventDamageFromAngels(damageSource);
}

// ModCallbacks.MC_ENTITY_TAKE_DMG (11)
// EntityType.ENTITY_GABRIEL (272)
export function entityTakeDmgGabriel(damageSource: EntityRef): boolean | void {
  return preventDamageFromAngels(damageSource);
}

function preventDamageFromAngels(damageSource: EntityRef): boolean | void {
  const entity = damageSource.Entity;
  if (entity === undefined || !entity.Exists()) {
    return undefined;
  }

  if (
    entity.Type === EntityType.ENTITY_URIEL ||
    entity.Type === EntityType.ENTITY_GABRIEL
  ) {
    return false;
  }

  return undefined;
}
