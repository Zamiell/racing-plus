import { anyPlayerCloserThan, ensureAllCases, log } from "isaacscript-common";
import g from "../../../../globals";
import {
  DEBUG,
  FastTravelEntityDescription,
  TRAPDOOR_BOSS_REACTION_FRAMES,
  TRAPDOOR_OPEN_DISTANCE,
  TRAPDOOR_OPEN_DISTANCE_AFTER_BOSS,
} from "./constants";
import { FastTravelEntityState, FastTravelEntityType } from "./enums";
import v from "./v";

export function open(
  entity: GridEntity | EntityEffect,
  fastTravelEntityType: FastTravelEntityType,
  initial = false,
): void {
  setOpenClose(true, entity, fastTravelEntityType, initial);
}

export function close(
  entity: GridEntity | EntityEffect,
  fastTravelEntityType: FastTravelEntityType,
): void {
  setOpenClose(false, entity, fastTravelEntityType);
}

function setOpenClose(
  isOpen: boolean,
  entity: GridEntity | EntityEffect,
  fastTravelEntityType: FastTravelEntityType,
  initial = false,
) {
  const state = isOpen
    ? FastTravelEntityState.OPEN
    : FastTravelEntityState.CLOSED;
  set(entity, fastTravelEntityType, state);

  const sprite = entity.GetSprite();
  let animationPrefix = isOpen ? "Opened" : "Closed";
  if (
    !initial &&
    animationPrefix === "Opened" &&
    fastTravelEntityType !== FastTravelEntityType.HEAVEN_DOOR
  ) {
    animationPrefix = "Open Animation";
  }
  const animation = `${animationPrefix} Custom`;
  sprite.Play(animation, true);

  if (DEBUG) {
    log(
      `${animationPrefix} a fast travel entity: ${FastTravelEntityType[fastTravelEntityType]}`,
    );
  }
}

export function get(
  entity: GridEntity | EntityEffect,
  fastTravelEntityType: FastTravelEntityType,
): FastTravelEntityState | undefined {
  const entityDescription = getDescription(entity, fastTravelEntityType);
  if (entityDescription === undefined) {
    return undefined;
  }

  return entityDescription.state;
}

function set(
  entity: GridEntity | EntityEffect,
  fastTravelEntityType: FastTravelEntityType,
  state: FastTravelEntityState,
) {
  const entityDescription = getDescription(entity, fastTravelEntityType);
  if (entityDescription === undefined) {
    error(`Failed to set a new fast-travel entity state: ${state}`);
  }

  entityDescription.state = state;
}

function getFastTravelMap(fastTravelEntityType: FastTravelEntityType) {
  switch (fastTravelEntityType) {
    case FastTravelEntityType.TRAPDOOR: {
      return v.room.trapdoors;
    }

    case FastTravelEntityType.CRAWLSPACE: {
      return v.room.crawlspaces;
    }

    case FastTravelEntityType.HEAVEN_DOOR: {
      return v.room.heavenDoors;
    }

    default: {
      return ensureAllCases(fastTravelEntityType);
    }
  }
}

export function initDescription(
  entity: GridEntity | EntityEffect,
  fastTravelEntityType: FastTravelEntityType,
): void {
  const roomFrameCount = g.r.GetFrameCount();
  const fastTravelMap = getFastTravelMap(fastTravelEntityType);
  const index = getIndex(entity, fastTravelEntityType);
  const description = {
    initial: roomFrameCount === 0,
    state: FastTravelEntityState.OPEN,
  };
  fastTravelMap.set(index, description);
}

export function getDescription(
  entity: GridEntity | EntityEffect,
  fastTravelEntityType: FastTravelEntityType,
): FastTravelEntityDescription | undefined {
  const fastTravelMap = getFastTravelMap(fastTravelEntityType);
  const index = getIndex(entity, fastTravelEntityType);

  return fastTravelMap.get(index);
}

export function deleteDescription(
  index: int,
  fastTravelEntityType: FastTravelEntityType,
): void {
  const fastTravelMap = getFastTravelMap(fastTravelEntityType);
  fastTravelMap.delete(index);
}

function getIndex(
  entity: GridEntity | EntityEffect,
  fastTravelEntityType: FastTravelEntityType,
) {
  switch (fastTravelEntityType) {
    case FastTravelEntityType.TRAPDOOR: {
      const gridEntity = entity as GridEntity;
      return gridEntity.GetGridIndex();
    }

    case FastTravelEntityType.CRAWLSPACE: {
      const gridEntity = entity as GridEntity;
      return gridEntity.GetGridIndex();
    }

    case FastTravelEntityType.HEAVEN_DOOR: {
      // "effect.Index" is not yet initialized in the PostEffectInit callback
      // Use the grid index as the index for conformity with the other fast-travel entities
      return g.r.GetGridIndex(entity.Position);
    }

    default: {
      return ensureAllCases(fastTravelEntityType);
    }
  }
}

export function shouldOpen(
  entity: GridEntity | EntityEffect,
  fastTravelEntityType: FastTravelEntityType,
): boolean {
  const entityDescription = getDescription(entity, fastTravelEntityType);
  if (entityDescription === undefined) {
    return false;
  }

  return (
    !anyPlayerCloserThan(entity.Position, TRAPDOOR_OPEN_DISTANCE) &&
    !playerCloseAfterBoss(entity.Position) &&
    !shouldBeClosedFromStartingInRoomWithEnemies(entityDescription.initial)
  );
}

function shouldBeClosedFromStartingInRoomWithEnemies(initial: boolean) {
  return initial && !g.r.IsClear();
}

function playerCloseAfterBoss(position: Vector) {
  const gameFrameCount = g.g.GetFrameCount();
  const roomType = g.r.GetType();

  // In order to prevent a player from accidentally entering a freshly-spawned trapdoor after
  // killing the boss of the floor, we use a wider open distance for X frames
  if (
    roomType !== RoomType.ROOM_BOSS ||
    v.room.clearFrame === null ||
    gameFrameCount >= v.room.clearFrame + TRAPDOOR_BOSS_REACTION_FRAMES
  ) {
    return false;
  }

  return anyPlayerCloserThan(position, TRAPDOOR_OPEN_DISTANCE_AFTER_BOSS);
}
