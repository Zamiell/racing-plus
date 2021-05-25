import * as fastClearPaschalCandle from "../features/optional/major/fastClear/paschalCandle";
import * as freeDevilItem from "../features/optional/major/freeDevilItem";

export function main(
  tookDamage: Entity,
  _damageAmount: float,
  damageFlags: DamageFlag,
  _damageSource: EntityRef,
  _damageCountdownFrames: int,
): boolean | null {
  freeDevilItem.entityTakeDmg(tookDamage, damageFlags);
  fastClearPaschalCandle.entityTakeDmg(tookDamage, damageFlags);

  return null;
}
