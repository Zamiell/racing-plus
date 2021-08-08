/*
// EntityType.ENTITY_PLAYER (1)
// (this must return null || false)
export function player(
  _tookDamage: Entity,
  damageAmount: float,
  damageFlag: DamageFlag,
  _damageSource: EntityRef,
  _damageCountdownFrames: int,
): boolean | null {
  // Make us invincible while interacting with a trapdoor
  if (g.run.trapdoor.state > 0) {
    return false;
  }

  sacrificeRoom(damageFlag);
  recordDamageFrame(damageFlag); // This must be after the "sacrificeRoom()" function
  return seededDeath.entityTakeDmgPlayer(damageAmount);
}

function recordDamageFrame(damageFlag: DamageFlag) {
  const gameFrameCount = g.g.GetFrameCount();
  const roomType = g.r.GetType();
  const bit = (damageFlag & (1 << 7)) >>> 7; // DamageFlag.DAMAGE_SPIKES

  // Don't record the frame if we are potentially going to the Angel Room from a Sacrifice Room
  if (
    roomType === RoomType.ROOM_SACRIFICE &&
    bit === 1 &&
    g.run.level.numSacrifices === 6
  ) {
    return;
  }

  // Keep track of when we take damage so that we can detect Cursed Eye teleports
  g.run.lastDamageFrame = gameFrameCount;
}
*/
