import { IsaacVariant } from "isaac-typescript-definitions";
import { asNumber } from "isaacscript-common";
import { config } from "../../../modConfigMenu";

// ModCallback.ENTITY_TAKE_DMG (11)
// EntityType.ISAAC (102)
export function entityTakeDmgIsaac(
  entity: Entity,
  amount: float,
): boolean | undefined {
  // The Hush version of Blue Baby has armor, but the other variants do not.
  if (entity.Variant === asNumber(IsaacVariant.BLUE_BABY_HUSH)) {
    return removeArmor(entity, amount);
  }

  return undefined;
}

// ModCallback.ENTITY_TAKE_DMG (11)
// EntityType.MEGA_SATAN (274)
export function entityTakeDmgMegaSatan(
  entity: Entity,
  amount: float,
): boolean | undefined {
  return removeArmor(entity, amount);
}

// ModCallback.ENTITY_TAKE_DMG (11)
// EntityType.MEGA_SATAN_2 (275)
export function entityTakeDmgMegaSatan2(
  entity: Entity,
  amount: float,
): boolean | undefined {
  return removeArmor(entity, amount);
}

// ModCallback.ENTITY_TAKE_DMG (11)
// EntityType.HUSH (407)
export function entityTakeDmgHush(
  entity: Entity,
  amount: float,
): boolean | undefined {
  return removeArmor(entity, amount);
}

// ModCallback.ENTITY_TAKE_DMG (11)
// EntityType.MOTHER (912)
export function entityTakeDmgMother(
  entity: Entity,
  amount: float,
): boolean | undefined {
  return removeArmor(entity, amount);
}

// ModCallback.ENTITY_TAKE_DMG (11)
// EntityType.DOGMA (950)
export function entityTakeDmgDogma(
  entity: Entity,
  amount: float,
): boolean | undefined {
  return removeArmor(entity, amount);
}

// ModCallback.ENTITY_TAKE_DMG (11)
// EntityType.BEAST (951)
export function entityTakeDmgBeast(
  entity: Entity,
  amount: float,
): boolean | undefined {
  return removeArmor(entity, amount);
}

function removeArmor(entity: Entity, amount: float): boolean | undefined {
  if (!config.removeArmor) {
    return undefined;
  }

  entity.HitPoints -= amount;
  Isaac.DebugString(
    `GETTING HERE - manually dealt: ${amount}, HitPoints: ${entity.HitPoints}`,
  );
  if (entity.HitPoints <= 0) {
    entity.Kill();
  }

  return false;
}
