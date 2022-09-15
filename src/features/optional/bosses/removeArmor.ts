import { DamageFlag, IsaacVariant } from "isaac-typescript-definitions";
import { asNumber, saveDataManager } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

const v = {
  run: {
    dealingManualDamage: false,
  },
};

export function init(): void {
  saveDataManager("removeArmor", v);
}

// ModCallback.ENTITY_TAKE_DMG (11)
// EntityType.ISAAC (102)
export function entityTakeDmgIsaac(
  entity: Entity,
  amount: float,
  damageFlags: BitFlags<DamageFlag>,
  source: EntityRef,
  countdownFrames: int,
): boolean | undefined {
  // The Hush version of Blue Baby has armor, but the other variants do not.
  if (entity.Variant === asNumber(IsaacVariant.BLUE_BABY_HUSH)) {
    return removeArmor(entity, amount, damageFlags, source, countdownFrames);
  }

  return undefined;
}

// ModCallback.ENTITY_TAKE_DMG (11)
// EntityType.MEGA_SATAN (274)
export function entityTakeDmgMegaSatan(
  entity: Entity,
  amount: float,
  damageFlags: BitFlags<DamageFlag>,
  source: EntityRef,
  countdownFrames: int,
): boolean | undefined {
  return removeArmor(entity, amount, damageFlags, source, countdownFrames);
}

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
// EntityType.MOTHER (912)
export function entityTakeDmgMother(
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

// ModCallback.ENTITY_TAKE_DMG (11)
// EntityType.BEAST (951)
export function entityTakeDmgBeast(
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
    return undefined;
  }

  if (v.run.dealingManualDamage) {
    return;
  }

  entity.HitPoints -= amount;

  // We need to make the enemy flag red, so we deal 0 damage.
  v.run.dealingManualDamage = true;
  entity.TakeDamage(0, damageFlags, source, countdownFrames);
  v.run.dealingManualDamage = false;

  if (entity.HitPoints <= 0) {
    entity.Kill();
  }

  return false;
}
