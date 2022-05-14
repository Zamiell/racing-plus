// These are shared functions for fast-travel entities

import {
  CrawlSpaceVariant,
  EntityPartition,
  GameStateFlag,
  GridRoom,
  RoomType,
  TrapdoorVariant,
} from "isaac-typescript-definitions";
import {
  ensureAllCases,
  getPlayers,
  getRoomGridIndex,
  isChildPlayer,
  isPonyActive,
  log,
  onRepentanceStage,
} from "isaacscript-common";
import { FastTravelEntityState } from "../../../../enums/FastTravelEntityState";
import { FastTravelEntityType } from "../../../../enums/FastTravelEntityType";
import { FastTravelState } from "../../../../enums/FastTravelState";
import { RaceGoal } from "../../../../enums/RaceGoal";
import { RacerStatus } from "../../../../enums/RacerStatus";
import { RaceStatus } from "../../../../enums/RaceStatus";
import g from "../../../../globals";
import {
  ANIMATIONS_THAT_PREVENT_FAST_TRAVEL,
  TRAPDOOR_TOUCH_DISTANCE,
} from "./constants";
import * as state from "./state";
import v from "./v";

export function init(
  entity: GridEntity | EntityEffect,
  fastTravelEntityType: FastTravelEntityType,
  // This must be passed a function instead of a boolean because we need to initialize the
  // description before checking whether or not it should open.
  shouldSpawnOpen: (entity: GridEntity | EntityEffect) => boolean,
): void {
  const gameFrameCount = g.g.GetFrameCount();

  const sprite = entity.GetSprite();
  const fileName = sprite.GetFilename();
  const customFileName = getCustomSpriteFilename(entity, fastTravelEntityType);
  if (fileName === customFileName) {
    return;
  }

  log(
    `Initializing a ${FastTravelEntityType[fastTravelEntityType]} fast-travel entity on game frame: ${gameFrameCount}`,
  );

  sprite.Load(customFileName, true);
  state.initDescription(entity, fastTravelEntityType);

  if (shouldSpawnOpen(entity)) {
    state.open(entity, fastTravelEntityType, true);
  } else {
    state.close(entity, fastTravelEntityType);
  }
}

function getCustomSpriteFilename(
  entity: GridEntity | EntityEffect,
  fastTravelEntityType: FastTravelEntityType,
) {
  const isGreedMode = g.g.IsGreedMode();
  const mausoleumHeartKilled = g.g.GetStateFlag(
    GameStateFlag.MAUSOLEUM_HEART_KILLED,
  );
  const stage = g.l.GetStage();
  const roomGridIndex = getRoomGridIndex();
  const roomType = g.r.GetType();
  const repentanceStage = onRepentanceStage();

  switch (fastTravelEntityType) {
    case FastTravelEntityType.TRAPDOOR: {
      const gridEntity = entity as GridEntity;
      const variant = gridEntity.GetVariant();

      if (variant === TrapdoorVariant.VOID_PORTAL) {
        return "gfx/grid/voidtrapdoor_custom.anm2";
      }

      // -8
      if (roomGridIndex === GridRoom.BLUE_WOMB) {
        return "gfx/grid/door_11_wombhole_blue_custom.anm2";
      }

      // -10
      if (roomGridIndex === GridRoom.SECRET_EXIT) {
        if (!repentanceStage && (stage === 1 || stage === 2)) {
          return "gfx/grid/trapdoor_downpour_custom.anm2";
        }

        if (
          (!repentanceStage && (stage === 3 || stage === 4)) ||
          (repentanceStage && stage === 2)
        ) {
          return "gfx/grid/trapdoor_mines_custom.anm2";
        }

        if (
          (!repentanceStage && (stage === 5 || stage === 6)) ||
          (repentanceStage && stage === 4)
        ) {
          return "gfx/grid/trapdoor_mausoleum_custom.anm2";
        }
      }

      if (roomType === RoomType.BOSS) {
        if (
          g.race.status === RaceStatus.IN_PROGRESS &&
          g.race.myStatus === RacerStatus.RACING &&
          g.race.goal === RaceGoal.THE_BEAST &&
          !repentanceStage &&
          stage === 6 &&
          roomType === RoomType.BOSS
        ) {
          return "gfx/grid/trapdoor_mausoleum_custom.anm2";
        }
      }

      if (
        (repentanceStage && stage === 6 && mausoleumHeartKilled) ||
        (repentanceStage && stage === 7)
      ) {
        return "gfx/grid/door_11_corpsehole_custom.anm2";
      }

      if (
        (isGreedMode && stage === 3) ||
        (!isGreedMode && (stage === 6 || stage === 7))
      ) {
        return "gfx/grid/door_11_wombhole_custom.anm2";
      }

      return "gfx/grid/door_11_trapdoor_custom.anm2";
    }

    case FastTravelEntityType.CRAWLSPACE: {
      const gridEntity = entity as GridEntity;
      const variant = gridEntity.GetVariant();

      if (variant === CrawlSpaceVariant.SECRET_SHOP) {
        return "gfx/grid/door_20_secrettrapdoor_shop_custom.anm2";
      }

      return "gfx/grid/door_20_secrettrapdoor_custom.anm2";
    }

    case FastTravelEntityType.HEAVEN_DOOR: {
      return "gfx/1000.039_heaven door custom.anm2";
    }

    default: {
      return ensureAllCases(fastTravelEntityType);
    }
  }
}

export function checkShouldOpen(
  entity: GridEntity | EntityEffect,
  fastTravelEntityType: FastTravelEntityType,
): void {
  const entityState = state.get(entity, fastTravelEntityType);
  if (
    entityState === FastTravelEntityState.CLOSED &&
    state.shouldOpen(entity, fastTravelEntityType) &&
    // TODO: Remove this after the next vanilla patch in 2022 when Crawlspaces are decoupled from
    // sprites.
    !anyPlayerUsingPony()
  ) {
    state.open(entity, fastTravelEntityType);
  }
}

// TODO: Remove this after the next vanilla patch in 2022 when Crawlspaces are decoupled from
// sprites.
export function anyPlayerUsingPony(): boolean {
  const players = getPlayers();
  return players.some((player) => isPonyActive(player));
}

export function checkPlayerTouched(
  entity: GridEntity | EntityEffect,
  fastTravelEntityType: FastTravelEntityType,
  touchedFunction: (
    effect: GridEntity | EntityEffect,
    player: EntityPlayer,
  ) => void,
): void {
  if (v.run.state !== FastTravelState.DISABLED) {
    return;
  }

  const entityState = state.get(entity, fastTravelEntityType);
  if (entityState === FastTravelEntityState.CLOSED) {
    return;
  }

  const playersTouching = Isaac.FindInRadius(
    entity.Position,
    TRAPDOOR_TOUCH_DISTANCE,
    EntityPartition.PLAYER,
  );
  for (const playerEntity of playersTouching) {
    const player = playerEntity.ToPlayer();
    if (player === undefined) {
      continue;
    }

    if (
      // We don't want a Pony dash to transition to a new floor or a crawl space.
      !isPonyActive(player) &&
      !isChildPlayer(player) &&
      canInteractWith(player)
    ) {
      touchedFunction(entity, player);
      return; // Prevent two players from touching the same entity.
    }
  }
}

function canInteractWith(player: EntityPlayer) {
  // Players cannot interact with fast travel entities while playing certain animations.
  const sprite = player.GetSprite();
  const animation = sprite.GetAnimation();
  return (
    !player.IsHoldingItem() &&
    !ANIMATIONS_THAT_PREVENT_FAST_TRAVEL.has(animation)
  );
}
