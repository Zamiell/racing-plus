import {
  BossID,
  EffectVariant,
  HeavenLightDoorSubType,
  LevelStage,
  RoomType,
} from "isaac-typescript-definitions";
import { game, getEffects, inBossRoomOf } from "isaacscript-common";
import { FastTravelEntityState } from "../../../../enums/FastTravelEntityState";
import { FastTravelEntityType } from "../../../../enums/FastTravelEntityType";
import { RaceGoal } from "../../../../enums/RaceGoal";
import { RacerStatus } from "../../../../enums/RacerStatus";
import { RaceStatus } from "../../../../enums/RaceStatus";
import { g } from "../../../../globals";
import * as fastTravel from "./fastTravel";
import { setFadingToBlack } from "./setNewState";
import * as state from "./state";

const FAST_TRAVEL_ENTITY_TYPE = FastTravelEntityType.HEAVEN_DOOR;

// ModCallback.POST_EFFECT_UPDATE (55)
export function postEffectUpdate(effect: EntityEffect): void {
  // In some situations, heaven doors should be removed entirely.
  if (shouldRemove(effect)) {
    effect.Remove();
    return;
  }

  // Beams of light start at state 0 and get incremented by 1 on every frame. Players can only get
  // taken up by heaven doors if the state is at a high enough value. Thus, we can disable the
  // vanilla functionality by setting the state to 0 on every frame.
  effect.State = 0;

  // We can't initialize the entity in the PostEffectInit callback because that fires before the
  // `POST_NEW_ROOM` callback.
  fastTravel.init(effect, FAST_TRAVEL_ENTITY_TYPE, shouldSpawnOpen);
  fastTravel.checkPlayerTouched(effect, FAST_TRAVEL_ENTITY_TYPE, touched);
}

function shouldRemove(effect: EntityEffect) {
  if (effect.FrameCount > 1) {
    return false;
  }

  const level = game.GetLevel();
  const stage = level.GetStage();

  // - If the goal of the race is Hush, delete the heaven door that spawns after It Lives!
  // - If the goal of the race is Hush, delete the heaven door that spawns after Hush.
  if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.goal === RaceGoal.HUSH &&
    (stage === LevelStage.WOMB_2 || stage === LevelStage.BLUE_WOMB)
  ) {
    return true;
  }

  return false;
}

function shouldSpawnOpen() {
  const level = game.GetLevel();
  const stage = level.GetStage();
  const room = game.GetRoom();
  const roomType = room.GetType();
  const roomClear = room.IsClear();

  // In almost all cases, beams of light are spawned after defeating a boss. This means that the
  // room will be clear and they should spawn in an open state. Rarely, players can also encounter
  // beams of light in an I AM ERROR room with enemies. If this is the case, spawn the heaven door
  // in a closed state so that the player must defeat all of the enemies in the room before going
  // up. However, the room will not be clear yet if this is a manually spawned heaven door after
  // killing It Lives or Hush, so account for that first.
  if (
    (stage === LevelStage.WOMB_2 || stage === LevelStage.BLUE_WOMB) &&
    roomType === RoomType.BOSS
  ) {
    return true;
  }

  return roomClear;
}

function touched(entity: GridEntity | EntityEffect, player: EntityPlayer) {
  const effect = entity as EntityEffect;

  // Perform some extra checks before we consider the player to have activated the heaven door.
  const entityDescription = state.getDescription(
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

  setFadingToBlack(player, entity.Position, true);
}

// ModCallbackCustom.POST_ROOM_CLEAR
export function postRoomClear(): void {
  openClosedHeavenDoors();
}

function openClosedHeavenDoors() {
  const heavenDoors = getEffects(
    EffectVariant.HEAVEN_LIGHT_DOOR,
    HeavenLightDoorSubType.HEAVEN_DOOR,
  );
  for (const heavenDoor of heavenDoors) {
    const entityState = state.get(heavenDoor, FAST_TRAVEL_ENTITY_TYPE);
    if (entityState === FastTravelEntityState.CLOSED) {
      state.open(heavenDoor, FAST_TRAVEL_ENTITY_TYPE);
    }
  }
}
