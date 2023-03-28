import {
  BossID,
  Direction,
  EffectVariant,
  HeavenLightDoorSubType,
  LevelStage,
  RoomType,
} from "isaac-typescript-definitions";
import {
  game,
  getEffects,
  inBossRoomOf,
  inRoomType,
  onStage,
} from "isaacscript-common";
import { FastTravelEntityState } from "../../../../../enums/FastTravelEntityState";
import { FastTravelEntityType } from "../../../../../enums/FastTravelEntityType";
import { inRaceToHush } from "../../../../../features/race/v";
import {
  checkPlayerTouchedFastTravelEntity,
  initFastTravelEntity,
} from "./fastTravelEntity";
import { setFastTravelFadingToBlack } from "./setNewState";
import {
  fastTravelEntityOpen,
  getFastTravelEntityDescription,
  getFastTravelEntityState,
} from "./state";

const FAST_TRAVEL_ENTITY_TYPE = FastTravelEntityType.HEAVEN_DOOR;

// ModCallback.PRE_SPAWN_CLEAR_AWARD (70)
export function heavenDoorPreSpawnClearAward(): void {
  openClosedHeavenDoors();
}

function openClosedHeavenDoors() {
  const heavenDoors = getEffects(
    EffectVariant.HEAVEN_LIGHT_DOOR,
    HeavenLightDoorSubType.HEAVEN_DOOR,
  );
  for (const heavenDoor of heavenDoors) {
    const entityState = getFastTravelEntityState(
      heavenDoor,
      FAST_TRAVEL_ENTITY_TYPE,
    );
    if (entityState === FastTravelEntityState.CLOSED) {
      fastTravelEntityOpen(heavenDoor, FAST_TRAVEL_ENTITY_TYPE);
    }
  }
}

// ModCallbackCustom.POST_EFFECT_INIT_FILTER
// EffectVariant.HEAVEN_LIGHT_DOOR
// HeavenLightDoorSubType.HEAVEN_DOOR
export function heavenDoorPostEffectInitHeavenDoor(effect: EntityEffect): void {
  // In some situations, heaven doors should be removed entirely.
  if (shouldRemove(effect)) {
    effect.Remove();
  }
}

function shouldRemove(effect: EntityEffect) {
  const room = game.GetRoom();
  const roomFrameCount = room.GetFrameCount();

  // Delete all vanilla heaven doors that are spawned midway through the room. (We explicitly spawn
  // all custom heaven doors using the player as the spawner.)
  if (effect.SpawnerEntity === undefined && roomFrameCount > 0) {
    return true;
  }

  // If the goal of the race is Hush, delete the heaven door that spawns after It Lives or Hush.
  if (inRaceToHush() && onStage(LevelStage.WOMB_2, LevelStage.BLUE_WOMB)) {
    return true;
  }

  return false;
}

// ModCallbackCustom.POST_EFFECT_UPDATE_FILTER
// EffectVariant.HEAVEN_LIGHT_DOOR
// HeavenLightDoorSubType.HEAVEN_DOOR
export function heavenDoorPostEffectUpdateHeavenDoor(
  effect: EntityEffect,
): void {
  // Beams of light start at state 0 and get incremented by 1 on every frame. Players can only get
  // taken up by heaven doors if the state is at a high enough value. Thus, we can disable the
  // vanilla functionality by setting the state to 0 on every frame.
  effect.State = 0;

  // We can't initialize the entity in the `POST_EFFECT_INIT` callback because that fires before the
  // `POST_NEW_ROOM` callback.
  initFastTravelEntity(effect, FAST_TRAVEL_ENTITY_TYPE, shouldSpawnOpen);
  checkPlayerTouchedFastTravelEntity(effect, FAST_TRAVEL_ENTITY_TYPE, touched);
}

function shouldSpawnOpen() {
  // In almost all cases, beams of light are spawned after defeating a boss. This means that the
  // room will be clear and they should spawn in an open state. Rarely, players can also encounter
  // beams of light in an I AM ERROR room with enemies. If this is the case, spawn the heaven door
  // in a closed state so that the player must defeat all of the enemies in the room before going
  // up. However, the room will not be clear yet if this is a manually spawned heaven door after
  // killing It Lives or Hush, so account for that first.
  if (
    onStage(LevelStage.WOMB_2, LevelStage.BLUE_WOMB) &&
    inRoomType(RoomType.BOSS)
  ) {
    return true;
  }

  const room = game.GetRoom();
  const roomClear = room.IsClear();

  return roomClear;
}

function touched(entity: GridEntity | EntityEffect, player: EntityPlayer) {
  const effect = entity as EntityEffect;

  // Perform some extra checks before we consider the player to have activated the heaven door.
  const entityDescription = getFastTravelEntityDescription(
    entity,
    FAST_TRAVEL_ENTITY_TYPE,
  );
  if (entityDescription === undefined) {
    return;
  }

  // We want the player to be forced to dodge the final wave of tears from It Lives!
  if (
    inBossRoomOf(BossID.IT_LIVES) &&
    !entityDescription.initial &&
    effect.FrameCount < 40
  ) {
    return;
  }

  setFastTravelFadingToBlack(player, entity.Position, Direction.UP);
}
