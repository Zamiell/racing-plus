import {
  DamageFlag,
  EntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import * as doubleAngelNerf from "../features/mandatory/doubleAngelNerf";
import * as dummyDPS from "../features/mandatory/dummyDPS";
import { fastTravelEntityTakeDmgPlayer } from "../features/optional/major/fastTravel/callbacks/entityTakeDmg";
import * as freeDevilItem from "../features/optional/major/freeDevilItem";
import * as roll from "../features/optional/other/roll";
import * as bloodyLustChargeBar from "../features/optional/quality/bloodyLustChargeBar/bloodyLustChargeBar";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallback.ENTITY_TAKE_DMG,
    entityTakeDmgPlayer,
    EntityType.PLAYER, // 1
  );

  mod.AddCallback(
    ModCallback.ENTITY_TAKE_DMG,
    uriel,
    EntityType.URIEL, // 271
  );

  mod.AddCallback(
    ModCallback.ENTITY_TAKE_DMG,
    gabriel,
    EntityType.GABRIEL, // 272
  );

  mod.AddCallback(
    ModCallback.ENTITY_TAKE_DMG,
    dummy,
    EntityType.DUMMY, // 964
  );
}

function entityTakeDmgPlayer(
  tookDamage: Entity,
  damageAmount: float,
  damageFlags: BitFlags<DamageFlag>,
  _damageSource: EntityRef,
  _damageCountdownFrames: int,
) {
  const player = tookDamage.ToPlayer();
  if (player === undefined) {
    return undefined;
  }

  // Major
  freeDevilItem.entityTakeDmgPlayer(tookDamage, damageAmount, damageFlags);
  fastTravelEntityTakeDmgPlayer(damageFlags);

  // QoL
  bloodyLustChargeBar.entityTakeDmgPlayer(player);

  // Other
  roll.entityTakeDmgPlayer(player);

  return undefined;
}

// EntityType.URIEL (271)
function uriel(
  _tookDamage: Entity,
  _damageAmount: float,
  _damageFlags: BitFlags<DamageFlag>,
  damageSource: EntityRef,
  _damageCountdownFrames: int,
) {
  return doubleAngelNerf.entityTakeDmgUriel(damageSource);
}

// EntityType.GABRIEL (272)
function gabriel(
  _tookDamage: Entity,
  _damageAmount: float,
  _damageFlags: BitFlags<DamageFlag>,
  damageSource: EntityRef,
  _damageCountdownFrames: int,
) {
  return doubleAngelNerf.entityTakeDmgGabriel(damageSource);
}

// EntityType.DUMMY (964)
function dummy(
  _tookDamage: Entity,
  damageAmount: float,
  _damageFlags: BitFlags<DamageFlag>,
  _damageSource: EntityRef,
  _damageCountdownFrames: int,
) {
  dummyDPS.entityTakeDmgDummy(damageAmount);
}
