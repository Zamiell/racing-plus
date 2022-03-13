import * as doubleAngelNerf from "../features/mandatory/doubleAngelNerf";
import * as dummyDPS from "../features/mandatory/dummyDPS";
import { fastTravelEntityTakeDmgPlayer } from "../features/optional/major/fastTravel/callbacks/entityTakeDmg";
import * as freeDevilItem from "../features/optional/major/freeDevilItem";
import * as roll from "../features/optional/other/roll";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_ENTITY_TAKE_DMG,
    entityTakeDmgPlayer,
    EntityType.ENTITY_PLAYER, // 1
  );

  mod.AddCallback(
    ModCallbacks.MC_ENTITY_TAKE_DMG,
    uriel,
    EntityType.ENTITY_URIEL, // 271
  );

  mod.AddCallback(
    ModCallbacks.MC_ENTITY_TAKE_DMG,
    gabriel,
    EntityType.ENTITY_GABRIEL, // 272
  );

  mod.AddCallback(
    ModCallbacks.MC_ENTITY_TAKE_DMG,
    dummy,
    EntityType.ENTITY_DUMMY, // 964
  );
}

function entityTakeDmgPlayer(
  tookDamage: Entity,
  damageAmount: float,
  damageFlags: int,
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

  // Other
  roll.entityTakeDmgPlayer(player);

  return undefined;
}

// EntityType.ENTITY_URIEL (271)
function uriel(
  _tookDamage: Entity,
  _damageAmount: float,
  _damageFlags: int,
  damageSource: EntityRef,
  _damageCountdownFrames: int,
) {
  return doubleAngelNerf.entityTakeDmgUriel(damageSource);
}

// EntityType.ENTITY_GABRIEL (272)
function gabriel(
  _tookDamage: Entity,
  _damageAmount: float,
  _damageFlags: int,
  damageSource: EntityRef,
  _damageCountdownFrames: int,
) {
  return doubleAngelNerf.entityTakeDmgGabriel(damageSource);
}

// EntityType.ENTITY_DUMMY (964)
function dummy(
  _tookDamage: Entity,
  damageAmount: float,
  _damageFlags: int,
  _damageSource: EntityRef,
  _damageCountdownFrames: int,
) {
  dummyDPS.entityTakeDmgDummy(damageAmount);
}
