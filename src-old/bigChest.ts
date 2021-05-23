import { ChallengeCustom } from "./challenges/enums";
import { Vector.Zero } from "./constants";
import * as fastTravel from "./features/fastTravel";
import g from "./globals";
import * as misc from "./misc";
import * as sprites from "./sprites";
import { CollectibleTypeCustom, EntityTypeCustom } from "./types/enums";

// Enums
enum Action {
  LEAVE_ALONE,
  TRAPDOOR_DOWN,
  BEAM_OF_LIGHT_UP,
  CHECKPOINT,
  TROPHY,
  VICTORY_LAP,
  REMOVE,
}

// Variables
let action = Action.LEAVE_ALONE;
let checkpointPos = Vector.Zero;

export function postPickupInit(pickup: EntityPickup): void {
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const centerPos = g.r.GetCenterPos();
  const challenge = Isaac.GetChallenge();

  Isaac.DebugString("Big Chest detected.");

  // Since the chest's position is not initialized yet in this callback,
  // manually set it to the center of the room for use in subsequent functions
  pickup.Position = g.r.GetCenterPos();

  // By default, leave the big chest there
  action = Action.LEAVE_ALONE;
  checkpointPos = centerPos;

  // Determine if we should replace the big chest with something else
  if (stage === 10) {
    if (
      stageType === 0 && // Sheol (10.0)
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_NEGATIVE)
    ) {
      action = Action.TRAPDOOR_DOWN;
    } else if (
      stageType === 1 && // Cathedral (10.1)
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_POLAROID)
    ) {
      action = Action.BEAM_OF_LIGHT_UP;
    }
  }

  if (challenge === ChallengeCustom.R9_SEASON_1) {
    S1R9();
  } else if (challenge === ChallengeCustom.R14_SEASON_1) {
    S1R14();
  } else if (challenge === ChallengeCustom.R7_SEASON_2) {
    S2();
  } else if (challenge === ChallengeCustom.R7_SEASON_3) {
    speedrunAlternate();
  } else if (challenge === ChallengeCustom.R7_SEASON_4) {
    speedrunUp();
  } else if (challenge === ChallengeCustom.R7_SEASON_5) {
    speedrunUp();
  } else if (challenge === ChallengeCustom.R7_SEASON_6) {
    speedrunAlternate();
  } else if (challenge === ChallengeCustom.R7_SEASON_7) {
    S7();
  } else if (challenge === ChallengeCustom.R7_SEASON_8) {
    speedrunUp();
  } else if (challenge === ChallengeCustom.R7_SEASON_9) {
    speedrunUp();
  } else if (challenge === ChallengeCustom.R15_VANILLA) {
    speedrunVanilla();
  } else if (g.raceVars.finished) {
    action = Action.VICTORY_LAP;
  } else if (g.race.rFormat === "pageant") {
    pageant();
  } else if (g.race.goal === "Blue Baby" && g.raceVars.started) {
    blueBaby();
  } else if (g.race.goal === "The Lamb" && g.raceVars.started) {
    theLamb();
  } else if (g.race.goal === "Mega Satan" && g.raceVars.started) {
    megaSatan();
  } else if (g.race.goal === "Hush" && g.raceVars.started) {
    hush();
  } else if (g.race.goal === "Delirium" && g.raceVars.started) {
    delirium();
  } else if (g.race.goal === "Boss Rush" && g.raceVars.started) {
    bossRush();
  } else if (g.race.goal === "Everything" && g.raceVars.started) {
    everything();
  } else if (
    stage === 10 &&
    stageType === 0 && // Sheol (10.0)
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_NEGATIVE)
  ) {
    // Leave the big chest there if the player does not have The Negative
    action = Action.TRAPDOOR_DOWN;
  } else if (
    stage === 10 &&
    stageType === 1 && // Cathedral (10.1)
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_POLAROID)
  ) {
    // Leave the big chest there if the player does not have The Polaroid
    action = Action.BEAM_OF_LIGHT_UP;
  }

  // Now that we know what to do with the big chest, do it
  doBigChestReplacement(pickup);
}

