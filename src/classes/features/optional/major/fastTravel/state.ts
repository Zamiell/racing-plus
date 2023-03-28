import { RoomType } from "isaac-typescript-definitions";
import { anyPlayerCloserThan, game, inRoomType, log } from "isaacscript-common";
import { FastTravelEntityState } from "../../../../../enums/FastTravelEntityState";
import { FastTravelEntityType } from "../../../../../enums/FastTravelEntityType";
import { FastTravelEntityDescription } from "../../../../../interfaces/FastTravelEntityDescription";
import { mod } from "../../../../../mod";
import {
  FAST_TRAVEL_DEBUG,
  TRAPDOOR_AND_CRAWL_SPACE_OPEN_DISTANCE,
  TRAPDOOR_BOSS_REACTION_FRAMES,
  TRAPDOOR_OPEN_DISTANCE_AFTER_BOSS,
} from "./constants";
import { v } from "./v";

export function fastTravelEntityOpen(
  entity: GridEntity | EntityEffect,
  fastTravelEntityType: FastTravelEntityType,
  initial = false,
): void {
  setOpenClose(true, entity, fastTravelEntityType, initial);
}

export function fastTravelEntityClose(
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
  setFastTravelEntityState(entity, fastTravelEntityType, state);

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
  Isaac.DebugString(`GETTING HERE - animation: ${animation}`);

  if (FAST_TRAVEL_DEBUG) {
    log(
      `${animationPrefix} a fast travel entity: ${FastTravelEntityType[fastTravelEntityType]} (${fastTravelEntityType})`,
    );
  }
}

export function getFastTravelEntityState(
  entity: GridEntity | EntityEffect,
  fastTravelEntityType: FastTravelEntityType,
): FastTravelEntityState | undefined {
  const entityDescription = getFastTravelEntityDescription(
    entity,
    fastTravelEntityType,
  );
  if (entityDescription === undefined) {
    return undefined;
  }

  return entityDescription.state;
}

function setFastTravelEntityState(
  entity: GridEntity | EntityEffect,
  fastTravelEntityType: FastTravelEntityType,
  state: FastTravelEntityState,
) {
  const entityDescription = getFastTravelEntityDescription(
    entity,
    fastTravelEntityType,
  );
  if (entityDescription === undefined) {
    error(
      `Failed to set a new fast-travel entity state for a ${FastTravelEntityType[fastTravelEntityType]}: ${FastTravelEntityState[state]} (${state})`,
    );
  }

  entityDescription.state = state;
}

function getFastTravelMap(
  fastTravelEntityType: FastTravelEntityType,
): Map<number, FastTravelEntityDescription> {
  switch (fastTravelEntityType) {
    case FastTravelEntityType.TRAPDOOR: {
      return v.room.trapdoors;
    }

    case FastTravelEntityType.CRAWLSPACE: {
      return v.room.crawlSpaces;
    }

    case FastTravelEntityType.HEAVEN_DOOR: {
      return v.room.heavenDoors;
    }
  }
}

export function initFastTravelEntityDescription(
  entity: GridEntity | EntityEffect,
  fastTravelEntityType: FastTravelEntityType,
): void {
  const room = game.GetRoom();
  const roomFrameCount = room.GetFrameCount();
  const fastTravelMap = getFastTravelMap(fastTravelEntityType);
  const index = getIndex(entity, fastTravelEntityType);
  const description = {
    initial: roomFrameCount === 0,
    state: FastTravelEntityState.OPEN,
  };
  fastTravelMap.set(index, description);
}

export function getFastTravelEntityDescription(
  entity: GridEntity | EntityEffect,
  fastTravelEntityType: FastTravelEntityType,
): FastTravelEntityDescription | undefined {
  const fastTravelMap = getFastTravelMap(fastTravelEntityType);
  const index = getIndex(entity, fastTravelEntityType);

  return fastTravelMap.get(index);
}

export function deleteFastTravelEntityDescription(
  index: int,
  fastTravelEntityType: FastTravelEntityType,
): void {
  const fastTravelMap = getFastTravelMap(fastTravelEntityType);
  fastTravelMap.delete(index);
}

function getIndex(
  entity: GridEntity | EntityEffect,
  fastTravelEntityType: FastTravelEntityType,
): number {
  const room = game.GetRoom();

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
      // "effect.Index" is not yet initialized in the `POST_EFFECT_INIT` callback. Use the grid
      // index as the index for conformity with the other fast-travel entities.
      return room.GetGridIndex(entity.Position);
    }
  }
}

export function shouldOpenFastTravelEntity(
  entity: GridEntity | EntityEffect,
  fastTravelEntityType: FastTravelEntityType,
): boolean {
  const entityDescription = getFastTravelEntityDescription(
    entity,
    fastTravelEntityType,
  );
  if (entityDescription === undefined) {
    return false;
  }

  return (
    !anyPlayerCloserThan(
      entity.Position,
      TRAPDOOR_AND_CRAWL_SPACE_OPEN_DISTANCE,
    ) &&
    !playerCloseAfterBoss(entity.Position) &&
    !shouldBeClosedFromStartingInRoomWithEnemies(entityDescription.initial) &&
    // TODO: Remove this after the next vanilla patch in 2022 when crawl spaces are decoupled from
    // sprites.
    !mod.anyPlayerUsingPony()
  );
}

function shouldBeClosedFromStartingInRoomWithEnemies(initial: boolean) {
  const room = game.GetRoom();
  return initial && !room.IsClear();
}

function playerCloseAfterBoss(position: Vector) {
  const gameFrameCount = game.GetFrameCount();

  // In order to prevent a player from accidentally entering a freshly-spawned trapdoor after
  // killing the boss of the floor, we use a wider open distance for X frames.
  if (
    !inRoomType(RoomType.BOSS) ||
    v.room.clearFrame === null ||
    gameFrameCount >= v.room.clearFrame + TRAPDOOR_BOSS_REACTION_FRAMES
  ) {
    return false;
  }

  return anyPlayerCloserThan(position, TRAPDOOR_OPEN_DISTANCE_AFTER_BOSS);
}
