import {
  CollectibleType,
  EffectVariant,
  GridEntityType,
  HeavenLightDoorSubType,
  LevelStage,
  TrapdoorVariant,
} from "isaac-typescript-definitions";
import {
  anyPlayerHasCollectible,
  inMegaSatanRoom,
  log,
  onCathedral,
  onChest,
  onDarkRoom,
  onRepentanceStage,
  onSheol,
  spawnEffect,
  spawnGridEntityWithVariant,
} from "isaacscript-common";
import { BigChestReplacementAction } from "../../../../enums/BigChestReplacementAction";
import { ChallengeCustom } from "../../../../enums/ChallengeCustom";
import { CollectibleTypeCustom } from "../../../../enums/CollectibleTypeCustom";
import { FastTravelEntityType } from "../../../../enums/FastTravelEntityType";
import { RaceGoal } from "../../../../enums/RaceGoal";
import { RacerStatus } from "../../../../enums/RacerStatus";
import { RaceStatus } from "../../../../enums/RaceStatus";
import g from "../../../../globals";
import { mod } from "../../../../mod";
import { spawnTrophy } from "../../../mandatory/trophy";
import { spawnVictoryLapButton } from "../../../race/endOfRaceButtons";
import { getSeason3BigChestReplacementAction } from "../../../speedrun/season3/bigChest";
import {
  isOnFinalCharacter,
  onSpeedrunWithDarkRoomGoal,
  postSpawnCheckpoint,
} from "../../../speedrun/speedrun";
import { speedrunGetCharacterNum } from "../../../speedrun/v";
import * as fastTravel from "./fastTravel";

const DEFAULT_REPLACEMENT_ACTION = BigChestReplacementAction.LEAVE_ALONE;

// ModCallback.POST_PICKUP_INIT (34)
// PickupVariant.BIG_CHEST (340)
export function postPickupInitBigChest(pickup: EntityPickup): void {
  const replacementAction = getReplacementAction();
  replace(pickup, replacementAction);
  log(
    `Big Chest detected, doing action: ${BigChestReplacementAction[replacementAction]}`,
  );
}

function getReplacementAction() {
  const challenge = Isaac.GetChallenge();

  // First, handle the common case of Cathedral and Sheol. (This avoids duplication below.)
  if (onCathedral() && anyPlayerHasCollectible(CollectibleType.POLAROID)) {
    return BigChestReplacementAction.HEAVEN_DOOR;
  }
  if (onSheol() && anyPlayerHasCollectible(CollectibleType.NEGATIVE)) {
    return BigChestReplacementAction.TRAPDOOR;
  }

  if (challenge === ChallengeCustom.SEASON_1) {
    return speedrunUp();
  }
  if (challenge === ChallengeCustom.SEASON_2) {
    return speedrunAlternate();
  }
  if (challenge === ChallengeCustom.SEASON_3) {
    return getSeason3BigChestReplacementAction();
  }

  if (g.raceVars.finished) {
    return BigChestReplacementAction.VICTORY_LAP;
  }

  if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING
  ) {
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

enum SpeedrunDirection {
  /** To The Chest & Blue Baby. */
  UP,

  /** The the Dark Room & The Lamb. */
  DOWN,
}

function speedrunAlternate() {
  // Some seasons alternate between directions, so we need to make sure we only handle the intended
  // direction.
  const characterNum = speedrunGetCharacterNum();
  const direction = onSpeedrunWithDarkRoomGoal()
    ? SpeedrunDirection.DOWN
    : SpeedrunDirection.UP;
  log(
    `Season 2 - Big chest situation, character number: ${characterNum}, direction: ${SpeedrunDirection[direction]} (${direction})`,
  );

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
  if (isOnFinalCharacter()) {
    return BigChestReplacementAction.TROPHY;
  }

  return BigChestReplacementAction.CHECKPOINT;
}

function blueBaby() {
  if (onChest() && !inMegaSatanRoom()) {
    return BigChestReplacementAction.TROPHY;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function theLamb() {
  if (onDarkRoom() && !inMegaSatanRoom()) {
    return BigChestReplacementAction.TROPHY;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function megaSatan() {
  const stage = g.l.GetStage();

  if (stage === LevelStage.DARK_ROOM_CHEST && !inMegaSatanRoom()) {
    // We want to delete the Big Chest after Blue Baby or The Lamb to remind the player that they
    // have to go to Mega Satan.
    return BigChestReplacementAction.REMOVE;
  }

  if (stage === LevelStage.DARK_ROOM_CHEST && inMegaSatanRoom()) {
    return BigChestReplacementAction.TROPHY;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function hush() {
  const stage = g.l.GetStage();

  if (stage === LevelStage.BLUE_WOMB) {
    return BigChestReplacementAction.TROPHY;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function delirium() {
  const stage = g.l.GetStage();

  if (stage === LevelStage.THE_VOID) {
    return BigChestReplacementAction.TROPHY;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function mother() {
  const stage = g.l.GetStage();

  if (stage === LevelStage.WOMB_2 && onRepentanceStage()) {
    return BigChestReplacementAction.TROPHY;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function theBeast() {
  const stage = g.l.GetStage();

  if (stage === LevelStage.HOME) {
    return BigChestReplacementAction.TROPHY;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function bossRush() {
  const stage = g.l.GetStage();

  if (stage === LevelStage.DEPTHS_2) {
    return BigChestReplacementAction.TROPHY;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function replace(
  pickup: EntityPickup,
  replacementAction: BigChestReplacementAction,
) {
  if (replacementAction !== BigChestReplacementAction.LEAVE_ALONE) {
    pickup.Remove();
  }

  switch (replacementAction) {
    case BigChestReplacementAction.LEAVE_ALONE: {
      // Hijack the normally-unused "Touched" property to signify that we should leave it here. (We
      // will ignore it on subsequent frames.)
      pickup.Touched = true;
      break;
    }

    case BigChestReplacementAction.TRAPDOOR: {
      const gridIndex = g.r.GetGridIndex(pickup.Position);
      spawnGridEntityWithVariant(
        GridEntityType.TRAPDOOR,
        TrapdoorVariant.NORMAL,
        gridIndex,
      );

      break;
    }

    case BigChestReplacementAction.HEAVEN_DOOR: {
      const heavenDoor = spawnEffect(
        EffectVariant.HEAVEN_LIGHT_DOOR,
        HeavenLightDoorSubType.HEAVEN_DOOR,
        pickup.Position,
      );

      // This will get naturally initialized by the fast-travel system on the next frame. However,
      // we explicitly initialize it now to prevent indexing errors later on this frame (when the
      // room is cleared).
      fastTravel.init(heavenDoor, FastTravelEntityType.HEAVEN_DOOR, () => true);

      break;
    }

    case BigChestReplacementAction.CHECKPOINT: {
      const seed = g.seeds.GetStartSeed();
      const checkpoint = mod.spawnCollectible(
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
