import { DamageFlag } from "isaac-typescript-definitions";
import { config } from "../../../modConfigMenu";

let dealingManualDamage = false;

// ModCallback.ENTITY_TAKE_DMG (11)
// EntityType.MEGA_SATAN_2 (275)
export function entityTakeDmgMegaSatan2(
  entity: Entity,
  amount: float,
  damageFlags: BitFlags<DamageFlag>,
  source: EntityRef,
  countdownFrames: int,
): boolean | undefined {
  return removeArmor(entity, amount, damageFlags, source, countdownFrames);
}

// ModCallback.ENTITY_TAKE_DMG (11)
// EntityType.HUSH (407)
export function entityTakeDmgHush(
  entity: Entity,
  amount: float,
  damageFlags: BitFlags<DamageFlag>,
  source: EntityRef,
  countdownFrames: int,
): boolean | undefined {
  return removeArmor(entity, amount, damageFlags, source, countdownFrames);
}

// ModCallback.ENTITY_TAKE_DMG (11)
// EntityType.DOGMA (950)
export function entityTakeDmgDogma(
  entity: Entity,
  amount: float,
  damageFlags: BitFlags<DamageFlag>,
  source: EntityRef,
  countdownFrames: int,
): boolean | undefined {
  return removeArmor(entity, amount, damageFlags, source, countdownFrames);
}

function removeArmor(
  entity: Entity,
  amount: float,
  damageFlags: BitFlags<DamageFlag>,
  source: EntityRef,
  countdownFrames: int,
): boolean | undefined {
  if (!config.removeArmor) {
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
