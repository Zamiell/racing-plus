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
  spawnCollectible,
  spawnEffect,
  spawnGridWithVariant,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../../enums/ChallengeCustom";
import { CollectibleTypeCustom } from "../../../../enums/CollectibleTypeCustom";
import { FastTravelEntityType } from "../../../../enums/FastTravelEntityType";
import { RaceGoal } from "../../../../enums/RaceGoal";
import { RacerStatus } from "../../../../enums/RacerStatus";
import { RaceStatus } from "../../../../enums/RaceStatus";
import g from "../../../../globals";
import { spawnTrophy } from "../../../mandatory/trophy";
import { spawnVictoryLapButton } from "../../../race/endOfRaceButtons";
import { speedrunGetCharacterNum } from "../../../speedrun/exported";
import {
  isOnFinalCharacter,
  onSpeedrunWithDarkRoomGoal,
  postSpawnCheckpoint,
} from "../../../speedrun/speedrun";
import * as fastTravel from "./fastTravel";

enum ReplacementAction {
  /** Leave the Big Chest there. */
  LEAVE_ALONE,
  TRAPDOOR,
  HEAVEN_DOOR,
  CHECKPOINT,
  TROPHY,
  VICTORY_LAP,
  REMOVE,
}

const DEFAULT_REPLACEMENT_ACTION = ReplacementAction.LEAVE_ALONE;

// ModCallback.POST_PICKUP_INIT (34)
// PickupVariant.BIG_CHEST (340)
export function postPickupInitBigChest(pickup: EntityPickup): void {
  const replacementAction = getReplacementAction();
  replace(pickup, replacementAction);
  log(
    `Big Chest detected, doing action: ${ReplacementAction[replacementAction]}`,
  );
}

function getReplacementAction() {
  const challenge = Isaac.GetChallenge();

  // First, handle the common case of Cathedral and Sheol. (This avoids duplication below.)
  if (onCathedral() && anyPlayerHasCollectible(CollectibleType.POLAROID)) {
    return ReplacementAction.HEAVEN_DOOR;
  }
  if (onSheol() && anyPlayerHasCollectible(CollectibleType.NEGATIVE)) {
    return ReplacementAction.TRAPDOOR;
  }

  if (challenge === ChallengeCustom.SEASON_1) {
    return speedrunUp();
  }
  if (challenge === ChallengeCustom.SEASON_2) {
    return speedrunAlternate();
  }

  if (g.raceVars.finished) {
    return ReplacementAction.VICTORY_LAP;
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
    return ReplacementAction.HEAVEN_DOOR;
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
  const direction = onSpeedrunWithDarkRoomGoal()
    ? SpeedrunDirection.DOWN
    : SpeedrunDirection.UP;
  log(
    `Season 2 - Big chest situation, character number: ${speedrunGetCharacterNum()}, direction: ${
      SpeedrunDirection[direction]
    } (${direction})`,
  );

  // The Polaroid / The Negative is optional in seasons that alternate direction.
  if (onCathedral()) {
    return direction === SpeedrunDirection.UP
      ? ReplacementAction.HEAVEN_DOOR
      : ReplacementAction.LEAVE_ALONE;
  }

  if (onSheol()) {
    return direction === SpeedrunDirection.DOWN
      ? ReplacementAction.TRAPDOOR
      : ReplacementAction.LEAVE_ALONE;
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
    return ReplacementAction.TROPHY;
  }

  return ReplacementAction.CHECKPOINT;
}

function blueBaby() {
  if (onChest() && !inMegaSatanRoom()) {
    return ReplacementAction.TROPHY;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function theLamb() {
  if (onDarkRoom() && !inMegaSatanRoom()) {
    return ReplacementAction.TROPHY;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function megaSatan() {
  const stage = g.l.GetStage();

  if (stage === LevelStage.DARK_ROOM_CHEST && !inMegaSatanRoom()) {
    // We want to delete the Big Chest after Blue Baby or The Lamb to remind the player that they
    // have to go to Mega Satan.
    return ReplacementAction.REMOVE;
  }

  if (stage === LevelStage.DARK_ROOM_CHEST && inMegaSatanRoom()) {
    return ReplacementAction.TROPHY;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function hush() {
  const stage = g.l.GetStage();

  if (stage === LevelStage.BLUE_WOMB) {
    return ReplacementAction.TROPHY;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function delirium() {
  const stage = g.l.GetStage();

  if (stage === LevelStage.THE_VOID) {
    return ReplacementAction.TROPHY;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function mother() {
  const stage = g.l.GetStage();

  if (stage === LevelStage.WOMB_2 && onRepentanceStage()) {
    return ReplacementAction.TROPHY;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function theBeast() {
  const stage = g.l.GetStage();

  if (stage === LevelStage.HOME) {
    return ReplacementAction.TROPHY;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function bossRush() {
  const stage = g.l.GetStage();

  if (stage === LevelStage.DEPTHS_2) {
    return ReplacementAction.TROPHY;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function replace(pickup: EntityPickup, replacementAction: ReplacementAction) {
  if (replacementAction !== ReplacementAction.LEAVE_ALONE) {
    pickup.Remove();
  }

  switch (replacementAction) {
    case ReplacementAction.LEAVE_ALONE: {
      // Hijack the normally-unused "Touched" property to signify that we should leave it here. (We
      // will ignore it on subsequent frames.)
      pickup.Touched = true;
      break;
    }

    case ReplacementAction.TRAPDOOR: {
      const gridIndex = g.r.GetGridIndex(pickup.Position);
      spawnGridWithVariant(
        GridEntityType.TRAPDOOR,
        TrapdoorVariant.NORMAL,
        gridIndex,
      );

      break;
    }

    case ReplacementAction.HEAVEN_DOOR: {
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

    case ReplacementAction.CHECKPOINT: {
      const seed = g.seeds.GetStartSeed();
      const checkpoint = spawnCollectible(
        CollectibleTypeCustom.CHECKPOINT,
        pickup.Position,
        seed,
      );
      postSpawnCheckpoint(checkpoint);
      break;
    }

    case ReplacementAction.TROPHY: {
      spawnTrophy(pickup.Position);
      break;
    }

    case ReplacementAction.VICTORY_LAP: {
      spawnVictoryLapButton(true);
      break;
    }

    case ReplacementAction.REMOVE: {
      break;
    }
  }
}
