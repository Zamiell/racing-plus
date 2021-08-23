import g from "../../globals";
import { removeGridEntity } from "../../utilGlobals";
import RaceGoal from "./types/RaceGoal";
import RacerStatus from "./types/RacerStatus";
import RaceStatus from "./types/RaceStatus";
import v from "./v";

const NUM_SACRIFICES_FOR_GABRIEL = 11;
const INDEX_OF_CENTER_OF_ROOM = 67;

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
    const spikes = g.r.GetGridEntity(INDEX_OF_CENTER_OF_ROOM);
    if (spikes !== null) {
      removeGridEntity(spikes);
    }
  }
}

function shouldDeleteSpikes() {
  return (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    (g.race.goal === RaceGoal.THE_LAMB ||
      g.race.goal === RaceGoal.MEGA_SATAN) &&
    v.level.numSacrifices >= NUM_SACRIFICES_FOR_GABRIEL
  );
}
