import {
  anyPlayerHasCollectible,
  ensureAllCases,
  getRoomSafeGridIndex,
  log,
  onCathedral,
  onChest,
  onDarkRoom,
  onRepentanceStage,
  onSheol,
  removeCollectiblePickupDelay,
  spawnCollectible,
  spawnGridEntityWithVariant,
} from "isaacscript-common";
import g from "../../../../globals";
import { CollectibleTypeCustom } from "../../../../types/CollectibleTypeCustom";
import * as trophy from "../../../mandatory/trophy";
import { spawnVictoryLapButton } from "../../../race/endOfRaceButtons";
import { RaceGoal } from "../../../race/types/RaceGoal";
import { RacerStatus } from "../../../race/types/RacerStatus";
import { RaceStatus } from "../../../race/types/RaceStatus";
import { ChallengeCustom } from "../../../speedrun/enums";
import { speedrunGetCharacterNum } from "../../../speedrun/exported";
import { isOnFinalCharacter } from "../../../speedrun/speedrun";
import { FastTravelEntityType } from "./enums";
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

export function postPickupInit(pickup: EntityPickup): void {
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
  const characterNum = speedrunGetCharacterNum();
  const modulus = characterNum % 2;
  const direction =
    modulus === 1 ? SpeedrunDirection.UP : SpeedrunDirection.DOWN;

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
  const roomSafeGridIndex = getRoomSafeGridIndex();

  if (onChest() && roomSafeGridIndex !== GridRooms.ROOM_MEGA_SATAN_IDX) {
    return ReplacementAction.TROPHY;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function theLamb() {
  const roomSafeGridIndex = getRoomSafeGridIndex();

  if (onDarkRoom() && roomSafeGridIndex !== GridRooms.ROOM_MEGA_SATAN_IDX) {
    return ReplacementAction.TROPHY;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function megaSatan() {
  const roomSafeGridIndex = getRoomSafeGridIndex();
  const stage = g.l.GetStage();

  if (stage === 11 && roomSafeGridIndex !== GridRooms.ROOM_MEGA_SATAN_IDX) {
    // We want to delete the Big Chest after Blue Baby or The Lamb to remind the player that they
    // have to go to Mega Satan
    return ReplacementAction.REMOVE;
  }

  if (stage === 11 && roomSafeGridIndex === GridRooms.ROOM_MEGA_SATAN_IDX) {
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
      break;
    }

    case ReplacementAction.TRAPDOOR: {
      const gridIndex = g.r.GetGridIndex(pickup.Position);
      spawnGridEntityWithVariant(
        GridEntityType.GRID_TRAPDOOR,
        TrapdoorVariant.NORMAL,
        gridIndex,
      );
      break;
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

      break;
    }

    case ReplacementAction.CHECKPOINT: {
      const seed = g.r.GetAwardSeed();
      const checkpoint = spawnCollectible(
        CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT,
        pickup.Position,
        seed,
      );
      removeCollectiblePickupDelay(checkpoint);
      break;
    }

    case ReplacementAction.TROPHY: {
      trophy.spawn(pickup.Position);
      break;
    }

    case ReplacementAction.VICTORY_LAP: {
      spawnVictoryLapButton(true);
      break;
    }

    case ReplacementAction.REMOVE: {
      break;
    }

    default: {
      ensureAllCases(replacementAction);
      break;
    }
  }
}
