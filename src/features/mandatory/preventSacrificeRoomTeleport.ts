import {
  GRID_INDEX_CENTER_OF_1X1_ROOM,
  removeGridEntity,
  saveDataManager,
} from "isaacscript-common";
import g from "../../globals";
import { config } from "../../modConfigMenu";
import { ChallengeCustom } from "../../types/ChallengeCustom";
import { RaceGoal } from "../race/types/RaceGoal";
import { RacerStatus } from "../race/types/RacerStatus";
import { RaceStatus } from "../race/types/RaceStatus";

const NUM_SACRIFICES_FOR_GABRIEL = 11;

const v = {
  level: {
    numSacrifices: 0,
  },
};

export function init(): void {
  saveDataManager("preventSacrificeRoomTeleport", v);
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  checkDeleteSpikes();
}

// ModCallbacksCustom.MC_POST_SACRIFICE
export function postSacrifice(numSacrifices: int): void {
  v.level.numSacrifices = numSacrifices;
  checkDeleteSpikes();
}

function checkDeleteSpikes() {
  if (shouldDeleteSpikes()) {
    const spikes = g.r.GetGridEntity(GRID_INDEX_CENTER_OF_1X1_ROOM);
    if (spikes !== undefined) {
      removeGridEntity(spikes);
    }
  }
}

function shouldDeleteSpikes() {
  const challenge = Isaac.GetChallenge();

  return (
    v.level.numSacrifices >= NUM_SACRIFICES_FOR_GABRIEL &&
    (inRaceToDarkRoom() || challenge === ChallengeCustom.SEASON_2)
  );
}

function inRaceToDarkRoom() {
  return (
    config.clientCommunication &&
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    (g.race.goal === RaceGoal.THE_LAMB || g.race.goal === RaceGoal.MEGA_SATAN)
  );
}
