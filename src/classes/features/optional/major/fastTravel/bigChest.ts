import {
  CollectibleType,
  EffectVariant,
  GridEntityType,
  HeavenLightDoorSubType,
  LevelStage,
  TrapdoorVariant,
} from "isaac-typescript-definitions";
import {
  VectorZero,
  anyPlayerHasCollectible,
  game,
  inMegaSatanRoom,
  onCathedral,
  onChest,
  onDarkRoom,
  onRepentanceStage,
  onSheol,
  onStage,
  spawnCollectible,
  spawnEffect,
  spawnGridEntityWithVariant,
} from "isaacscript-common";
import { BigChestReplacementAction } from "../../../../../enums/BigChestReplacementAction";
import { CollectibleTypeCustom } from "../../../../../enums/CollectibleTypeCustom";
import { FastTravelEntityType } from "../../../../../enums/FastTravelEntityType";
import { RaceGoal } from "../../../../../enums/RaceGoal";
import { inRace } from "../../../../../features/race/v";
import { g } from "../../../../../globals";
import {
  onSeason,
  onSpeedrunWithDarkRoomGoal,
  postSpawnCheckpoint,
  preSpawnCheckpoint,
} from "../../../../../speedrun/utilsSpeedrun";
import { spawnTrophy } from "../../../mandatory/misc/Trophy";
import { spawnVictoryLapButton } from "../../../race/EndOfRaceButtons";
import { season3GetBigChestReplacementAction } from "../../../speedrun/Season3";
import { isOnFinalCharacter } from "../../../speedrun/characterProgress/v";
import { initFastTravelEntity } from "./fastTravelEntity";

enum SpeedrunDirection {
  /** To The Chest & Blue Baby. */
  UP,

  /** The the Dark Room & The Lamb. */
  DOWN,
}

const DEFAULT_REPLACEMENT_ACTION = BigChestReplacementAction.LEAVE_ALONE;

// ModCallback.POST_PICKUP_INIT (34)
// PickupVariant.BIG_CHEST (340)
export function bigChestPostPickupInitBigChest(pickup: EntityPickup): void {
  const replacementAction = getReplacementAction();
  replaceBigChest(pickup, replacementAction);
}

