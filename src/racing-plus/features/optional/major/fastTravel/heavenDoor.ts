import g from "../../../../globals";
import RaceGoal from "../../../race/types/RaceGoal";
import RacerStatus from "../../../race/types/RacerStatus";
import RaceStatus from "../../../race/types/RaceStatus";
import { FastTravelEntityState, FastTravelEntityType } from "./enums";
import * as fastTravel from "./fastTravel";
import { setFadingToBlack } from "./setNewState";
import * as state from "./state";
import v from "./v";

const FAST_TRAVEL_ENTITY_TYPE = FastTravelEntityType.HEAVEN_DOOR;
const FRAME_DELAY_AFTER_KILLING_IT_LIVES = 12;
const FRAME_DELAY_AFTER_KILLING_HUSH = 13;

// ModCallbacks.MC_POST_EFFECT_UPDATE (55)
export function postEffectUpdate(effect: EntityEffect): void {
  // In some situations, heaven doors should be removed entirely
  if (shouldRemove(effect)) {
    effect.Remove();
    return;
  }

  // Beams of light start at state 0 and get incremented by 1 on every frame
  // Players can only get taken up by heaven doors if the state is at a high enough value
  // Thus, we can disable the vanilla functionality by setting the state to 0 on every frame
  effect.State = 0;

  // We can't initialize the entity in the PostEffectInit callback because that fires before the
  // PostNewRoom callback
  fastTravel.init(effect, FAST_TRAVEL_ENTITY_TYPE, shouldSpawnOpen);
  fastTravel.checkPlayerTouched(effect, FAST_TRAVEL_ENTITY_TYPE, touched);
}

function shouldRemove(effect: EntityEffect) {
  if (effect.FrameCount > 1) {
    return false;
  }

  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();

  // If the goal of the race is Hush, delete the heaven door that spawns after It Lives!
  // If the goal of the race is Hush, delete the heaven door that spawns after Hush
  if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.goal === RaceGoal.HUSH &&
    (stage === 8 || stage === 9)
  ) {
    return true;
  }

  if (!v.room.deletePaths) {
    return false;
  }

  // If a specific amount of frames have passed since killing It Lives!,
  // then delete the vanilla heaven door (since we manually spawned one already)
  if (v.room.itLivesKilledFrame !== null) {
    const naturalSpawnFrame =
      v.room.itLivesKilledFrame + FRAME_DELAY_AFTER_KILLING_IT_LIVES;
    const naturalSpawnFrameForBible = naturalSpawnFrame + 1;
    if (
      gameFrameCount === naturalSpawnFrame ||
      gameFrameCount === naturalSpawnFrameForBible
    ) {
      return true;
    }
  }

  // If a specific amount of frames have passed since killing Hush,
  // then delete the vanilla heaven door (since we manually spawned one already)
  if (v.room.hushKilledFrame !== null) {
    const naturalSpawnFrame =
      v.room.hushKilledFrame + FRAME_DELAY_AFTER_KILLING_HUSH;
    if (gameFrameCount === naturalSpawnFrame) {
      return true;
    }
  }

  return false;
}

function shouldSpawnOpen() {
  const stage = g.l.GetStage();
  const roomType = g.r.GetType();
  const roomClear = g.r.IsClear();

  // In almost all cases, beams of light are spawned after defeating a boss
  // This means that the room will be clear and they should spawn in an open state
  // Rarely, players can also encounter beams of light in an I AM ERROR room with enemies
  // If this is the case, spawn the heaven door in a closed state so that the player must defeat
  // all of the enemies in the room before going up
  // However, the room will not be clear yet if this is a manually spawned heaven door after killing
  // It Lives! or Hush, so account for that first
  if ((stage === 8 || stage === 9) && roomType === RoomType.ROOM_BOSS) {
    return true;
  }

  return roomClear;
}

function touched(entity: GridEntity | EntityEffect, player: EntityPlayer) {
  const effect = entity as EntityEffect;

  // Perform some extra checks before we consider the player to have activated the heaven door
  const entityDescription = state.getDescription(
    entity,
    FAST_TRAVEL_ENTITY_TYPE,
  );
  if (entityDescription === undefined) {
    return;
  }

  if (!entityDescription.initial && effect.FrameCount < 40) {
    // We want the player to be forced to dodge the final wave of tears from It Lives!
    return;
  }

  setFadingToBlack(entity, player, true);
}

// ModCallbacksCustom.MC_POST_ROOM_CLEAR
export function postRoomClear(): void {
  openClosedHeavenDoors();
}

function openClosedHeavenDoors() {
  const heavenDoors = Isaac.FindByType(
    EntityType.ENTITY_EFFECT,
    EffectVariant.HEAVEN_LIGHT_DOOR,
  );
  for (const entity of heavenDoors) {
    const effect = entity.ToEffect();
    if (effect !== undefined) {
      const entityState = state.get(effect, FAST_TRAVEL_ENTITY_TYPE);
      if (entityState === FastTravelEntityState.CLOSED) {
        state.open(effect, FAST_TRAVEL_ENTITY_TYPE);
      }
    }
  }
}