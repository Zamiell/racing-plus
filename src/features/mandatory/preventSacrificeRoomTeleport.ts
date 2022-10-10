import {
  GRID_INDEX_CENTER_OF_1X1_ROOM,
  removeGridEntity,
} from "isaacscript-common";
import { RaceGoal } from "../../enums/RaceGoal";
import { RacerStatus } from "../../enums/RacerStatus";
import { RaceStatus } from "../../enums/RaceStatus";
import g from "../../globals";
import { mod } from "../../mod";
import { config } from "../../modConfigMenu";
import { inSpeedrun, onSpeedrunWithDarkRoomGoal } from "../speedrun/speedrun";

const NUM_SACRIFICES_FOR_GABRIEL = 11;

const v = {
  level: {
    numSacrifices: 0,
  },
};

export function init(): void {
  mod.saveDataManager("preventSacrificeRoomTeleport", v);
}

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  checkDeleteSpikes();
}

// ModCallbackCustom.POST_SACRIFICE
export function postSacrifice(numSacrifices: int): void {
  v.level.numSacrifices = numSacrifices;
  checkDeleteSpikes();
}

function checkDeleteSpikes() {
  if (shouldDeleteSpikes()) {
    const spikes = g.r.GetGridEntity(GRID_INDEX_CENTER_OF_1X1_ROOM);
    if (spikes !== undefined) {
      removeGridEntity(spikes, false);
    }
  }
}

function shouldDeleteSpikes() {
  return (
    v.level.numSacrifices >= NUM_SACRIFICES_FOR_GABRIEL &&
    (inRaceToDarkRoom() || (inSpeedrun() && onSpeedrunWithDarkRoomGoal()))
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
