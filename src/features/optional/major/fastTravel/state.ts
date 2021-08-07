import { anyPlayerCloserThan, ensureAllCases } from "isaacscript-common";
import g from "../../../../globals";
import {
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
    ? FastTravelEntityState.Open
    : FastTravelEntityState.Closed;
  set(entity, fastTravelEntityType, state);
  const sprite = entity.GetSprite();
  let animationPrefix = isOpen ? "Opened" : "Closed";
  if (
    !initial &&
    animationPrefix === "Opened" &&
    fastTravelEntityType !== FastTravelEntityType.HeavenDoor
  ) {
    animationPrefix = "Open Animation";
  }
  const animation = `${animationPrefix} Custom`;
  sprite.Play(animation, true);
}

export function get(
  entity: GridEntity | EntityEffect,
  fastTravelEntityType: FastTravelEntityType,
): FastTravelEntityState | null {
  const entityDescription = getDescription(entity, fastTravelEntityType);
  if (entityDescription === null) {
    return null;
  }

  return entityDescription.state;
}

function set(
  entity: GridEntity | EntityEffect,
  fastTravelEntityType: FastTravelEntityType,
  state: FastTravelEntityState,
): void {
  const entityDescription = getDescription(entity, fastTravelEntityType);
  if (entityDescription === null) {
    error(`Failed to set a new fast-travel entity state: ${state}`);
  }

  entityDescription.state = state;
}

export function initDescription(
  entity: GridEntity | EntityEffect,
  fastTravelEntityType: FastTravelEntityType,
): void {
  const roomFrameCount = g.r.GetFrameCount();
  const index = getIndex(entity, fastTravelEntityType);
  const description = {
    initial: roomFrameCount === 0,
    state: FastTravelEntityState.Open,
  };

  switch (fastTravelEntityType) {
    case FastTravelEntityType.Trapdoor: {
      v.room.trapdoors.set(index, description);
      break;
    }

    case FastTravelEntityType.Crawlspace: {
      v.room.crawlspaces.set(index, description);
      break;
    }

    case FastTravelEntityType.HeavenDoor: {
      v.room.heavenDoors.set(index, description);
      break;
    }

    default: {
      ensureAllCases(fastTravelEntityType);
    }
  }
}

export function getDescription(
  entity: GridEntity | EntityEffect,
  fastTravelEntityType: FastTravelEntityType,
): FastTravelEntityDescription | null {
  const index = getIndex(entity, fastTravelEntityType);

  let description: FastTravelEntityDescription | undefined;
  switch (fastTravelEntityType) {
    case FastTravelEntityType.Trapdoor: {
      description = v.room.trapdoors.get(index);
      break;
    }

    case FastTravelEntityType.Crawlspace: {
      description = v.room.crawlspaces.get(index);
      break;
    }

    case FastTravelEntityType.HeavenDoor: {
      description = v.room.heavenDoors.get(index);
      break;
    }

    default: {
      ensureAllCases(fastTravelEntityType);
    }
  }

  if (description === undefined) {
    return null;
  }

  return description;
}

export function deleteDescription(
  index: int,
  fastTravelEntityType: FastTravelEntityType,
): void {
  switch (fastTravelEntityType) {
    case FastTravelEntityType.Trapdoor: {
      v.room.trapdoors.delete(index);
      break;
    }

    case FastTravelEntityType.Crawlspace: {
      v.room.crawlspaces.delete(index);
      break;
    }

    case FastTravelEntityType.HeavenDoor: {
      v.room.heavenDoors.delete(index);
      break;
    }

    default: {
      ensureAllCases(fastTravelEntityType);
    }
  }
}

function getIndex(
  entity: GridEntity | EntityEffect,
  fastTravelEntityType: FastTravelEntityType,
) {
  switch (fastTravelEntityType) {
    case FastTravelEntityType.Trapdoor: {
      const gridEntity = entity as GridEntity;
      return gridEntity.GetGridIndex();
    }

    case FastTravelEntityType.Crawlspace: {
      const gridEntity = entity as GridEntity;
      return gridEntity.GetGridIndex();
    }

    case FastTravelEntityType.HeavenDoor: {
      // "effect.Index" is not yet initialized in the PostEffectInit callback
      // Use the grid index as the index for conformity with the other fast-travel entities
      return g.r.GetGridIndex(entity.Position);
    }

    default: {
      ensureAllCases(fastTravelEntityType);
      return -1;
    }
  }
}

export function shouldOpen(
  entity: GridEntity | EntityEffect,
  fastTravelEntityType: FastTravelEntityType,
): boolean {
  const entityDescription = getDescription(entity, fastTravelEntityType);
  if (entityDescription === null) {
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
    v.room.clearFrame === -1 ||
    gameFrameCount >= v.room.clearFrame + TRAPDOOR_BOSS_REACTION_FRAMES
  ) {
    return false;
  }

  return anyPlayerCloserThan(position, TRAPDOOR_OPEN_DISTANCE_AFTER_BOSS);
}
