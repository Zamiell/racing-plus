import { saveDataManager } from "isaacscript-common";
import { config } from "../../../../modConfigMenu";
import { DreamCatcherWarpState } from "../../../../types/DreamCatcherWarpState";

const v = {
  level: {
    items: [] as CollectibleType[],

    /** Bosses are stored as an array of: [entityType, variant] */
    bosses: [] as Array<[int, int]>,

    warpState: DreamCatcherWarpState.INITIAL,
  },
};
export default v;

export function init(): void {
  saveDataManager("showDreamCatcherItem", v, featureEnabled);
}

function featureEnabled() {
  return config.showDreamCatcherItem;
}
