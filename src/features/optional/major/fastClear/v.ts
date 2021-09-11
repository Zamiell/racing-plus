import { saveDataManager } from "isaacscript-common";
import { config } from "../../../../modConfigMenu";
import FastClearNPCDescription from "../../../../types/FastClearNPCDescription";

const v = {
  room: {
    NPCQueue: [] as FastClearNPCDescription[],
  },
};
export default v;

export function init(): void {
  saveDataManager("fastClear", v, featureEnabled);
}

function featureEnabled() {
  return config.fastClear;
}
