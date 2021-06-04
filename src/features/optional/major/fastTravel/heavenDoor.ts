import g from "../../../../globals";
import { FastTravelEntityState, FastTravelEntityType } from "./enums";
import * as fastTravel from "./fastTravel";
import { setFadingToBlack } from "./setNewState";
import * as state from "./state";

const FAST_TRAVEL_ENTITY_TYPE = FastTravelEntityType.HeavenDoor;

// ModCallbacks.MC_POST_EFFECT_UPDATE (55)
export function postEffectUpdate(effect: EntityEffect): void {
  // Beams of light start at state 0 and get incremented by 1 on every frame
  // Players can only get taken up by heaven doors if the state is at a high enough value
  // Thus, we can disable the vanilla functionality by setting the state to 0 on every frame
  effect.State = 0;

  // We can't initialize the entity in the PostEffectInit callback because that fires before the
  // PostNewRoom callback
  fastTravel.init(effect, FAST_TRAVEL_ENTITY_TYPE, shouldSpawnOpen);
  fastTravel.checkPlayerTouched(effect, FAST_TRAVEL_ENTITY_TYPE, touched);
}

function shouldSpawnOpen() {
  // In almost all cases, beams of light are spawned after defeating a boss
  // This means that the room will be clear and they should spawn in an open state
  // Rarely, players can also encounter beams of light in an I AM ERROR room with enemies
  // If this is the case, spawn the heaven door in a closed state so that the player must defeat
  // all of the enemies in the room before going up
  return g.r.IsClear();
}

function touched(entity: GridEntity | EntityEffect, player: EntityPlayer) {
  // Perform some extra checks before we consider the player to have activated the heaven door
  const entityDescription = state.getDescription(
    entity,
    FAST_TRAVEL_ENTITY_TYPE,
  );
  const effect = entity as EntityEffect;

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
    if (effect !== null) {
      const entityState = state.get(effect, FAST_TRAVEL_ENTITY_TYPE);
      if (entityState === FastTravelEntityState.Closed) {
        state.open(effect, FAST_TRAVEL_ENTITY_TYPE);
      }
    }
  }
}
