import { saveDataManager } from "isaacscript-common";
import { config } from "../../../../modConfigMenu";

const v = {
  room: {
    aliveEnemies: new Set<PtrHash>(),
    delayClearUntilFrame: null as int | null,
    earlyClearedRoom: false,
  },
};
export default v;

export function init(): void {
  saveDataManager("fastClear", v, featureEnabled);
}

function featureEnabled() {
  return config.fastClear;
}
