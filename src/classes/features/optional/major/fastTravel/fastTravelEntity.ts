// These are shared functions for fast-travel entities.

import {
  CrawlSpaceVariant,
  EntityPartition,
  GameStateFlag,
  GridRoom,
  LevelStage,
  TrapdoorVariant,
} from "isaac-typescript-definitions";
import {
  asNumber,
  game,
  getRoomGridIndex,
  isChildPlayer,
  log,
  onRepentanceStage,
  onStage,
} from "isaacscript-common";
import { FastTravelEntityState } from "../../../../../enums/FastTravelEntityState";
import { FastTravelEntityType } from "../../../../../enums/FastTravelEntityType";
import { FastTravelState } from "../../../../../enums/FastTravelState";
import { inRaceToBeast } from "../../../../../features/race/v";
import { mod } from "../../../../../mod";
import { onSeason } from "../../../../../speedrun/utilsSpeedrun";
import { inClearedMomBossRoom } from "../../../../../utils";
import { SEASON_3_INVERTED_TRAPDOOR_GRID_INDEX } from "../../../speedrun/season3/constants";
import {
  ANIMATIONS_THAT_PREVENT_FAST_TRAVEL,
  TRAPDOOR_AND_CRAWL_SPACE_TOUCH_DISTANCE,
} from "./constants";
import {
  fastTravelEntityClose,
  fastTravelEntityOpen,
  getFastTravelEntityState,
  initFastTravelEntityDescription,
  shouldOpenFastTravelEntity,
} from "./state";
import { v } from "./v";

/** One tile away from the top door in a 1x1 room. */
export const NORMAL_TRAPDOOR_GRID_INDEX = 37;

export function initFastTravelEntity(
  entity: GridEntity | EntityEffect,
  fastTravelEntityType: FastTravelEntityType,
  // This must be passed a function instead of a boolean because we need to initialize the
  // description before checking whether it should open.
  shouldSpawnOpen: (entity: GridEntity | EntityEffect) => boolean,
): void {
  const gameFrameCount = game.GetFrameCount();

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
  initFastTravelEntityDescription(entity, fastTravelEntityType);

  if (shouldSpawnOpen(entity)) {
    fastTravelEntityOpen(entity, fastTravelEntityType, true);
  } else {
    fastTravelEntityClose(entity, fastTravelEntityType);
  }
}

