import { DamageFlag } from "isaac-typescript-definitions";
import { addFlag, hasFlag } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

// ModCallback.ENTITY_TAKE_DMG (11)
export function entityTakeDmg(
  entity: Entity,
  amount: float,
  damageFlags: BitFlags<DamageFlag>,
  source: EntityRef,
  countdownFrames: int,
): boolean | undefined {
  if (!config.removeArmor) {
    return undefined;
  }

  if (hasFlag(damageFlags, DamageFlag.IGNORE_ARMOR)) {
    return undefined;
  }

  // Instead of manually handling each entity in the game that has armor, we just add the
  // `DamageFlag.IGNORE_ARMOR` flag to all damage.
  const newDamageFlags = addFlag(damageFlags, DamageFlag.IGNORE_ARMOR);
  entity.TakeDamage(amount, newDamageFlags, source, countdownFrames);

  return false;
}
