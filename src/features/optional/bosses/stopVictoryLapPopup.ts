import * as charge from "../../../charge";
import g from "../../../globals";
import log from "../../../log";
import { EffectVariantCustom } from "../../../types/enums";

export function postEntityKillLamb(_entity: Entity): void {
  if (!g.config.stopVictoryLapPopup) {
    return;
  }

  if (allLambEntitiesDead()) {
    Isaac.Spawn(
      EntityType.ENTITY_EFFECT,
      EffectVariantCustom.ROOM_CLEAR_DELAY,
      0,
      Vector.Zero,
      Vector.Zero,
      null,
    );
    log('Spawned the "Room Clear Delay Effect" custom entity (for The Lamb).');
    // (this will not work to delay the room clearing if "debug 10" is turned on)

    emulateRoomClear();
  }
}

function allLambEntitiesDead() {
  const lambs = Isaac.FindByType(EntityType.ENTITY_THE_LAMB);
  for (const lamb of lambs) {
    if (lamb.IsInvincible()) {
      continue;
    }

    if (!lamb.IsDead()) {
      return false;
    }
  }

  return true;
}

function emulateRoomClear() {
  // Emulate the room being cleared
  g.r.SetClear(true);
  charge.checkAdd();
  g.sfx.Play(SoundEffect.SOUND_DOOR_HEAVY_OPEN);

  // Spawn a big chest (which will get replaced with a trophy if we happen to be in a race)
  const position = g.r.GetCenterPos();
  Isaac.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_BIGCHEST,
    0,
    position,
    Vector.Zero,
    null,
  );
}
