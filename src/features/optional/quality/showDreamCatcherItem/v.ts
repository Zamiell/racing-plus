import { PlayerHealth, saveDataManager } from "isaacscript-common";
import { DreamCatcherWarpState } from "../../../../enums/DreamCatcherWarpState";
import { config } from "../../../../modConfigMenu";

export const DREAM_CATCHER_FEATURE_NAME = "showDreamCatcherItem";

const v = {
  level: {
    warpState: DreamCatcherWarpState.INITIAL,
    warpRoomGridIndexes: [] as int[],
    displayFlagsMap: new Map<int, int>(),
    cardReadingPortalDescriptions: [] as Array<[int, Vector]>,
    health: null as PlayerHealth | null,

    collectibles: [] as CollectibleType[],

    /** Bosses are stored as an array of: [entityType, variant] */
    bosses: [] as Array<[int, int]>,

    /** Used so that the fast-travel feature can communicate with this feature. */
    arrivedOnNewFloor: false,
  },
};
export default v;

export function init(): void {
  saveDataManager(DREAM_CATCHER_FEATURE_NAME, v, featureEnabled);
}

function featureEnabled() {
  return config.showDreamCatcherItem;
}

export function isDreamCatcherWarping(): boolean {
  return v.level.warpState === DreamCatcherWarpState.WARPING;
}

export function setDreamCatcherArrivedOnNewFloor(): void {
  v.level.arrivedOnNewFloor = true;
}
