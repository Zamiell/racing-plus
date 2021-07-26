/*
// EntityType.ENTITY_THE_LAMB (273)
export function theLamb(npc: EntityNPC): void {
  if (
    npc.Variant === 10 && // Lamb Body (273.10)
    npc.IsInvincible() && // It only turns invincible once it is defeated
    // This is necessary because the callback will be hit again during the removal
    !npc.IsDead()
  ) {
    // Remove the body once it is defeated so that it does not interfere with taking the trophy
    npc.Kill(); // This plays the blood and guts animation, but does not actually remove the entity
    npc.Remove();
  }
}
*/
