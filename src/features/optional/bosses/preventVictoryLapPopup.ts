import {
  addRoomClearCharges,
  getNPCs,
  log,
  onDarkRoom,
  openAllDoors,
} from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import { EffectVariantCustom } from "../../../types/EffectVariantCustom";

export function postEntityKillLamb(_entity: Entity): void {
  if (!config.preventVictoryLapPopup) {
    return;
  }

  // The Lamb only makes a popup on the Dark Room
  if (!onDarkRoom()) {
    return;
  }

  if (allLambEntitiesDead()) {
    Isaac.Spawn(
      EntityType.ENTITY_EFFECT,
      EffectVariantCustom.ROOM_CLEAR_DELAY,
      0,
      Vector.Zero,
      Vector.Zero,
      undefined,
    );
    log('Spawned the "Room Clear Delay Effect" custom entity (for The Lamb).');
    // (this will not work to delay the room clearing if "debug 10" is turned on)
    // (this will not die if the player uses Blood Rights since it is an effect)

    emulateRoomClear();
  }
}

function allLambEntitiesDead() {
  const lambs = getNPCs(EntityType.ENTITY_THE_LAMB);
  for (const lamb of lambs) {
    if (lamb.Variant === LambVariant.BODY && lamb.IsInvincible()) {
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
  addRoomClearCharges();
  openAllDoors();
  g.sfx.Play(SoundEffect.SOUND_DOOR_HEAVY_OPEN);

  // Spawn a big chest (which will get replaced with a trophy if we happen to be in a race)
  const position = g.r.GetCenterPos();
  Isaac.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_BIGCHEST,
    0,
    position,
    Vector.Zero,
    undefined,
  );
}
