import * as freeDevilItem from "../features/freeDevilItem";

export function main(
  tookDamage: Entity,
  damageAmount: float,
  damageFlags: DamageFlag,
  damageSource: EntityRef,
  damageCountdownFrames: int,
): boolean | null {
  freeDevilItem.entityTakeDmg(
    tookDamage,
    damageAmount,
    damageFlags,
    damageSource,
    damageCountdownFrames,
  );

  return null;
}
