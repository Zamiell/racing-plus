import { saveDataManager } from "isaacscript-common";
import { config } from "../../../../modConfigMenu";

const v = {
  run: {
    metKrampus: false,
    seeds: {
      krampus: 0,
      devilSelection: 0,
      devilEntities: 0,
      angelSelection: 0,
      angelEntities: 0,
    },

    /** Other mod features can request that a Devil Room or Angel Room is kept completely empty. */
    intentionallyLeaveEmpty: false,
  },
};
export default v;

export function init(): void {
  saveDataManager("betterDevilAngelRooms", v, featureEnabled);
}

function featureEnabled() {
  return config.betterDevilAngelRooms;
}

export function setDevilAngelEmpty(): void {
  v.run.intentionallyLeaveEmpty = true;
}
