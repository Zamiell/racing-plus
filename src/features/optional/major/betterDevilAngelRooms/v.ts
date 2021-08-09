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
  },
};
export default v;

export function init(): void {
  saveDataManager("betterDevilAngelRooms", v, featureEnabled);
}

function featureEnabled() {
  return config.betterDevilAngelRooms;
}
