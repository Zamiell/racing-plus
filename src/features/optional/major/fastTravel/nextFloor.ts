import g from "../../../../globals";
import log from "../../../../log";
import { consoleCommand } from "../../../../util";
import { isAntibirthStage } from "../../../../utilGlobals";

export function goto(upwards: boolean): void {
  // Get the number and type of the next floor
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const nextStage = getNextStage();
  const nextStageType = getNextStageType(stage, stageType, nextStage, upwards);

  // If we do a "stage" command to go to the same floor that we are already on,
  // it will use the same floor layout as the previous floor
  // Thus, in these cases, we need to mark to perform a "reseed" command before doing the "stage"
  // command
  // However, when we travel to the same floor layout from an Antibirth exit,
  // floors do not need to be reseeded for some reason
  g.run.fastTravel.reseed =
    stage === nextStage && !g.run.fastTravel.antibirthSecretExit;

  // Executing a console command to change floors will not increment the "GetStagesWithoutDamage()"
  // variable
  // Thus, we have to set it increment it manually if the player did not take any damage on this
  // floor
  if (!g.run.level.fastTravel.tookDamage) {
    g.g.AddStageWithoutDamage();
    log("Finished this floor without taking any damage.");
  } else {
    log("Finished this floor with damage taken.");
  }

  // Check to see if we need to take extra steps to seed the floor consistently by performing health
  // and inventory modifications
  // seededFloors.before(nextStage); // TODO

  setFloorVariables(stage, stageType);

  // Use the console to manually travel to the floor
  travelStage(nextStage, nextStageType);

  // Revert the health and inventory modifications
  // seededFloors.after(); // TODO
}

function getNextStage() {
  const stage = g.l.GetStage();
  const antibirthStage = isAntibirthStage();

  if (g.g.GetStateFlag(GameStateFlag.STATE_BACKWARDS_PATH)) {
    return getNextStageBackwardsPath(stage, antibirthStage);
  }

  if (
    g.race.status === "in progress" &&
    g.race.myStatus === "racing" &&
    g.race.goal === "The Beast" &&
    !antibirthStage &&
    stage === 6
  ) {
    return stage;
  }

  if (g.run.fastTravel.blueWomb) {
    return 9;
  }

  if (g.run.fastTravel.theVoid) {
    return 12;
  }

  if (g.run.fastTravel.antibirthSecretExit) {
    if (antibirthStage) {
      // e.g. From Downpour 2 to Mines 1
      return stage + 1;
    }

    // e.g. From Basement 2 to Downpour 2
    return stage;
  }

  if (
    antibirthStage &&
    stage === 6 &&
    g.g.GetStateFlag(GameStateFlag.STATE_MAUSOLEUM_HEART_KILLED)
  ) {
    // e.g. From Mausoleum 2 to Corpse 1
    return stage + 1;
  }

  if (antibirthStage && (stage === 2 || stage === 4 || stage === 6)) {
    // e.g. Downpour 2 goes to Caves 2
    return stage + 2;
  }

  if (stage === 8) {
    // If we are not in the Blue Womb entrance room, then we need to skip a floor
    // (since the Blue Womb is floor 9)
    return 10;
  }

  if (stage === 11) {
    // The Chest goes to The Chest
    // The Dark Room goes to the Dark Room
    return 11;
  }

  if (stage === 12) {
    // The Void goes to The Void
    return 12;
  }

  // By default, go to the next floor
  return stage + 1;
}

function getNextStageBackwardsPath(stage: int, antibirthStage: boolean): int {
  if (stage === 1) {
    if (antibirthStage) {
      return stage;
    }

    // e.g. From Basement 1 to Home
    return 13;
  }

  if (stage === 6 && antibirthStage) {
    return stage;
  }

  if (
    stage === 6 &&
    !antibirthStage &&
    (g.run.altFloorsTraveled.ashpit2 || g.run.altFloorsTraveled.mines2)
  ) {
    return stage - 2;
  }

  if (
    stage === 4 &&
    antibirthStage &&
    !g.run.altFloorsTraveled.ashpit1 &&
    !g.run.altFloorsTraveled.mines1
  ) {
    return stage;
  }

  if (
    stage === 4 &&
    !antibirthStage &&
    (g.run.altFloorsTraveled.dross2 || g.run.altFloorsTraveled.downpour2)
  ) {
    return stage - 2;
  }

  if (
    stage === 3 &&
    antibirthStage &&
    !g.run.altFloorsTraveled.dross2 &&
    !g.run.altFloorsTraveled.downpour2
  ) {
    return stage;
  }

  if (
    stage === 2 &&
    antibirthStage &&
    !g.run.altFloorsTraveled.dross1 &&
    !g.run.altFloorsTraveled.downpour1
  ) {
    return stage;
  }

  return stage - 1;
}

