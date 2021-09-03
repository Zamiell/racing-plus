import * as debugPowers from "../features/mandatory/debugPowers";
import fastTravelEntityTakeDmgPlayer from "../features/optional/major/fastTravel/callbacks/entityTakeDmg";
import * as freeDevilItem from "../features/optional/major/freeDevilItem";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_ENTITY_TAKE_DMG,
    player,
    EntityType.ENTITY_PLAYER, // 1
  );
}

function player(
  tookDamage: Entity,
  _damageAmount: float,
  damageFlags: int,
  _damageSource: EntityRef,
  _damageCountdownFrames: int,
) {
  // Mandatory features
  const sustainDamage = debugPowers.entityTakeDmgPlayer();
  if (sustainDamage !== undefined) {
    return sustainDamage;
  }

  // Major features
  freeDevilItem.entityTakeDmgPlayer(tookDamage, damageFlags);
  fastTravelEntityTakeDmgPlayer(tookDamage, damageFlags);

  return undefined;
}