function getReplacementAction() {
  // First, handle the common case of Cathedral and Sheol. (This avoids duplication below.)
  if (onCathedral() && anyPlayerHasCollectible(CollectibleType.POLAROID)) {
    return BigChestReplacementAction.HEAVEN_DOOR;
  }
  if (onSheol() && anyPlayerHasCollectible(CollectibleType.NEGATIVE)) {
    return BigChestReplacementAction.TRAPDOOR;
  }

  if (onSeason(1)) {
    return speedrunUp();
  }
  if (onSeason(2)) {
    return speedrunAlternate();
  }
  if (onSeason(3)) {
    return season3GetBigChestReplacementAction();
  }
  if (onSeason(4)) {
    return speedrunAlternate();
  }
  if (onSeason(5)) {
    return speedrunAlternate();
  }

  if (g.raceVars.finished) {
    return BigChestReplacementAction.VICTORY_LAP;
  }

  if (inRace()) {
    if (g.race.goal === RaceGoal.BLUE_BABY) {
      return blueBaby();
    }

    if (g.race.goal === RaceGoal.THE_LAMB) {
      return theLamb();
    }

    if (g.race.goal === RaceGoal.MEGA_SATAN) {
      return megaSatan();
    }

    if (g.race.goal === RaceGoal.HUSH) {
      return hush();
    }

    if (g.race.goal === RaceGoal.DELIRIUM) {
      return delirium();
    }

    if (g.race.goal === RaceGoal.MOTHER) {
      return mother();
    }

    if (g.race.goal === RaceGoal.THE_BEAST) {
      return theBeast();
    }

    if (g.race.goal === RaceGoal.BOSS_RUSH) {
      return bossRush();
    }
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function speedrunUp() {
  // Speedruns go to The Chest and do not require The Polaroid.
  if (onCathedral()) {
    return BigChestReplacementAction.HEAVEN_DOOR;
  }

  if (onChest()) {
    return speedrunKilledFinalBoss();
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function speedrunAlternate() {
  // Some seasons alternate between directions, so we need to make sure we only handle the intended
  // direction.
  const direction = onSpeedrunWithDarkRoomGoal()
    ? SpeedrunDirection.DOWN
    : SpeedrunDirection.UP;

  // The Polaroid / The Negative is optional in seasons that alternate direction.
  if (onCathedral()) {
    return direction === SpeedrunDirection.UP
      ? BigChestReplacementAction.HEAVEN_DOOR
      : BigChestReplacementAction.LEAVE_ALONE;
  }

  if (onSheol()) {
    return direction === SpeedrunDirection.DOWN
      ? BigChestReplacementAction.TRAPDOOR
      : BigChestReplacementAction.LEAVE_ALONE;
  }

  if (
    (onChest() && direction === SpeedrunDirection.UP) ||
    (onDarkRoom() && direction === SpeedrunDirection.DOWN)
  ) {
    return speedrunKilledFinalBoss();
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function speedrunKilledFinalBoss() {
  return isOnFinalCharacter()
    ? BigChestReplacementAction.TROPHY
    : BigChestReplacementAction.CHECKPOINT;
}

function blueBaby() {
  return onChest() && !inMegaSatanRoom()
    ? BigChestReplacementAction.TROPHY
    : DEFAULT_REPLACEMENT_ACTION;
}

function theLamb() {
  return onDarkRoom() && !inMegaSatanRoom()
    ? BigChestReplacementAction.TROPHY
    : DEFAULT_REPLACEMENT_ACTION;
}

function megaSatan() {
  if (onStage(LevelStage.DARK_ROOM_CHEST)) {
    // We want to delete the Big Chest after Blue Baby or The Lamb to remind the player that they
    // have to go to Mega Satan.
    return inMegaSatanRoom()
      ? BigChestReplacementAction.TROPHY
      : BigChestReplacementAction.REMOVE;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function hush() {
  return onStage(LevelStage.BLUE_WOMB)
    ? BigChestReplacementAction.TROPHY
    : DEFAULT_REPLACEMENT_ACTION;
}

function delirium() {
  return onStage(LevelStage.VOID)
    ? BigChestReplacementAction.TROPHY
    : DEFAULT_REPLACEMENT_ACTION;
}

function mother() {
  return onStage(LevelStage.WOMB_2) && onRepentanceStage()
    ? BigChestReplacementAction.TROPHY
    : DEFAULT_REPLACEMENT_ACTION;
}

function theBeast() {
  return onStage(LevelStage.HOME)
    ? BigChestReplacementAction.TROPHY
    : DEFAULT_REPLACEMENT_ACTION;
}

function bossRush() {
  return onStage(LevelStage.DEPTHS_2)
    ? BigChestReplacementAction.TROPHY
    : DEFAULT_REPLACEMENT_ACTION;
}

function replaceBigChest(
  pickup: EntityPickup,
  replacementAction: BigChestReplacementAction,
) {
  const room = game.GetRoom();
  const seeds = game.GetSeeds();

  if (replacementAction !== BigChestReplacementAction.LEAVE_ALONE) {
    pickup.Remove();
  }

  switch (replacementAction) {
    case BigChestReplacementAction.LEAVE_ALONE: {
      break;
    }

    case BigChestReplacementAction.TRAPDOOR: {
      const gridIndex = room.GetGridIndex(pickup.Position);
      spawnGridEntityWithVariant(
        GridEntityType.TRAPDOOR,
        TrapdoorVariant.NORMAL,
        gridIndex,
      );

      break;
    }

    case BigChestReplacementAction.HEAVEN_DOOR: {
      // The fast-travel feature expects heaven doors to have the player as the spawner.
      const player = Isaac.GetPlayer();
      const heavenDoor = spawnEffect(
        EffectVariant.HEAVEN_LIGHT_DOOR,
        HeavenLightDoorSubType.HEAVEN_DOOR,
        pickup.Position,
        VectorZero,
        player,
      );

      // This will get naturally initialized by the fast-travel system on the next frame. However,
      // we explicitly initialize it now to prevent indexing errors later on this frame (when the
      // room is cleared).
      initFastTravelEntity(
        heavenDoor,
        FastTravelEntityType.HEAVEN_DOOR,
        () => true,
      );

      break;
    }

    case BigChestReplacementAction.CHECKPOINT: {
      preSpawnCheckpoint();
      const seed = seeds.GetStartSeed();
      const checkpoint = spawnCollectible(
        CollectibleTypeCustom.CHECKPOINT,
        pickup.Position,
        seed,
      );
      postSpawnCheckpoint(checkpoint);
      break;
    }

    case BigChestReplacementAction.TROPHY: {
      spawnTrophy(pickup.Position);
      break;
    }

    case BigChestReplacementAction.VICTORY_LAP: {
      spawnVictoryLapButton(true);
      break;
    }

    case BigChestReplacementAction.REMOVE: {
      break;
    }
  }
}