function getNextStageType(
  stage: int,
  stageType: int,
  nextStage: int,
  upwards: boolean,
) {
  const antibirthStage = isAntibirthStage();

  if (
    g.race.status === "in progress" &&
    g.race.myStatus === "racing" &&
    g.race.goal === "The Beast" &&
    !antibirthStage &&
    stage === 6 &&
    nextStage === 6
  ) {
    return getStageTypeAntibirth(nextStage);
  }

  // In races to The Beast, spawn the player directly in dark Home
  // since going to Mom's Bed and going back to Dogma is pointless
  if (nextStage === 13) {
    if (
      g.race.status === "in progress" &&
      g.race.myStatus === "racing" &&
      g.race.goal === "The Beast"
    ) {
      return 1;
    }

    return 0;
  }

  if (g.g.GetStateFlag(GameStateFlag.STATE_BACKWARDS_PATH)) {
    return getStageTypeBackwardsPath(stage, nextStage, antibirthStage);
  }

  if (g.run.fastTravel.antibirthSecretExit) {
    return getStageTypeAntibirth(nextStage);
  }

  if (
    antibirthStage &&
    (stage === 1 || stage === 3 || stage === 5 || stage === 7)
  ) {
    return getStageTypeAntibirth(nextStage);
  }

  if (
    antibirthStage &&
    stage === 6 &&
    g.g.GetStateFlag(GameStateFlag.STATE_MAUSOLEUM_HEART_KILLED)
  ) {
    return getStageTypeAntibirth(nextStage);
  }

  if (nextStage === 9) {
    // Blue Womb does not have any alternate floors
    return 0;
  }

  if (nextStage === 10) {
    if (upwards) {
      // Go to Cathedral (10.1)
      return 1;
    }

    // Go to Sheol (10.0)
    return 0;
  }

  if (nextStage === 11) {
    if (stageType === 0) {
      // Sheol (10.0) goes to the Dark Room (11.0)
      return 0;
    }

    // Cathedral (10.1) goes to The Chest (11.1)
    return 1;
  }

  return getStageType(nextStage);
}

function getStageTypeBackwardsPath(
  stage: int,
  nextStage: int,
  antibirthStage: boolean,
): int {
  if (stage === 6 && !antibirthStage) {
    if (g.run.altFloorsTraveled.ashpit2) {
      return StageType.STAGETYPE_REPENTANCE_B;
    }

    if (g.run.altFloorsTraveled.mines2) {
      return StageType.STAGETYPE_REPENTANCE;
    }
  }

  if (stage === 4 && antibirthStage) {
    if (g.run.altFloorsTraveled.ashpit1) {
      return StageType.STAGETYPE_REPENTANCE_B;
    }

    if (g.run.altFloorsTraveled.mines1) {
      return StageType.STAGETYPE_REPENTANCE;
    }
  }

  if (stage === 4 && !antibirthStage) {
    if (g.run.altFloorsTraveled.dross2) {
      return StageType.STAGETYPE_REPENTANCE_B;
    }

    if (g.run.altFloorsTraveled.downpour2) {
      return StageType.STAGETYPE_REPENTANCE;
    }
  }

  if (stage === 3 && antibirthStage) {
    if (g.run.altFloorsTraveled.dross2) {
      return StageType.STAGETYPE_REPENTANCE_B;
    }

    if (g.run.altFloorsTraveled.downpour2) {
      return StageType.STAGETYPE_REPENTANCE;
    }
  }

  if (stage === 2 && antibirthStage) {
    if (g.run.altFloorsTraveled.dross1) {
      return StageType.STAGETYPE_REPENTANCE_B;
    }

    if (g.run.altFloorsTraveled.downpour1) {
      return StageType.STAGETYPE_REPENTANCE;
    }
  }

  return getStageType(nextStage);
}

