// These are shared functions for fast-travel entities

import g from "../../../../globals";
import log from "../../../../log";
import {
  ensureAllCases,
  getRoomIndex,
  isAntibirthStage,
} from "../../../../misc";
import { TRAPDOOR_TOUCH_DISTANCE } from "./constants";
import {
  FastTravelEntityState,
  FastTravelEntityType,
  FastTravelState,
} from "./enums";
import * as state from "./state";

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
  const customFileName = getCustomSpriteFilename(fastTravelEntityType);
  if (fileName === customFileName) {
    return;
  }

  log(
    `Initializing a type ${fastTravelEntityType} Fast-Travel entity on frame: ${gameFrameCount}`,
  );

  sprite.Load(customFileName, true);
  state.initDescription(entity, fastTravelEntityType);

  if (shouldSpawnOpen(entity)) {
    state.open(entity, fastTravelEntityType, true);
  } else {
    state.close(entity, fastTravelEntityType);
  }

  if (fastTravelEntityType === FastTravelEntityType.HeavenDoor) {
    const effect = entity as EntityEffect;
    const data = effect.GetData();
    data.onInitialRoom = roomFrameCount === 0;
  }
}

function getCustomSpriteFilename(fastTravelEntityType: FastTravelEntityType) {
  const isGreedMode = g.g.IsGreedMode();
  const stage = g.l.GetStage();
  const roomIndex = getRoomIndex();
  const roomType = g.r.GetType();
  const antibirthStage = isAntibirthStage();

  switch (fastTravelEntityType) {
    case FastTravelEntityType.Trapdoor: {
      // -8
      if (roomIndex === GridRooms.ROOM_BLUE_WOOM_IDX) {
        return "gfx/grid/door_11_wombhole_blue_custom.anm2";
      }

      // -9
      if (roomIndex === GridRooms.ROOM_THE_VOID_IDX) {
        return "gfx/grid/voidtrapdoor.anm2";
      }

      // -10
      if (roomIndex === GridRooms.ROOM_SECRET_EXIT_IDX) {
        if (!antibirthStage && (stage === 1 || stage === 2)) {
          return "gfx/grid/trapdoor_downpour_custom.anm2";
        }

        if (
          (antibirthStage && stage === 2) ||
          (!antibirthStage && (stage === 3 || stage === 4))
        ) {
          return "gfx/grid/trapdoor_mines_custom.anm2";
        }

        if (
          (antibirthStage && stage === 4) ||
          (!antibirthStage && stage === 6)
        ) {
          return "gfx/grid/trapdoor_mausoleum_custom.anm2";
        }
      }

      if (roomType === RoomType.ROOM_BOSS) {
        if (
          g.race.status === "in progress" &&
          g.race.myStatus === "racing" &&
          g.race.goal === "The Beast" &&
          !antibirthStage &&
          stage === 6
        ) {
          return "gfx/grid/trapdoor_mausoleum_custom.anm2";
        }
      }

      if (
        (antibirthStage &&
          stage === 6 &&
          g.g.GetStateFlag(GameStateFlag.STATE_MAUSOLEUM_HEART_KILLED)) ||
        (antibirthStage && stage === 7)
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

    case FastTravelEntityType.Crawlspace: {
      return "gfx/grid/door_20_secrettrapdoor_custom.anm2"; // cspell:disable-line
    }

    case FastTravelEntityType.HeavenDoor: {
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
    entityState === FastTravelEntityState.Closed &&
    state.shouldOpen(entity, fastTravelEntityType)
  ) {
    state.open(entity, fastTravelEntityType);
  }
}

export function checkPlayerTouched(
  entity: GridEntity | EntityEffect,
  fastTravelEntityType: FastTravelEntityType,
  touchedFunction: (
    effect: GridEntity | EntityEffect,
    player: EntityPlayer,
  ) => void,
): void {
  if (g.run.fastTravel.state !== FastTravelState.Disabled) {
    return;
  }

  const entityState = state.get(entity, fastTravelEntityType);
  if (entityState === FastTravelEntityState.Closed) {
    return;
  }

  const playersTouching = Isaac.FindInRadius(
    entity.Position,
    TRAPDOOR_TOUCH_DISTANCE,
    EntityPartition.PLAYER,
  );
  for (const playerEntity of playersTouching) {
    const player = playerEntity.ToPlayer();
    if (player !== null && canInteractWith(player)) {
      touchedFunction(entity, player);
      return; // Prevent two players from touching the same entity
    }
  }
}

function canInteractWith(player: EntityPlayer) {
  // Players cannot interact with crawlspaces while playing certain animations
  const sprite = player.GetSprite();
  return (
    !player.IsHoldingItem() &&
    !sprite.IsPlaying("Happy") && // Account for lucky pennies
    !sprite.IsPlaying("Jump") // Account for How to Jump
  );
}
