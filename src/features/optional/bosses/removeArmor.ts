import { DamageFlag } from "isaac-typescript-definitions";
import { addFlag, hasArmor, hasFlag } from "isaacscript-common";
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

  // Instead of checking every entity in the game, we could have individual callbacks for each
  // individual entity that has armor. However, there are too many entities with armor for this to
  // be feasible. Additionally, we have to filter out entities without armor because adding
  // `DamageFlag.IGNORE_ARMOR` to all damage has some weird side effects, like fires not being able
  // to deal any damage, and the sneeze effect from Tainted Azazel not applying the debuff.
  if (!hasArmor(entity)) {
    return;
  }

  if (hasFlag(damageFlags, DamageFlag.IGNORE_ARMOR)) {
    return undefined;
  }

  const newDamageFlags = addFlag(damageFlags, DamageFlag.IGNORE_ARMOR);
  entity.TakeDamage(amount, newDamageFlags, source, countdownFrames);

  return false;
}
