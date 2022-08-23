import {
  EntityFlag,
  EntityType,
  LambVariant,
  PickupVariant,
  RoomType,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  addRoomClearCharges,
  asNumber,
  getNPCs,
  isRoomInsideGrid,
  log,
  onDarkRoom,
  openAllDoors,
  runNextGameFrame,
  saveDataManager,
  sfxManager,
  spawnEffect,
  spawnPickup,
  VectorZero,
} from "isaacscript-common";
import { EffectVariantCustom } from "../../../enums/EffectVariantCustom";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";

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

// ModCallback.POST_ENTITY_KILL (68)
// EntityType.THE_LAMB (273)
export function postEntityKillLamb(entity: Entity): void {
  if (!config.preventVictoryLapPopup) {
    return;
  }

  if (entity.HasEntityFlags(EntityFlag.FRIENDLY)) {
    return;
  }

  if (!inUnclearedLambBossRoom()) {
    return;
  }

  // There is an edge-case with The Lamb where if you deal fatal damage to it in phase 1, it will
  // trigger the PostEntityKill callback. However, in this situation, The Lamb will not actually
  // die, and will instead proceed to transition to phase 2 anyway. To work around this, wait a
  // frame before checking to see if all of the Lamb entities in the room are dead. (It is difficult
  // to distinguish between this special case and throwing a Chaos Card.)
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
    roomType === RoomType.BOSS &&
    isRoomInsideGrid() &&
    !roomClear
  );
}

function isAllLambEntitiesDead() {
  const lambs = getNPCs(EntityType.THE_LAMB);
  for (const lamb of lambs) {
    if (lamb.HasEntityFlags(EntityFlag.FRIENDLY)) {
      continue;
    }

    if (lamb.Variant === asNumber(LambVariant.BODY) && lamb.IsInvincible()) {
      continue;
    }

    if (!lamb.IsDead()) {
      return false;
    }
  }

  return true;
}

function spawnRoomClearDelayEffect() {
  const effect = spawnEffect(
    EffectVariantCustom.ROOM_CLEAR_DELAY,
    0,
    VectorZero,
  );
  effect.ClearEntityFlags(EntityFlag.APPEAR);
  log('Spawned the "Room Clear Delay Effect" custom entity (for The Lamb).');
  // - This will not work to delay the room clearing if "debug 10" is turned on.
  // - This will not die if the player uses Blood Rights or Plan C, since it is an effect.
}

function emulateRoomClear() {
  // Emulate the room being cleared.
  g.r.SetClear(true);
  addRoomClearCharges();
  openAllDoors();
  sfxManager.Play(SoundEffect.DOOR_HEAVY_OPEN);

  // Spawn a big chest (which will get replaced with a trophy if we happen to be in a race).
  const position = g.r.GetCenterPos();
  spawnPickup(PickupVariant.BIG_CHEST, 0, position);
}
