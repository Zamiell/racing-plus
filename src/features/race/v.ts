import { saveDataManager } from "isaacscript-common";
import { config } from "../../modConfigMenu";

const v = {
  run: {
    victoryLaps: 0,
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
