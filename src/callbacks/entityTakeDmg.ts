import * as debugPowers from "../features/mandatory/debugPowers";
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
    dummy,
    EntityType.ENTITY_DUMMY, // 964
  );
}

function entityTakeDmgPlayer(
  tookDamage: Entity,
  _damageAmount: float,
  damageFlags: int,
  _damageSource: EntityRef,
  _damageCountdownFrames: int,
) {
  const player = tookDamage.ToPlayer();
  if (player === undefined) {
    return undefined;
  }

  // Features that prevent damage
  const sustainDamage = debugPowers.entityTakeDmgPlayer();
  if (sustainDamage !== undefined) {
    return sustainDamage;
  }

  // Major
  freeDevilItem.entityTakeDmgPlayer(tookDamage, damageFlags);
  fastTravelEntityTakeDmgPlayer(damageFlags);

  // Other
  roll.entityTakeDmgPlayer(player);

  return undefined;
}

function dummy(
  _tookDamage: Entity,
  damageAmount: float,
  _damageFlags: int,
  _damageSource: EntityRef,
  _damageCountdownFrames: int,
) {
  dummyDPS.entityTakeDmgDummy(damageAmount);
}
