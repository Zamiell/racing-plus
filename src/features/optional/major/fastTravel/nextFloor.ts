import {
  EntityType,
  GameStateFlag,
  LevelStage,
  NullItemID,
  StageType,
} from "isaac-typescript-definitions";
import {
  getPlayers,
  onRepentanceStage,
  removeAllMatchingEntities,
} from "isaacscript-common";
import { RaceGoal } from "../../../../enums/RaceGoal";
import { RacerStatus } from "../../../../enums/RacerStatus";
import { RaceStatus } from "../../../../enums/RaceStatus";
import g from "../../../../globals";
import { consoleCommand } from "../../../../utils";
import * as seededFloors from "../../../mandatory/seededFloors";
import { setDreamCatcherArrivedOnNewFloor } from "../../quality/showDreamCatcherItem/v";
import v from "./v";

export function goto(upwards: boolean): void {
  // Get the number and type of the next floor.
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const nextStage = getNextStage();
  const nextStageType = getNextStageType(stage, stageType, nextStage, upwards);

  // The effect of Reverse Empress cards are supposed to end after one minute passive. However,
  // taking away the health and re-adding it will cause the extra two red heart containers to not be
  // removed properly once the minute ends. Thus, we cut the effect short now.
  for (const player of getPlayers()) {
    const effects = player.GetEffects();
    effects.RemoveNullEffect(NullItemID.REVERSE_EMPRESS);
  }

  // The effect of Reverse Sun cards are supposed to end upon reaching a new floor, so we can remove
  // the effect now so that it will not interfere with the recording of the player's current health.
  for (const player of getPlayers()) {
    const effects = player.GetEffects();
    effects.RemoveNullEffect(NullItemID.REVERSE_SUN);
  }

  // If Tainted Jacob loses Anime Sola for any reason, it can cause multiple Dark Esau's to spawn
  // upon reaching a new floor. Since Dark Esau is never supposed to persist between floors, we can
  // safely remove all Dark Esau entities at this point.
  removeAllMatchingEntities(EntityType.DARK_ESAU);

  // If we do a "stage" command to go to the same floor that we are already on, it will use the same
  // floor layout as the previous floor. Thus, in these cases, we need to mark to perform a "reseed"
  // command after doing the "stage" command. However, when we travel to the same floor layout from
  // a Repentance exit, floors do not need to be reseeded for some reason.
  v.run.reseed = stage === nextStage && !v.run.repentanceSecretExit;

  // The fast-travel feature prevents the Perfection trinket from spawning. Using the
  // "WithoutDamage" methods of the Game class do not work properly, so we revert to keeping track
  // of damage manually.
  if (!v.level.tookDamage) {
    v.run.perfection.floorsWithoutDamage += 1;
  }

  setFloorVariables(stage, stageType);

  // Check to see if we need to take extra steps to seed the floor consistently by performing health
  // and inventory modifications.
  seededFloors.before();

  // Use the console to manually travel to the floor.
  travelStage(nextStage, nextStageType);

  // Revert the health and inventory modifications.
  seededFloors.after();

  // Now that we have arrived on the new floor, we might need to perform a Dream Catcher warp.
  setDreamCatcherArrivedOnNewFloor();
}

function getNextStage(): LevelStage {
  const stage = g.l.GetStage();
  const repentanceStage = onRepentanceStage();
  const backwardsPathInit = g.g.GetStateFlag(GameStateFlag.BACKWARDS_PATH_INIT);
  const backwardsPath = g.g.GetStateFlag(GameStateFlag.BACKWARDS_PATH);
  const mausoleumHeartKilled = g.g.GetStateFlag(
    GameStateFlag.MAUSOLEUM_HEART_KILLED,
  );

  if (backwardsPath) {
    return getNextStageBackwardsPath(stage, repentanceStage);
  }

  if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.goal === RaceGoal.THE_BEAST &&
    stage === LevelStage.DEPTHS_2 &&
    !repentanceStage &&
    backwardsPathInit
  ) {
    return stage;
  }

  if (v.run.blueWomb) {
    return LevelStage.BLUE_WOMB;
  }

  if (v.run.theVoid) {
    return LevelStage.THE_VOID;
  }

  if (v.run.repentanceSecretExit) {
    if (repentanceStage) {
      // e.g. From Downpour 2 to Mines 1
      return (stage as int) + 1;
    }

    // e.g. From Basement 1 to Downpour 1 or from Basement 2 to Downpour 2
    return stage;
  }

  if (
    stage === LevelStage.DEPTHS_2 &&
    repentanceStage &&
    mausoleumHeartKilled
  ) {
    // e.g. From Mausoleum 2 to Corpse 1
    return (stage as int) + 1;
  }

  if (
    (stage === LevelStage.BASEMENT_2 ||
      stage === LevelStage.CAVES_2 ||
      stage === LevelStage.DEPTHS_2) &&
    repentanceStage
  ) {
    // e.g. Downpour 2 goes to Caves 2
    return (stage as int) + 2;
  }

  if (stage === LevelStage.WOMB_2) {
    // If we are not in the Blue Womb entrance room, then we need to skip a floor (since the Blue
    // Womb is floor 9).
    return 10;
  }

  if (stage === LevelStage.DARK_ROOM_CHEST) {
    // - The Chest goes to The Chest.
    // - The Dark Room goes to the Dark Room.
    return 11;
  }

  if (stage === LevelStage.THE_VOID) {
    // The Void goes to The Void.
    return 12;
  }

  // By default, go to the next floor.
  return (stage as int) + 1;
}