function doBigChestReplacement(pickup: EntityPickup) {
  const stage = g.l.GetStage();
  const roomType = g.r.GetType();
  const roomSeed = g.r.GetSpawnSeed();
  const roomIndex = misc.getRoomIndex();

  switch (action) {
    case Action.LEAVE_ALONE: {
      // Set a flag so that we leave it alone on the next frame
      pickup.Touched = true;

      break;
    }

    case Action.TRAPDOOR_DOWN: {
      // Delete the chest and replace it with a trapdoor so that we can fast-travel normally
      fastTravel.trapdoor.replace(pickup, -1);
      // (a -1 indicates that we are replacing an entity instead of a grid entity)

      break;
    }

    case Action.BEAM_OF_LIGHT_UP: {
      // Delete the chest and replace it with a beam of light so that we can fast-travel normally
      pickup.SpawnerType = EntityType.ENTITY_PLAYER;
      fastTravel.heavenDoor.replace(pickup);

      break;
    }

    case Action.CHECKPOINT: {
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_COLLECTIBLE,
        checkpointPos,
        Vector.Zero,
        null,
        CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT,
        roomSeed,
      );
      g.speedrun.spawnedCheckpoint = true;
      pickup.Remove();

      break;
    }

    case Action.TROPHY: {
      // Spawn the end of race/speedrun trophy
      let position = g.r.GetCenterPos();
      if (roomType === RoomType.ROOM_BOSSRUSH) {
        // In some Boss Rush rooms, the center of the room will be covered by rocks or pits
        position = g.r.FindFreePickupSpawnPosition(position, 1, true);
      }
      Isaac.Spawn(
        EntityTypeCustom.ENTITY_RACE_TROPHY,
        0,
        0,
        position,
        Vector.Zero,
        null,
      );
      pickup.Remove();

      // Keep track that we spawned it so that we can respawn it if the player re-enters the room
      g.run.trophy.spawned = true;
      g.run.trophy.stage = stage;
      g.run.trophy.roomIndex = roomIndex;
      g.run.trophy.position = position;

      break;
    }

    case Action.VICTORY_LAP: {
      // Spawn a button for the Victory Lap feature
      // We want to use a position from the "GridToPos()" function because otherwise the position
      // can slightly shift if it does not align with the grid
      let position = misc.gridToPos(6, 3);
      if (roomIndex === GridRooms.ROOM_MEGA_SATAN_IDX) {
        position = misc.gridToPos(6, 9);
      }

      g.run.level.buttons.push({
        type: "victory-lap",
        pos: position,
        roomIndex,
      });
      Isaac.GridSpawn(GridEntityType.GRID_PRESSURE_PLATE, 0, position, true);
      sprites.init("victory-lap-button", "victory-lap-button");
      pickup.Remove();

      break;
    }

    case Action.REMOVE: {
      pickup.Remove();
      break;
    }

    default: {
      ensureAllCases()
      break;
    }
  }
}

function S1R9() {
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  if (stage === 11 && stageType === 1) {
    // The Chest (11.1)
    if (g.speedrun.characterNum === 9) {
      action = Action.TROPHY;
    } else {
      action = Action.CHECKPOINT;
    }
  }
}

function S1R14() {
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  if (stage === 11 && stageType === 1) {
    // The Chest (11.1)
    if (g.speedrun.characterNum === 14) {
      action = Action.TROPHY;
    } else {
      action = Action.CHECKPOINT;
    }
  }
}

function S2() {
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  if (stage === 10 && stageType === 0) {
    // Sheol (10.0)
    // The Negative is optional in this season
    action = Action.TRAPDOOR_DOWN;
  } else if (stage === 11 && stageType === 0) {
    // Dark Room (11.0)
    // Sometimes the vanilla end of challenge trophy does not appear
    // Thus, we need to handle replacing both the trophy and the big chest
    // So replace the big chest with either a checkpoint flag or a custom trophy,
    // depending on if we are on the last character or not
    if (g.speedrun.characterNum === 7) {
      action = Action.TROPHY;
    } else {
      action = Action.CHECKPOINT;
    }
  }
}

function speedrunAlternate() {
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  // Some seasons alternate between directions,
  // so we need to make sure we only handle the intended direction
  let direction = g.speedrun.characterNum % 2; // 1 is up, 2 is down
  if (direction === 0) {
    direction = 2;
  }

  // The Polaroid / The Negative is optional in seasons that alternate direction
  if (
    stage === 10 &&
    stageType === 1 && // Cathedral
    direction === 1
  ) {
    action = Action.BEAM_OF_LIGHT_UP;
  } else if (
    stage === 10 &&
    stageType === 0 && // Sheol
    direction === 2
  ) {
    action = Action.TRAPDOOR_DOWN;
  } else if (
    (stage === 11 && stageType === 1 && direction === 1) || // The Chest
    (stage === 11 && stageType === 0 && direction === 2) // Dark Room
  ) {
    // Sometimes the vanilla end of challenge trophy does not appear
    // Thus, we need to handle replacing both the trophy and the big chest
    // So replace the big chest with either a checkpoint flag or a custom trophy,
    // depending on if we are on the last character or not
    if (g.speedrun.characterNum === 7) {
      action = Action.TROPHY;
    } else {
      action = Action.CHECKPOINT;
    }
  }
}

function speedrunUp() {
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  if (stage === 10 && stageType === 1) {
    // Cathedral
    // The Polaroid / The Negative is optional in most seasons
    action = Action.BEAM_OF_LIGHT_UP;
  } else if (stage === 11 && stageType === 1) {
    // The Chest
    if (g.speedrun.characterNum === 7) {
      action = Action.TROPHY;
    } else {
      action = Action.CHECKPOINT;
    }
  }
}

