import { saveDataManager } from "isaacscript-common";
import { config } from "../../../../modConfigMenu";
import FastClearNPCDescription from "../../../../types/FastClearNPCDescription";

const v = {
  run: {
    aliveEnemies: new Set<PtrHash>(),
    delayClearUntilFrame: null as int | null,

    /**
     * Set to true when the room frame count is -1 and set to false in the PostNewRoom callback
     * (when the frame count is 0).
     */
    roomInitializing: false,
  },

  room: {
    NPCQueue: [] as FastClearNPCDescription[],
    buttonsAllPushed: false,
  },
};
export default v;

export function init(): void {
  saveDataManager("fastClear", v, featureEnabled);
}

function featureEnabled() {
  return config.fastClear;
}