function getStageTypeAntibirth(stage: int) {
  // There is no alternate floor for Corpse
  if (stage === 7 || stage === 8) {
    return StageType.STAGETYPE_REPENTANCE;
  }

  // This algorithm is from Kilburn
  // We add one because the alt path is offset by 1 relative to the normal path
  const stageSeed = g.seeds.GetStageSeed(stage + 1);

  // Kilburn does not know why he divided the stage seed by 2 first
  const halfStageSeed = Math.floor(stageSeed / 2);
  if (halfStageSeed % 2 === 0) {
    return StageType.STAGETYPE_REPENTANCE_B;
  }

  return StageType.STAGETYPE_REPENTANCE;
}

function getStageType(stage: int) {
  // The following is the game's internal code to determine the floor type
  // (this came directly from Spider)
  /*
    u32 Seed = g_Game->GetSeeds().GetStageSeed(NextStage);
    if (!g_Game->IsGreedMode()) {
      StageType = ((Seed % 2) == 0 && (
        ((NextStage == STAGE1_1 || NextStage == STAGE1_2) && gd.Unlocked(ACHIEVEMENT_CELLAR)) ||
        ((NextStage == STAGE2_1 || NextStage == STAGE2_2) && gd.Unlocked(ACHIEVEMENT_CATACOMBS)) ||
        ((NextStage == STAGE3_1 || NextStage == STAGE3_2) && gd.Unlocked(ACHIEVEMENT_NECROPOLIS)) ||
        ((NextStage == STAGE4_1 || NextStage == STAGE4_2)))
      ) ? STAGETYPE_WOTL : STAGETYPE_ORIGINAL;
    if (Seed % 3 == 0 && NextStage < STAGE5)
      StageType = STAGETYPE_AFTERBIRTH;
  */

  // Emulate what the game's internal code does
  const stageSeed = g.seeds.GetStageSeed(stage);

  if (stageSeed % 2 === 0) {
    return StageType.STAGETYPE_WOTL;
  }

  if (stageSeed % 3 === 0) {
    return StageType.STAGETYPE_AFTERBIRTH;
  }

  return StageType.STAGETYPE_ORIGINAL;
}

function travelStage(stage: int, stageType: int) {
  // Build the command that will take us to the next floor
  let command = `stage ${stage}`;
  if (stageType === StageType.STAGETYPE_WOTL) {
    command += "a";
  } else if (stageType === StageType.STAGETYPE_AFTERBIRTH) {
    command += "b";
  } else if (stageType === StageType.STAGETYPE_REPENTANCE) {
    command += "c";
  } else if (stageType === StageType.STAGETYPE_REPENTANCE_B) {
    command += "d";
  }

  consoleCommand(command);

  if (g.run.fastTravel.reseed) {
    g.run.fastTravel.reseed = false;

    // Doing a "reseed" immediately after a "stage" command won't mess anything up
    consoleCommand("reseed");
  }
}

function setFloorVariables(stage: int, stageType: int) {
  const isBackwardPath = g.g.GetStateFlag(GameStateFlag.STATE_BACKWARDS_PATH);

  if (isBackwardPath) {
    return;
  }

  if (stageType === 4) {
    if (stage === 1) {
      g.run.altFloorsTraveled.downpour1 = true;
    }

    if (stage === 2) {
      g.run.altFloorsTraveled.downpour2 = true;
    }

    if (stage === 3) {
      g.run.altFloorsTraveled.mines1 = true;
    }

    if (stage === 4) {
      g.run.altFloorsTraveled.mines2 = true;
    }
  }

  if (stageType === 5) {
    if (stage === 1) {
      g.run.altFloorsTraveled.dross1 = true;
    }

    if (stage === 2) {
      g.run.altFloorsTraveled.dross2 = true;
    }

    if (stage === 3) {
      g.run.altFloorsTraveled.ashpit1 = true;
    }

    if (stage === 4) {
      g.run.altFloorsTraveled.ashpit2 = true;
    }
  }
}
