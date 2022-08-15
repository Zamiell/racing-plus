import { DamageFlag } from "isaac-typescript-definitions";
import { config } from "../../../modConfigMenu";

let dealingManualDamage = false;

// ModCallback.ENTITY_TAKE_DMG (11)
// EntityType.HUSH (407)
export function entityTakeDmgHush(
  entity: Entity,
  amount: float,
  damageFlags: BitFlags<DamageFlag>,
  source: EntityRef,
  countdownFrames: int,
): boolean | undefined {
  if (!config.removeHushArmor) {
    return;
  }

  if (dealingManualDamage) {
    return;
  }

  dealingManualDamage = true;
  entity.TakeDamage(amount, damageFlags, source, countdownFrames);
  dealingManualDamage = false;

  return false;
}
