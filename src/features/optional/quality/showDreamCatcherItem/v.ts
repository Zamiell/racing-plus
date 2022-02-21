import { saveDataManager } from "isaacscript-common";
import { config } from "../../../../modConfigMenu";
import { DreamCatcherWarpState } from "../../../../types/DreamCatcherWarpState";

const v = {
  level: {
    warpState: DreamCatcherWarpState.INITIAL,
    warpRoomGridIndexes: [] as int[],
    displayFlagsMap: new Map<int, int>(),
    cardReadingPortalDescriptions: [] as Array<[int, Vector]>,

    collectibles: [] as CollectibleType[],

    /** Bosses are stored as an array of: [entityType, variant] */
    bosses: [] as Array<[int, int]>,
  },
};
export default v;

export function init(): void {
  saveDataManager("showDreamCatcherItem", v, featureEnabled);
}

function featureEnabled() {
  return config.showDreamCatcherItem;
}

export function isDreamCatcherWarping(): boolean {
  return v.level.warpState === DreamCatcherWarpState.WARPING;
}
