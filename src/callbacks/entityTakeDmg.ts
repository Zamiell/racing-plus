import * as freeDevilItem from "../features/optional/major/freeDevilItem";

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