function getNextStageBackwardsPath(
  stage: LevelStage,
  repentanceStage: boolean,
): LevelStage {
  if (stage === LevelStage.BASEMENT_1) {
    if (repentanceStage) {
      return stage;
    }

    // e.g. From Basement 1 to Home
    return LevelStage.HOME;
  }

  if (stage === LevelStage.DEPTHS_2 && repentanceStage) {
    return stage;
  }

  if (
    stage === LevelStage.DEPTHS_2 &&
    !repentanceStage &&
    (v.run.repentanceFloorsVisited.ashpit2 ||
      v.run.repentanceFloorsVisited.mines2)
  ) {
    return (stage as int) - 2;
  }

  if (
    stage === LevelStage.CAVES_2 &&
    repentanceStage &&
    !v.run.repentanceFloorsVisited.ashpit1 &&
    !v.run.repentanceFloorsVisited.mines1
  ) {
    return stage;
  }

  if (
    stage === LevelStage.CAVES_2 &&
    !repentanceStage &&
    (v.run.repentanceFloorsVisited.dross2 ||
      v.run.repentanceFloorsVisited.downpour2)
  ) {
    return (stage as int) - 2;
  }

  if (
    stage === LevelStage.CAVES_1 &&
    repentanceStage &&
    !v.run.repentanceFloorsVisited.dross2 &&
    !v.run.repentanceFloorsVisited.downpour2
  ) {
    return stage;
  }

  if (
    stage === LevelStage.BASEMENT_2 &&
    repentanceStage &&
    !v.run.repentanceFloorsVisited.dross1 &&
    !v.run.repentanceFloorsVisited.downpour1
  ) {
    return stage;
  }

  return (stage as int) - 1;
}

function getNextStageType(
  stage: LevelStage,
  stageType: StageType,
  nextStage: LevelStage,
  upwards: boolean,
): StageType {
  const repentanceStage = onRepentanceStage();

  if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.goal === RaceGoal.THE_BEAST &&
    !repentanceStage &&
    stage === LevelStage.DEPTHS_2 &&
    nextStage === LevelStage.DEPTHS_2
  ) {
    return getStageTypeRepentance(nextStage);
  }

  // In races to The Beast, spawn the player directly in Dark Home since going to Mom's Bed and
  // going back to Dogma is pointless.
  if (nextStage === LevelStage.HOME) {
    if (
      g.race.status === RaceStatus.IN_PROGRESS &&
      g.race.myStatus === RacerStatus.RACING &&
      g.race.goal === RaceGoal.THE_BEAST
    ) {
      return 1;
    }

    return 0;
  }

  if (g.g.GetStateFlag(GameStateFlag.BACKWARDS_PATH)) {
    return getStageTypeBackwardsPath(stage, nextStage, repentanceStage);
  }

  if (v.run.repentanceSecretExit) {
    return getStageTypeRepentance(nextStage);
  }

  if (
    repentanceStage &&
    (stage === LevelStage.BASEMENT_1 ||
      stage === LevelStage.CAVES_1 ||
      stage === LevelStage.DEPTHS_1 ||
      stage === LevelStage.WOMB_1)
  ) {
    return getStageTypeRepentance(nextStage);
  }

  if (
    repentanceStage &&
    stage === LevelStage.DEPTHS_2 &&
    g.g.GetStateFlag(GameStateFlag.MAUSOLEUM_HEART_KILLED)
  ) {
    return getStageTypeRepentance(nextStage);
  }

  if (nextStage === LevelStage.BLUE_WOMB) {
    // Blue Womb does not have any alternate floors.
    return 0;
  }

  if (nextStage === LevelStage.SHEOL_CATHEDRAL) {
    if (upwards) {
      // Go to Cathedral (10.1).
      return 1;
    }

    // Go to Sheol (10.0).
    return 0;
  }

  if (nextStage === LevelStage.DARK_ROOM_CHEST) {
    if (stageType === StageType.ORIGINAL) {
      // Sheol (10.0) goes to the Dark Room (11.0).
      return 0;
    }

    // Cathedral (10.1) goes to The Chest (11.1).
    return 1;
  }

  return getStageType(nextStage);
}

