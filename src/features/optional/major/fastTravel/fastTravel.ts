// These are shared functions for fast-travel entities

import {
  ensureAllCases,
  getPlayers,
  getRoomSafeGridIndex,
  isChildPlayer,
  log,
  onRepentanceStage,
} from "isaacscript-common";
import g from "../../../../globals";
import { RaceGoal } from "../../../race/types/RaceGoal";
import { RacerStatus } from "../../../race/types/RacerStatus";
import { RaceStatus } from "../../../race/types/RaceStatus";
import {
  ANIMATIONS_THAT_PREVENT_FAST_TRAVEL,
  TRAPDOOR_TOUCH_DISTANCE,
} from "./constants";
import {
  FastTravelEntityState,
  FastTravelEntityType,
  FastTravelState,
} from "./enums";
import * as state from "./state";
import v from "./v";

export function init(
  entity: GridEntity | EntityEffect,
  fastTravelEntityType: FastTravelEntityType,
  // This must be passed a function instead of a boolean because we need to initialize the
  // description before checking whether or not it should open
  shouldSpawnOpen: (entity: GridEntity | EntityEffect) => boolean,
): void {
  const gameFrameCount = g.g.GetFrameCount();
  const roomFrameCount = g.r.GetFrameCount();

  const sprite = entity.GetSprite();
  const fileName = sprite.GetFilename();
  const customFileName = getCustomSpriteFilename(entity, fastTravelEntityType);
  if (fileName === customFileName) {
    return;
  }

  log(
    `Initializing a ${FastTravelEntityType[fastTravelEntityType]} fast-travel entity on frame: ${gameFrameCount}`,
  );

  sprite.Load(customFileName, true);
  state.initDescription(entity, fastTravelEntityType);

  if (shouldSpawnOpen(entity)) {
    state.open(entity, fastTravelEntityType, true);
  } else {
    state.close(entity, fastTravelEntityType);
  }

  if (fastTravelEntityType === FastTravelEntityType.HEAVEN_DOOR) {
    const effect = entity as EntityEffect;
    const data = effect.GetData();
    data.onInitialRoom = roomFrameCount === 0;
  }
}

function getCustomSpriteFilename(
  entity: GridEntity | EntityEffect,
  fastTravelEntityType: FastTravelEntityType,
) {
  const isGreedMode = g.g.IsGreedMode();
  const mausoleumHeartKilled = g.g.GetStateFlag(
    GameStateFlag.STATE_MAUSOLEUM_HEART_KILLED,
  );
  const stage = g.l.GetStage();
  const roomSafeGridIndex = getRoomSafeGridIndex();
  const roomType = g.r.GetType();
  const repentanceStage = onRepentanceStage();

  switch (fastTravelEntityType) {
    case FastTravelEntityType.TRAPDOOR: {
      // -8
      if (roomSafeGridIndex === GridRooms.ROOM_BLUE_WOOM_IDX) {
        return "gfx/grid/door_11_wombhole_blue_custom.anm2";
      }

      // -9
      if (roomSafeGridIndex === GridRooms.ROOM_THE_VOID_IDX) {
        return "gfx/grid/voidtrapdoor.anm2";
      }

      // -10
      if (roomSafeGridIndex === GridRooms.ROOM_SECRET_EXIT_IDX) {
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

      if (roomType === RoomType.ROOM_BOSS) {
        if (
          g.race.status === RaceStatus.IN_PROGRESS &&
          g.race.myStatus === RacerStatus.RACING &&
          g.race.goal === RaceGoal.THE_BEAST &&
          !repentanceStage &&
          stage === 6 &&
          roomType === RoomType.ROOM_BOSS
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

      if (variant === StairsVariant.SECRET_SHOP) {
        return "gfx/grid/door_20_secrettrapdoor_shop_custom.anm2";
      }

      return "gfx/grid/door_20_secrettrapdoor_custom.anm2"; // cspell:disable-line
    }

    case FastTravelEntityType.HEAVEN_DOOR: {
      return "gfx/1000.039_heaven door custom.anm2";
    }

    default: {
      ensureAllCases(fastTravelEntityType);
      return "";
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
    // TODO remove this after the next vanilla patch when Crawlspaces are decoupled from sprites
    !anyPlayerUsingPony()
  ) {
    state.open(entity, fastTravelEntityType);
  }
}

// TODO remove this after the next vanilla patch when Crawlspaces are decoupled from sprites
export function anyPlayerUsingPony() {
  for (const player of getPlayers()) {
    if (isUsingPony(player)) {
      return true;
    }
  }

  return false;
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
      // We don't want a Pony dash to transition to a new floor or a crawlspace
      !isUsingPony(player) &&
      !isChildPlayer(player) &&
      canInteractWith(player)
    ) {
      touchedFunction(entity, player);
      return; // Prevent two players from touching the same entity
    }
  }
}

function isUsingPony(player: EntityPlayer): boolean {
  const temporaryEffects = player.GetEffects();
  return (
    temporaryEffects.HasCollectibleEffect(CollectibleType.COLLECTIBLE_PONY) ||
    temporaryEffects.HasCollectibleEffect(
      CollectibleType.COLLECTIBLE_WHITE_PONY,
    )
  );
}

function canInteractWith(player: EntityPlayer) {
  // Players cannot interact with fast travel entities while playing certain animations
  const sprite = player.GetSprite();
  const animation = sprite.GetAnimation();
  return (
    !player.IsHoldingItem() &&
    !ANIMATIONS_THAT_PREVENT_FAST_TRAVEL.has(animation)
  );
}
