import {
  anyPlayerHasCollectible,
  ensureAllCases,
  inMegaSatanRoom,
  log,
  onCathedral,
  onChest,
  onDarkRoom,
  onRepentanceStage,
  onSheol,
  spawnCollectible,
  spawnGridEntityWithVariant,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../../enums/ChallengeCustom";
import { CollectibleTypeCustom } from "../../../../enums/CollectibleTypeCustom";
import { FastTravelEntityType } from "../../../../enums/FastTravelEntityType";
import { RaceGoal } from "../../../../enums/RaceGoal";
import { RacerStatus } from "../../../../enums/RacerStatus";
import { RaceStatus } from "../../../../enums/RaceStatus";
import g from "../../../../globals";
import * as trophy from "../../../mandatory/trophy";
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

// ModCallbacks.MC_POST_PICKUP_INIT (34)
// PickupVariant.PICKUP_BIGCHEST (340)
export function postPickupInitBigChest(pickup: EntityPickup): void {
  const replacementAction = getReplacementAction();
  replace(pickup, replacementAction);
  log(
    `Big Chest detected, doing action: ${ReplacementAction[replacementAction]}`,
  );
}

function getReplacementAction() {
  const challenge = Isaac.GetChallenge();

  // First, handle the common case of Cathedral and Sheol
  // (this avoids duplication below)

  if (
    onCathedral() &&
    anyPlayerHasCollectible(CollectibleType.COLLECTIBLE_POLAROID)
  ) {
    return ReplacementAction.HEAVEN_DOOR;
  }

  if (
    onSheol() &&
    anyPlayerHasCollectible(CollectibleType.COLLECTIBLE_NEGATIVE)
  ) {
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
  // Speedruns go to The Chest and do not require The Polaroid
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
  // Some seasons alternate between directions,
  // so we need to make sure we only handle the intended direction
  const direction = onSpeedrunWithDarkRoomGoal()
    ? SpeedrunDirection.DOWN
    : SpeedrunDirection.UP;
  log(
    `Season 2 - Big chest situation, character number: ${speedrunGetCharacterNum()}, direction: ${
      SpeedrunDirection[direction]
    } (${direction})`,
  );

  // The Polaroid / The Negative is optional in seasons that alternate direction
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

  if (stage === 11 && !inMegaSatanRoom()) {
    // We want to delete the Big Chest after Blue Baby or The Lamb to remind the player that they
    // have to go to Mega Satan
    return ReplacementAction.REMOVE;
  }

  if (stage === 11 && inMegaSatanRoom()) {
    return ReplacementAction.TROPHY;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function hush() {
  const stage = g.l.GetStage();

  if (stage === 9) {
    return ReplacementAction.TROPHY;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function delirium() {
  const stage = g.l.GetStage();

  if (stage === 12) {
    return ReplacementAction.TROPHY;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function mother() {
  const stage = g.l.GetStage();

  if (stage === 8 && onRepentanceStage()) {
    return ReplacementAction.TROPHY;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function theBeast() {
  const stage = g.l.GetStage();

  if (stage === 13) {
    return ReplacementAction.TROPHY;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function bossRush() {
  const stage = g.l.GetStage();

  if (stage === 6) {
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
      // Hijack the normally-unused "Touched" property to signify that we should leave it here
      // (so that we ignore it on subsequent frames)
      pickup.Touched = true;
      return;
    }

    case ReplacementAction.TRAPDOOR: {
      const gridIndex = g.r.GetGridIndex(pickup.Position);
      spawnGridEntityWithVariant(
        GridEntityType.GRID_TRAPDOOR,
        TrapdoorVariant.NORMAL,
        gridIndex,
      );

      return;
    }

    case ReplacementAction.HEAVEN_DOOR: {
      const heavenDoor = Isaac.Spawn(
        EntityType.ENTITY_EFFECT,
        EffectVariant.HEAVEN_LIGHT_DOOR,
        HeavenLightDoorSubType.HEAVEN_DOOR,
        pickup.Position,
        Vector.Zero,
        undefined,
      ).ToEffect();

      // This will get naturally initialized by the fast-travel system on the next frame
      // However, we explicitly initialize it now to prevent indexing errors later on this frame
      // (when the room is cleared)
      if (heavenDoor !== undefined) {
        fastTravel.init(
          heavenDoor,
          FastTravelEntityType.HEAVEN_DOOR,
          () => true,
        );
      }

      return;
    }

    case ReplacementAction.CHECKPOINT: {
      const seed = g.r.GetAwardSeed();
      const checkpoint = spawnCollectible(
        CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT,
        pickup.Position,
        seed,
      );
      postSpawnCheckpoint(checkpoint);
      return;
    }

    case ReplacementAction.TROPHY: {
      trophy.spawn(pickup.Position);
      return;
    }

    case ReplacementAction.VICTORY_LAP: {
      spawnVictoryLapButton(true);
      return;
    }

    case ReplacementAction.REMOVE: {
      return;
    }

    default: {
      ensureAllCases(replacementAction);
    }
  }
}