function getStageTypeBackwardsPath(
  stage: LevelStage,
  nextStage: LevelStage,
  repentanceStage: boolean,
): StageType {
  if (stage === LevelStage.DEPTHS_2 && !repentanceStage) {
    if (v.run.repentanceFloorsVisited.ashpit2) {
      return StageType.REPENTANCE_B;
    }

    if (v.run.repentanceFloorsVisited.mines2) {
      return StageType.REPENTANCE;
    }
  }

  if (stage === LevelStage.CAVES_2 && repentanceStage) {
    if (v.run.repentanceFloorsVisited.ashpit1) {
      return StageType.REPENTANCE_B;
    }

    if (v.run.repentanceFloorsVisited.mines1) {
      return StageType.REPENTANCE;
    }
  }

  if (stage === LevelStage.CAVES_2 && !repentanceStage) {
    if (v.run.repentanceFloorsVisited.dross2) {
      return StageType.REPENTANCE_B;
    }

    if (v.run.repentanceFloorsVisited.downpour2) {
      return StageType.REPENTANCE;
    }
  }

  if (stage === LevelStage.CAVES_1 && repentanceStage) {
    if (v.run.repentanceFloorsVisited.dross2) {
      return StageType.REPENTANCE_B;
    }

    if (v.run.repentanceFloorsVisited.downpour2) {
      return StageType.REPENTANCE;
    }
  }

  if (stage === LevelStage.BASEMENT_2 && repentanceStage) {
    if (v.run.repentanceFloorsVisited.dross1) {
      return StageType.REPENTANCE_B;
    }

    if (v.run.repentanceFloorsVisited.downpour1) {
      return StageType.REPENTANCE;
    }
  }

  return getStageType(nextStage);
}

function getStageTypeRepentance(stage: LevelStage): StageType {
  // There is no alternate floor for Corpse.
  if (stage === LevelStage.WOMB_1 || stage === LevelStage.WOMB_2) {
    return StageType.REPENTANCE;
  }

  // This algorithm is from Kilburn. We add one because the alt path is offset by 1 relative to the
  // normal path.
  const adjustedStage = ((stage as int) + 1) as LevelStage;
  const stageSeed = g.seeds.GetStageSeed(adjustedStage);

  // Kilburn does not know why he divided the stage seed by 2 first.
  const halfStageSeed = Math.floor(stageSeed / 2);
  if (halfStageSeed % 2 === 0) {
    return StageType.REPENTANCE_B;
  }

  return StageType.REPENTANCE;
}

function getStageType(stage: LevelStage): StageType {
  // The following is the game's internal code to determine the floor type. (This came directly from
  // Spider.)
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

  // Emulate what the game's internal code does.
  const stageSeed = g.seeds.GetStageSeed(stage);

  if (stageSeed % 2 === 0) {
    return StageType.WRATH_OF_THE_LAMB;
  }

  if (stageSeed % 3 === 0) {
    return StageType.AFTERBIRTH;
  }

  return StageType.ORIGINAL;
}

function travelStage(stage: LevelStage, stageType: StageType) {
  // Build the command that will take us to the next floor.
  let command = `stage ${stage}`;
  if (stageType === StageType.WRATH_OF_THE_LAMB) {
    command += "a";
  } else if (stageType === StageType.AFTERBIRTH) {
    command += "b";
  } else if (stageType === StageType.REPENTANCE) {
    command += "c";
  } else if (stageType === StageType.REPENTANCE_B) {
    command += "d";
  }

  consoleCommand(command);

  if (v.run.reseed) {
    v.run.reseed = false;

    // Doing a "reseed" immediately after a "stage" command won't mess anything up.
    consoleCommand("reseed");
  }
}

function setFloorVariables(stage: LevelStage, stageType: StageType) {
  const isBackwardPath = g.g.GetStateFlag(GameStateFlag.BACKWARDS_PATH);

  if (isBackwardPath) {
    return;
  }

  if (stageType === StageType.REPENTANCE) {
    if (stage === LevelStage.BASEMENT_1) {
      v.run.repentanceFloorsVisited.downpour1 = true;
    }

    if (stage === LevelStage.BASEMENT_2) {
      v.run.repentanceFloorsVisited.downpour2 = true;
    }

    if (stage === LevelStage.CAVES_1) {
      v.run.repentanceFloorsVisited.mines1 = true;
    }

    if (stage === LevelStage.CAVES_2) {
      v.run.repentanceFloorsVisited.mines2 = true;
    }
  }

  if (stageType === StageType.REPENTANCE_B) {
    if (stage === LevelStage.BASEMENT_1) {
      v.run.repentanceFloorsVisited.dross1 = true;
    }

    if (stage === LevelStage.BASEMENT_2) {
      v.run.repentanceFloorsVisited.dross2 = true;
    }

    if (stage === LevelStage.CAVES_1) {
      v.run.repentanceFloorsVisited.ashpit1 = true;
    }

    if (stage === LevelStage.CAVES_2) {
      v.run.repentanceFloorsVisited.ashpit2 = true;
    }
  }
}
