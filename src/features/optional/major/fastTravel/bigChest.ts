import g from "../../../../globals";
import { ensureAllCases, getRoomIndex } from "../../../../misc";
import {
  CollectibleTypeCustom,
  EntityTypeCustom,
} from "../../../../types/enums";
import { ChallengeCustom } from "../../../speedrun/enums";

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
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_NEGATIVE)
  ) {
    return ReplacementAction.TrapdoorDown;
  }

  if (
    stage === 10 &&
    stageType === 1 &&
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_POLAROID)
  ) {
    return ReplacementAction.BeamOfLightUp;
  }

  if (challenge === ChallengeCustom.SEASON_1) {
    return season1();
  }

  if (g.race.finished) {
    return ReplacementAction.VictoryLap;
  }

  if (g.race.goal === "Blue Baby" && g.race.status === "in progress") {
    return blueBaby();
  }

  if (g.race.goal === "The Lamb" && g.race.status === "in progress") {
    return theLamb();
  }

  if (g.race.goal === "Mega Satan" && g.race.status === "in progress") {
    return megaSatan();
  }

  if (g.race.goal === "Hush" && g.race.status === "in progress") {
    return hush();
  }

  if (g.race.goal === "Delirium" && g.race.status === "in progress") {
    return delirium();
  }

  if (g.race.goal === "Boss Rush" && g.race.status === "in progress") {
    return bossRush();
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

function bossRush() {
  const stage = g.l.GetStage();

  if (stage === 6) {
    return ReplacementAction.Trophy;
  }

  return DEFAULT_REPLACEMENT_ACTION;
}

function replace(pickup: EntityPickup, replacementAction: ReplacementAction) {
  const roomIndex = getRoomIndex();
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
      Isaac.Spawn(
        EntityType.ENTITY_EFFECT,
        EffectVariant.HEAVEN_LIGHT_DOOR,
        0,
        position,
        Vector.Zero,
        null,
      );
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
      Isaac.Spawn(
        EntityTypeCustom.ENTITY_RACE_TROPHY,
        0,
        0,
        position,
        Vector.Zero,
        null,
      );

      // Keep track that we spawned it so that we can respawn it if the player re-enters the room
      g.run.level.trophy = {
        roomIndex,
        position,
      };

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
