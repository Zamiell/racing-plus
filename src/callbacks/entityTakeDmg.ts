import * as fastTravelEntityTakeDmg from "../features/optional/major/fastTravel/callbacks/entityTakeDmg";
import * as freeDevilItem from "../features/optional/major/freeDevilItem";
import g from "../globals";
import { hasFlag } from "../misc";

export function player(
  tookDamage: Entity,
  _damageAmount: float,
  damageFlags: int,
  _damageSource: EntityRef,
  _damageCountdownFrames: int,
): boolean | null {
  sacrificeRoom(damageFlags);

  // Major features
  freeDevilItem.entityTakeDmgPlayer(tookDamage, damageFlags);
  fastTravelEntityTakeDmg.entityTakeDmgPlayer(tookDamage, damageFlags);

  return null;
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
