import g from "../../../../globals";
import { anyPlayerCloserThan, ensureAllCases } from "../../../../misc";
import {
  FastTravelEntityDescription,
  TRAPDOOR_BOSS_REACTION_FRAMES,
  TRAPDOOR_OPEN_DISTANCE,
  TRAPDOOR_OPEN_DISTANCE_AFTER_BOSS,
} from "./constants";
import { FastTravelEntityState, FastTravelEntityType } from "./enums";

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
      g.run.room.fastTravel.trapdoors.set(index, description);
      break;
    }

    case FastTravelEntityType.Crawlspace: {
      g.run.room.fastTravel.crawlspaces.set(index, description);
      break;
    }

    case FastTravelEntityType.HeavenDoor: {
      g.run.room.fastTravel.heavenDoors.set(index, description);
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
      description = g.run.room.fastTravel.trapdoors.get(index);
      break;
    }

    case FastTravelEntityType.Crawlspace: {
      description = g.run.room.fastTravel.crawlspaces.get(index);
      break;
    }

    case FastTravelEntityType.HeavenDoor: {
      description = g.run.room.fastTravel.heavenDoors.get(index);
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
  // In order to prevent a player from accidentally entering a freshly-spawned trapdoor after
  // killing the boss of the floor, we use a wider open distance for X frames
  if (
    g.r.GetType() !== RoomType.ROOM_BOSS ||
    g.run.room.clearFrame === -1 ||
    g.g.GetFrameCount() >= g.run.room.clearFrame + TRAPDOOR_BOSS_REACTION_FRAMES
  ) {
    return false;
  }

  return anyPlayerCloserThan(position, TRAPDOOR_OPEN_DISTANCE_AFTER_BOSS);
}
