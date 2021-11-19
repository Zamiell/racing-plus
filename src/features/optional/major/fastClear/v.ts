import { saveDataManager } from "isaacscript-common";
import { config } from "../../../../modConfigMenu";

const v = {
  run: {
    currentRoomIndex: null as int | null,
    currentRoomVisitedCount: null as int | null,

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
