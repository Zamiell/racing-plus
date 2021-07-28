import * as fastTravelEntityTakeDmg from "../features/optional/major/fastTravel/callbacks/entityTakeDmg";
import * as freeDevilItem from "../features/optional/major/freeDevilItem";
import g from "../globals";
import { hasFlag } from "../util";

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
  sacrificeRoom(damageFlags);

  // Major features
  freeDevilItem.entityTakeDmgPlayer(tookDamage, damageFlags);
  fastTravelEntityTakeDmg.entityTakeDmgPlayer(tookDamage, damageFlags);
}

function sacrificeRoom(damageFlags: int) {
  const roomType = g.r.GetType();

  if (roomType !== RoomType.ROOM_SACRIFICE) {
    return;
  }

  if (hasFlag(damageFlags, DamageFlag.DAMAGE_SPIKES)) {
    g.run.level.numSacrifices += 1;
  }
}
