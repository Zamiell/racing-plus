import { IsaacVariant, PlayerType } from "isaac-typescript-definitions";
import {
  asNumber,
  getPlayerFromEntity,
  isCharacter,
  setEntityDamageFlash,
} from "isaacscript-common";
import { config } from "../../../modConfigMenu";

// ModCallback.ENTITY_TAKE_DMG (11)
// EntityType.ISAAC (102)
export function entityTakeDmgIsaac(
  entity: Entity,
  amount: float,
  source: EntityRef,
): boolean | undefined {
  // The Hush version of Blue Baby has armor, but the other variants do not.
  if (entity.Variant === asNumber(IsaacVariant.BLUE_BABY_HUSH)) {
    return removeArmor(entity, amount, source);
  }

  return undefined;
}

// ModCallback.ENTITY_TAKE_DMG (11)
// EntityType.MEGA_SATAN (274)
export function entityTakeDmgMegaSatan(
  entity: Entity,
  amount: float,
  source: EntityRef,
): boolean | undefined {
  return removeArmor(entity, amount, source);
}

// ModCallback.ENTITY_TAKE_DMG (11)
// EntityType.MEGA_SATAN_2 (275)
export function entityTakeDmgMegaSatan2(
  entity: Entity,
  amount: float,
  source: EntityRef,
): boolean | undefined {
  return removeArmor(entity, amount, source);
}

// ModCallback.ENTITY_TAKE_DMG (11)
// EntityType.HUSH (407)
export function entityTakeDmgHush(
  entity: Entity,
  amount: float,
  source: EntityRef,
): boolean | undefined {
  return removeArmor(entity, amount, source);
}

// ModCallback.ENTITY_TAKE_DMG (11)
// EntityType.MOTHER (912)
export function entityTakeDmgMother(
  entity: Entity,
  amount: float,
  source: EntityRef,
): boolean | undefined {
  return removeArmor(entity, amount, source);
}

// ModCallback.ENTITY_TAKE_DMG (11)
// EntityType.DOGMA (950)
export function entityTakeDmgDogma(
  entity: Entity,
  amount: float,
  source: EntityRef,
): boolean | undefined {
  return removeArmor(entity, amount, source);
}

// ModCallback.ENTITY_TAKE_DMG (11)
// EntityType.BEAST (951)
export function entityTakeDmgBeast(
  entity: Entity,
  amount: float,
  source: EntityRef,
): boolean | undefined {
  return removeArmor(entity, amount, source);
}

function removeArmor(
  entity: Entity,
  amount: float,
  source: EntityRef,
): boolean | undefined {
  if (!config.removeArmor) {
    return undefined;
  }

  entity.HitPoints -= amount;

  // Modifying the hit points directly will not make the enemy flash red.
  setEntityDamageFlash(entity);

  // Since we are not dealing damage in the normal way, the charge from Berserk will not be
  // incremented.
  if (source.Entity !== undefined) {
    const player = getPlayerFromEntity(source.Entity);
    if (player !== undefined) {
      if (isCharacter(player, PlayerType.SAMSON_B)) {
        player.SamsonBerserkCharge += amount;
        Isaac.DebugString(`GETTING HERE: ${amount}`);
      }
    }
  }

  // Ignore the case of 4.5 Volt, since there is no way to manually charge the item in the
  // appropriate way.

  // Enemies with lower than 0 HP will not actually die, so we must manually kill them if so.
  if (entity.HitPoints <= 0) {
    entity.Kill();
  }

  return false;
}
