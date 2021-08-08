import { saveDataManager } from "isaacscript-common";
import { config } from "../../modConfigMenu";

const v = {
  run: {
    /** Used for Tainted Keeper when racing to the Boss Rush. */
    madeBossRushItemsFree: false,

    numVictoryLaps: 0,
  },
  room: {
    showEndOfRunText: false,
  },
};
export default v;

export function init(): void {
  saveDataManager("race", v, featureEnabled);
}

function featureEnabled() {
  return config.clientCommunication;
}
