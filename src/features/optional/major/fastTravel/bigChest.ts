import g from "../../../../globals";
import log from "../../../../log";
import { CollectibleTypeCustom } from "../../../../types/enums";
import { ensureAllCases } from "../../../../util";
import {
  anyPlayerHasCollectible,
  getRoomIndex,
  isAntibirthStage,
} from "../../../../utilGlobals";
import * as trophy from "../../../mandatory/trophy";
import { ChallengeCustom } from "../../../speedrun/enums";
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
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const challenge = Isaac.GetChallenge();

  // First, handle the common case of Sheol and Cathedral
  // (this avoids lots of duplication below)
  if (
    stage === 10 &&
    stageType === 0 &&
    anyPlayerHasCollectible(CollectibleType.COLLECTIBLE_NEGATIVE)
  ) {
    return ReplacementAction.TrapdoorDown;
  }

  if (
    stage === 10 &&
    stageType === 1 &&
    anyPlayerHasCollectible(CollectibleType.COLLECTIBLE_POLAROID)
  ) {
    return ReplacementAction.BeamOfLightUp;
  }

  if (challenge === ChallengeCustom.SEASON_1) {
    return season1();
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

function season1() {
  // Season 1 goes to The Chest and requires The Polaroid to get there
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  if (stage === 11 && stageType === 1) {
    // The Chest (11.1)
    if (g.speedrun.characterNum === 7) {
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
  if (stage === 10 && stageType === 1 && direction === 1) {
    return ReplacementAction.BeamOfLightUp;
  }

  if (stage === 10 && stageType === 0 && direction === 2) {
    return ReplacementAction.TrapdoorDown;
  }

  if (
    (stage === 11 && stageType === 1 && direction === 1) || // The Chest
    (stage === 11 && stageType === 0 && direction === 2) // Dark Room
  ) {
    // Sometimes the vanilla end of challenge trophy does not appear
    // Thus, we need to handle replacing both the trophy and the big chest
    // So replace the big chest with either a checkpoint flag or a custom trophy,
    // depending on if we are on the last character or not
    if (g.speedrun.characterNum === 7) {
      return ReplacementAction.Trophy;
    }

    return ReplacementAction.Checkpoint;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}
*/

/*
function speedrunUp() {
  // Most speedruns go to The Chest and do not require The Polaroid
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  if (stage === 10 && stageType === 1) {
    return ReplacementAction.BeamOfLightUp;
  }

  if (stage === 11 && stageType === 1) {
    if (g.speedrun.characterNum === 7) {
      return ReplacementAction.Trophy;
    }

    return ReplacementAction.Checkpoint;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}
*/

function blueBaby() {
  const roomIndex = getRoomIndex();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  if (
    stage === 11 &&
    stageType === 1 &&
    roomIndex !== GridRooms.ROOM_MEGA_SATAN_IDX
  ) {
    return ReplacementAction.Trophy;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function theLamb() {
  const roomIndex = getRoomIndex();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  if (
    stage === 11 &&
    stageType === 0 &&
    roomIndex !== GridRooms.ROOM_MEGA_SATAN_IDX
  ) {
    return ReplacementAction.Trophy;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function megaSatan() {
  const roomIndex = getRoomIndex();
  const stage = g.l.GetStage();

  if (stage === 11 && roomIndex !== GridRooms.ROOM_MEGA_SATAN_IDX) {
    // We want to delete the Big Chest after Blue Baby or The Lamb
    // to remind the player that they have to go to Mega Satan
    return ReplacementAction.Remove;
  }

  if (
    stage === 11 && // The Chest or the Dark Room
    roomIndex === GridRooms.ROOM_MEGA_SATAN_IDX
  ) {
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
  const antibirthStage = isAntibirthStage();

  if (stage === 8 && antibirthStage) {
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
  const position = g.r.FindFreePickupSpawnPosition(pickup.Position);

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
      Isaac.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_COLLECTIBLE,
        CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT,
        position,
        Vector.Zero,
        null,
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
