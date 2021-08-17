import {
  anyPlayerHasCollectible,
  ensureAllCases,
  getRoomIndex,
  log,
  onCathedral,
  onChest,
  onDarkRoom,
  onRepentanceStage,
  onSheol,
} from "isaacscript-common";
import g from "../../../../globals";
import { CollectibleTypeCustom } from "../../../../types/enums";
import { spawnCollectible } from "../../../../utilGlobals";
import * as trophy from "../../../mandatory/trophy";
import { ChallengeCustom } from "../../../speedrun/enums";
import { isOnFinalCharacter } from "../../../speedrun/speedrun";
import { FastTravelEntityType } from "./enums";
import * as fastTravel from "./fastTravel";

enum ReplacementAction {
  LeaveAlone,
  TrapdoorDown,
  BeamOfLightUp,
  Checkpoint,
  Trophy,
  VictoryLap,
  Remove,
}

const DEFAULT_REPLACEMENT_ACTION = ReplacementAction.LeaveAlone;

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
  // (this avoids lots of duplication below)

  if (
    onCathedral() &&
    anyPlayerHasCollectible(CollectibleType.COLLECTIBLE_POLAROID)
  ) {
    return ReplacementAction.BeamOfLightUp;
  }

  if (
    onSheol() &&
    anyPlayerHasCollectible(CollectibleType.COLLECTIBLE_NEGATIVE)
  ) {
    return ReplacementAction.TrapdoorDown;
  }

  if (challenge === ChallengeCustom.SEASON_1) {
    return speedrunUp();
  }

  if (g.raceVars.finished) {
    return ReplacementAction.VictoryLap;
  }

  if (g.race.status === "in progress" && g.race.myStatus === "racing") {
    if (g.race.goal === "Blue Baby") {
      return blueBaby();
    }

    if (g.race.goal === "The Lamb") {
      return theLamb();
    }

    if (g.race.goal === "Mega Satan") {
      return megaSatan();
    }

    if (g.race.goal === "Hush") {
      return hush();
    }

    if (g.race.goal === "Delirium") {
      return delirium();
    }

    if (g.race.goal === "Mother") {
      return mother();
    }

    if (g.race.goal === "The Beast") {
      return theBeast();
    }

    if (g.race.goal === "Boss Rush") {
      return bossRush();
    }
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function speedrunUp() {
  // Speedruns go to The Chest and do not require The Polaroid
  if (onCathedral()) {
    return ReplacementAction.BeamOfLightUp;
  }

  if (onChest()) {
    if (isOnFinalCharacter()) {
      return ReplacementAction.Trophy;
    }

    return ReplacementAction.Checkpoint;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

/*
function speedrunAlternate() {
  // Some seasons alternate between directions,
  // so we need to make sure we only handle the intended direction
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  let direction = g.speedrun.characterNum % 2; // 1 is up, 2 is down
  if (direction === 0) {
    direction = 2;
  }

  // The Polaroid / The Negative is optional in seasons that alternate direction
  if (onCathedral() && direction === 1) {
    return ReplacementAction.BeamOfLightUp;
  }

  if (onSheol() && direction === 2) {
    return ReplacementAction.TrapdoorDown;
  }

  if (
    (onChest() && direction === 1) || // The Chest
    (onDarkRoom() && direction === 2) // Dark Room
  ) {
    // Sometimes the vanilla end of challenge trophy does not appear
    // Thus, we need to handle replacing both the trophy and the big chest
    // So replace the big chest with either a checkpoint flag or a custom trophy,
    // depending on if we are on the last character or not
    if (isOnFinalCharacter()) {
      return ReplacementAction.Trophy;
    }

    return ReplacementAction.Checkpoint;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}
*/

function blueBaby() {
  const roomIndex = getRoomIndex();

  if (onChest() && roomIndex !== GridRooms.ROOM_MEGA_SATAN_IDX) {
    return ReplacementAction.Trophy;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function theLamb() {
  const roomIndex = getRoomIndex();

  if (onDarkRoom() && roomIndex !== GridRooms.ROOM_MEGA_SATAN_IDX) {
    return ReplacementAction.Trophy;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function megaSatan() {
  const roomIndex = getRoomIndex();
  const stage = g.l.GetStage();

  if (stage === 11 && roomIndex !== GridRooms.ROOM_MEGA_SATAN_IDX) {
    // We want to delete the Big Chest after Blue Baby or The Lamb to remind the player that they
    // have to go to Mega Satan
    return ReplacementAction.Remove;
  }

  if (stage === 11 && roomIndex === GridRooms.ROOM_MEGA_SATAN_IDX) {
    return ReplacementAction.Trophy;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function hush() {
  const stage = g.l.GetStage();

  if (stage === 9) {
    return ReplacementAction.Trophy;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function delirium() {
  const stage = g.l.GetStage();

  if (stage === 12) {
    return ReplacementAction.Trophy;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function mother() {
  const stage = g.l.GetStage();

  if (stage === 8 && onRepentanceStage()) {
    return ReplacementAction.Trophy;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function theBeast() {
  const stage = g.l.GetStage();

  if (stage === 13) {
    return ReplacementAction.Trophy;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function bossRush() {
  const stage = g.l.GetStage();

  if (stage === 6) {
    return ReplacementAction.Trophy;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function replace(pickup: EntityPickup, replacementAction: ReplacementAction) {
  const position = g.r.FindFreeTilePosition(pickup.Position, 0);

  if (replacementAction !== ReplacementAction.LeaveAlone) {
    pickup.Remove();
  }

  switch (replacementAction) {
    case ReplacementAction.LeaveAlone: {
      // Hijack the normally-unused "Touched" property to signify that we should leave it here
      // (so that we ignore it on subsequent frames)
      pickup.Touched = true;
      break;
    }

    case ReplacementAction.TrapdoorDown: {
      Isaac.GridSpawn(GridEntityType.GRID_TRAPDOOR, 0, position, true);
      break;
    }

    case ReplacementAction.BeamOfLightUp: {
      const heavenDoor = Isaac.Spawn(
        EntityType.ENTITY_EFFECT,
        EffectVariant.HEAVEN_LIGHT_DOOR,
        0,
        position,
        Vector.Zero,
        null,
      ).ToEffect();

      // This will get naturally initialized by the fast-travel system on the next frame
      // However, we explicitly initialize it now to prevent indexing errors later on this frame
      // (when the room is cleared)
      if (heavenDoor !== null) {
        fastTravel.init(
          heavenDoor,
          FastTravelEntityType.HeavenDoor,
          () => true,
        );
      }

      break;
    }

    case ReplacementAction.Checkpoint: {
      const seed = g.r.GetAwardSeed();
      spawnCollectible(
        CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT,
        position,
        seed,
        false,
      );
      break;
    }

    case ReplacementAction.Trophy: {
      trophy.spawn(position);
      break;
    }

    case ReplacementAction.VictoryLap: {
      // TODO
      /*
      // Spawn a button for the Victory Lap feature
      // We want to use a position from the "GridToPos()" function because otherwise the position
      // can slightly shift if it does not align with the grid
      position = gridToPos(6, 3);
      if (roomIndex === GridRooms.ROOM_MEGA_SATAN_IDX) {
        position = gridToPos(6, 9);
      }

      g.run.level.buttons.push({
        type: "victory-lap",
        pos: position,
        roomIndex,
      });
      Isaac.GridSpawn(GridEntityType.GRID_PRESSURE_PLATE, 0, position, true);
      sprites.init("victory-lap-button", "victory-lap-button");
      */

      break;
    }

    case ReplacementAction.Remove: {
      break;
    }

    default: {
      ensureAllCases(replacementAction);
      break;
    }
  }
}