function S7() {
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const roomIndexUnsafe = g.l.GetCurrentRoomIndex();

  // Season 7 runs must complete every goal
  // The Polaroid / The Negative are ! optional in this season
  if (
    (stage === 6 && g.season7.remainingGoals.includes("Boss Rush")) ||
    (stage === 8 && g.season7.remainingGoals.includes("It Lives!")) ||
    (stage === 9 && g.season7.remainingGoals.includes("Hush")) ||
    (stage === 11 &&
      roomIndexUnsafe === GridRooms.ROOM_MEGA_SATAN_IDX &&
      g.season7.remainingGoals.includes("Mega Satan")) ||
    (stage === 11 &&
      roomIndexUnsafe !== GridRooms.ROOM_MEGA_SATAN_IDX &&
      stageType === 1 &&
      g.season7.remainingGoals.includes("Blue Baby")) ||
    (stage === 11 &&
      roomIndexUnsafe !== GridRooms.ROOM_MEGA_SATAN_IDX &&
      stageType === 0 &&
      g.season7.remainingGoals.includes("The Lamb")) ||
    (stage === 12 &&
      roomIndexUnsafe === g.run.customBossRoomIndex &&
      g.season7.remainingGoals.includes("Ultra Greed"))
  ) {
    if (g.speedrun.characterNum === 7) {
      action = Action.TROPHY;
    } else {
      action = Action.CHECKPOINT;
    }
  }

  if (stage === 6) {
    // Prevent the bug where the Checkpoint can spawn over a pit
    checkpointPos = g.r.FindFreePickupSpawnPosition(checkpointPos, 0, true);
  } else if (stage === 8) {
    // Put the Checkpoint in the corner of the room so that it does not interfere with the path to
    // the next floor
    checkpointPos = misc.gridToPos(1, 1);
  }
}

function speedrunVanilla() {
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  if (stage === 11 && stageType === 1) {
    // The Chest
    if (g.speedrun.characterNum === 15) {
      action = Action.TROPHY;
    } else {
      action = Action.CHECKPOINT;
    }
  }
}

function pageant() {
  const stage = g.l.GetStage();

  if (stage === 11) {
    // The Chest or the Dark Room
    // We want to delete all big chests on the Pageant Boy ruleset so that
    // you don't accidentally end your run before you can show off your build to the judges
    action = Action.REMOVE;
  }
}

function blueBaby() {
  const roomIndex = misc.getRoomIndex();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  if (
    stage === 11 &&
    stageType === 1 && // The Chest
    roomIndex !== GridRooms.ROOM_MEGA_SATAN_IDX
  ) {
    action = Action.TROPHY;
  }
}

function theLamb() {
  const roomIndex = misc.getRoomIndex();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  if (
    stage === 11 &&
    stageType === 0 && // Dark Room
    roomIndex !== GridRooms.ROOM_MEGA_SATAN_IDX
  ) {
    action = Action.TROPHY;
  }
}

function everything() {
  const roomIndex = misc.getRoomIndex();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  if (stage === 10 && stageType === 1) {
    // Cathedral goes to Sheol
    action = Action.TRAPDOOR_DOWN;
  } else if (stage === 10 && stageType === 0) {
    // Sheol goes to The Chest
    action = Action.BEAM_OF_LIGHT_UP;
  } else if (stage === 11 && stageType === 1) {
    // The Chest goes to the Dark Room
    action = Action.TRAPDOOR_DOWN;
  } else if (stage === 11 && stageType === 0) {
    if (roomIndex !== GridRooms.ROOM_MEGA_SATAN_IDX) {
      action = Action.REMOVE;
    } else {
      action = Action.TROPHY;
    }
  }
}

function megaSatan() {
  const roomIndex = misc.getRoomIndex();
  const stage = g.l.GetStage();

  if (
    stage === 11 && // The Chest or the Dark Room
    roomIndex !== GridRooms.ROOM_MEGA_SATAN_IDX
  ) {
    // We want to delete the big chest after Blue Baby or The Lamb
    // to remind the player that they have to go to Mega Satan
    action = Action.REMOVE;
  } else if (
    stage === 11 && // The Chest or the Dark Room
    roomIndex === GridRooms.ROOM_MEGA_SATAN_IDX
  ) {
    action = Action.TROPHY;
  }
}

function hush() {
  const stage = g.l.GetStage();

  if (stage === 9) {
    action = Action.TROPHY;
  }
}

function delirium() {
  const stage = g.l.GetStage();

  if (stage === 12) {
    action = Action.TROPHY;
  }
}

function bossRush() {
  const stage = g.l.GetStage();

  if (stage === 6) {
    action = Action.TROPHY;
  }
}