function getCustomSpriteFilename(
  entity: GridEntity | EntityEffect,
  fastTravelEntityType: FastTravelEntityType,
): string {
  const isGreedMode = game.IsGreedMode();
  const mausoleumHeartKilled = game.GetStateFlag(
    GameStateFlag.MAUSOLEUM_HEART_KILLED,
  );
  const room = game.GetRoom();
  const gridIndex = room.GetGridIndex(entity.Position);
  const roomGridIndex = getRoomGridIndex();
  const repentanceStage = onRepentanceStage();
  const clearedMomBossRoom = inClearedMomBossRoom();

  switch (fastTravelEntityType) {
    case FastTravelEntityType.TRAPDOOR: {
      const gridEntity = entity as GridEntity;
      const variant = gridEntity.GetVariant();

      if (variant === asNumber(TrapdoorVariant.VOID_PORTAL)) {
        return "gfx/grid/voidtrapdoor_custom.anm2";
      }

      // Trapdoors that have to do with specific kinds of races.
      if (
        inRaceToBeast()
        && clearedMomBossRoom
        && !repentanceStage
        && gridIndex === NORMAL_TRAPDOOR_GRID_INDEX
      ) {
        return "gfx/grid/trapdoor_mausoleum_custom.anm2";
      }

      // Trapdoors that have to do with specific kinds of multi-character speedruns.
      if (
        onSeason(3)
        && clearedMomBossRoom
        && !repentanceStage
        && gridIndex === SEASON_3_INVERTED_TRAPDOOR_GRID_INDEX
      ) {
        return "gfx/grid/trapdoor_mausoleum_custom.anm2";
      }

      if (
        onSeason(3)
        && clearedMomBossRoom
        && repentanceStage
        && gridIndex === NORMAL_TRAPDOOR_GRID_INDEX
      ) {
        return "gfx/grid/door_11_corpsehole_custom.anm2";
      }

      // -8
      if (roomGridIndex === asNumber(GridRoom.BLUE_WOMB)) {
        return "gfx/grid/door_11_wombhole_blue_custom.anm2";
      }

      // -10
      if (roomGridIndex === asNumber(GridRoom.SECRET_EXIT)) {
        if (
          onStage(LevelStage.BASEMENT_1, LevelStage.BASEMENT_2)
          && !repentanceStage
        ) {
          return "gfx/grid/trapdoor_downpour_custom.anm2";
        }

        if (
          (onStage(LevelStage.CAVES_1, LevelStage.CAVES_2) && !repentanceStage)
          || (onStage(LevelStage.BASEMENT_2) && repentanceStage)
        ) {
          return "gfx/grid/trapdoor_mines_custom.anm2";
        }

        if (
          (onStage(LevelStage.DEPTHS_1, LevelStage.DEPTHS_2)
            && !repentanceStage)
          || (onStage(LevelStage.CAVES_2) && repentanceStage)
        ) {
          return "gfx/grid/trapdoor_mausoleum_custom.anm2";
        }
      }

      if (
        (repentanceStage
          && onStage(LevelStage.DEPTHS_2)
          && mausoleumHeartKilled)
        || (repentanceStage && onStage(LevelStage.WOMB_1))
      ) {
        return "gfx/grid/door_11_corpsehole_custom.anm2";
      }

      if (
        (isGreedMode && onStage(LevelStage.CAVES_1))
        || (!isGreedMode && onStage(LevelStage.DEPTHS_2, LevelStage.WOMB_1))
      ) {
        return "gfx/grid/door_11_wombhole_custom.anm2";
      }

      return "gfx/grid/door_11_trapdoor_custom.anm2";
    }

    case FastTravelEntityType.CRAWLSPACE: {
      const gridEntity = entity as GridEntity;
      const variant = gridEntity.GetVariant();

      if (variant === asNumber(CrawlSpaceVariant.SECRET_SHOP)) {
        return "gfx/grid/door_20_secrettrapdoor_shop_custom.anm2";
      }

      return "gfx/grid/door_20_secrettrapdoor_custom.anm2";
    }

    case FastTravelEntityType.HEAVEN_DOOR: {
      return "gfx/1000.039_heaven door custom.anm2";
    }
  }
}

export function checkFastTravelEntityShouldOpen(
  entity: GridEntity | EntityEffect,
  fastTravelEntityType: FastTravelEntityType,
): void {
  const entityState = getFastTravelEntityState(entity, fastTravelEntityType);
  if (
    entityState === FastTravelEntityState.CLOSED
    && shouldOpenFastTravelEntity(entity, fastTravelEntityType)
  ) {
    fastTravelEntityOpen(entity, fastTravelEntityType);
  }
}

export function checkPlayerTouchedFastTravelEntity(
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

  const entityState = getFastTravelEntityState(entity, fastTravelEntityType);
  if (entityState === FastTravelEntityState.CLOSED) {
    return;
  }

  const playersTouching = Isaac.FindInRadius(
    entity.Position,
    TRAPDOOR_AND_CRAWL_SPACE_TOUCH_DISTANCE,
    EntityPartition.PLAYER,
  );

  for (const playerEntity of playersTouching) {
    const player = playerEntity.ToPlayer();
    if (player === undefined) {
      continue;
    }

    if (
      // We don't want a Pony dash to transition to a new floor or a crawl space.
      !mod.isPlayerUsingPony(player)
      && !isChildPlayer(player)
      && canInteractWith(player)
    ) {
      touchedFunction(entity, player);
      return; // Prevent two players from touching the same entity.
    }
  }
}

function canInteractWith(player: EntityPlayer) {
  // Players cannot interact with fast travel entities when items are queued or while playing
  // certain animations.
  const sprite = player.GetSprite();
  const animation = sprite.GetAnimation();
  return (
    !player.IsHoldingItem()
    && !ANIMATIONS_THAT_PREVENT_FAST_TRAVEL.has(animation)
  );
}
