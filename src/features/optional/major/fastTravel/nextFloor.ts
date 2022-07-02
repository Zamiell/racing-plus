import {
  EntityType,
  GameStateFlag,
  LevelStage,
  NullItemID,
  StageType,
} from "isaac-typescript-definitions";
import {
  calculateStageTypeRepentance,
  getNextStage,
  getNextStageType,
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

  // We use custom functions to handle Racing+ specific logic for floor travel.
  const nextStage = getNextStageCustom();
  const nextStageType = getNextStageTypeCustom(upwards);

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
  travelStage(nextStage, nextStageType, v.run.reseed);
  v.run.reseed = false;

  // Revert the health and inventory modifications.
  seededFloors.after();

  // Now that we have arrived on the new floor, we might need to perform a Dream Catcher warp.
  setDreamCatcherArrivedOnNewFloor();
}

function getNextStageCustom() {
  const stage = g.l.GetStage();
  const backwardsPathInit = g.g.GetStateFlag(GameStateFlag.BACKWARDS_PATH_INIT);
  const repentanceStage = onRepentanceStage();

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

  return getNextStage();
}

function getNextStageTypeCustom(upwards: boolean) {
  const stage = g.l.GetStage();
  const repentanceStage = onRepentanceStage();
  const nextStage = getNextStage();

  if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.goal === RaceGoal.THE_BEAST &&
    !repentanceStage &&
    stage === LevelStage.DEPTHS_2 &&
    nextStage === LevelStage.DEPTHS_2
  ) {
    return calculateStageTypeRepentance(nextStage);
  }

  // In races to The Beast, spawn the player directly in Dark Home since going to Mom's Bed and
  // going back to Dogma is pointless.
  if (nextStage === LevelStage.HOME) {
    if (
      g.race.status === RaceStatus.IN_PROGRESS &&
      g.race.myStatus === RacerStatus.RACING &&
      g.race.goal === RaceGoal.THE_BEAST
    ) {
      return StageType.WRATH_OF_THE_LAMB;
    }

    return StageType.ORIGINAL;
  }

  return getNextStageType(upwards);
}

function travelStage(stage: LevelStage, stageType: StageType, reseed = false) {
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

  if (reseed) {
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
