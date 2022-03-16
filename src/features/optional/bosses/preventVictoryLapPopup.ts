import {
  addRoomClearCharges,
  getNPCs,
  inMegaSatanRoom,
  log,
  onDarkRoom,
  openAllDoors,
  runNextGameFrame,
  saveDataManager,
  sfxManager,
} from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import { EffectVariantCustom } from "../../../types/EffectVariantCustom";

const v = {
  room: {
    pseudoClearedRoom: false,
  },
};

export function init(): void {
  saveDataManager("preventVictoryLapPopup", v, featureEnabled);
}

function featureEnabled() {
  return config.preventVictoryLapPopup;
}

// ModCallbacks.MC_POST_ENTITY_KILL (68)
// EntityType.ENTITY_THE_LAMB (273)
export function postEntityKillLamb(entity: Entity): void {
  if (!config.preventVictoryLapPopup) {
    return;
  }

  if (entity.HasEntityFlags(EntityFlag.FLAG_FRIENDLY)) {
    return;
  }

  if (!inUnclearedLambBossRoom()) {
    return;
  }

  // There is an edge-case with The Lamb where if you deal fatal damage to it in phase 1, it will
  // trigger the PostEntityKill callback
  // However, in this situation, The Lamb will not actually die,
  // and will instead proceed to transition to phase 2 anyway
  // To work around this, wait a frame before checking to see if all of the Lamb entities in the
  // room are dead
  // (it is difficult to distinguish between this special case and throwing a Chaos Card)
  runNextGameFrame(() => {
    if (!isAllLambEntitiesDead()) {
      return;
    }

    if (v.room.pseudoClearedRoom) {
      return;
    }
    v.room.pseudoClearedRoom = true;

    spawnRoomClearDelayEffect();
    emulateRoomClear();
  });
}

function inUnclearedLambBossRoom() {
  const roomType = g.r.GetType();
  const roomClear = g.r.IsClear();

  return (
    onDarkRoom() &&
    roomType === RoomType.ROOM_BOSS &&
    !inMegaSatanRoom() &&
    !roomClear
  );
}

function isAllLambEntitiesDead() {
  const lambs = getNPCs(EntityType.ENTITY_THE_LAMB);
  for (const lamb of lambs) {
    if (lamb.HasEntityFlags(EntityFlag.FLAG_FRIENDLY)) {
      continue;
    }

    if (lamb.Variant === LambVariant.BODY && lamb.IsInvincible()) {
      continue;
    }

    if (!lamb.IsDead()) {
      return false;
    }
  }

  return true;
}

function spawnRoomClearDelayEffect() {
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
}

function emulateRoomClear() {
  // Emulate the room being cleared
  g.r.SetClear(true);
  addRoomClearCharges();
  openAllDoors();
  sfxManager.Play(SoundEffect.SOUND_DOOR_HEAVY_OPEN);

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
