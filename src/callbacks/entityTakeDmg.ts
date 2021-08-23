import * as debugPowers from "../features/mandatory/debugPowers";
import fastTravelEntityTakeDmgPlayer from "../features/optional/major/fastTravel/callbacks/entityTakeDmg";
import * as freeDevilItem from "../features/optional/major/freeDevilItem";
import * as raceEntityTakeDmg from "../features/race/callbacks/entityTakeDmg";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_ENTITY_TAKE_DMG,
    player,
    EntityType.ENTITY_PLAYER, // 1
  );
}

function player(
  tookDamage: Entity,
  damageAmount: float,
  damageFlags: int,
  _damageSource: EntityRef,
  _damageCountdownFrames: int,
) {
  let returnValue: boolean | void;

  // Mandatory features
  returnValue = debugPowers.entityTakeDmgPlayer();
  if (returnValue !== undefined) {
    return returnValue;
  }
  returnValue = raceEntityTakeDmg.entityTakeDmgPlayer(tookDamage, damageAmount);
  if (returnValue !== undefined) {
    return returnValue;
  }

  // Major features
  freeDevilItem.entityTakeDmgPlayer(tookDamage, damageFlags);
  fastTravelEntityTakeDmgPlayer(tookDamage, damageFlags);

  return undefined;
}
