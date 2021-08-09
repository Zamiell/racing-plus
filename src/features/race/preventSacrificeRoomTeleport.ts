import g from "../../globals";
import { removeGridEntity } from "../../utilGlobals";
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
    g.race.status === "in progress" &&
    g.race.myStatus === "racing" &&
    (g.race.goal === "The Lamb" || g.race.goal === "Mega Satan") &&
    v.level.numSacrifices >= NUM_SACRIFICES_FOR_GABRIEL
  );
}
