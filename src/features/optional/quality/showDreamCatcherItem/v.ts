import {
  CollectibleType,
  DisplayFlag,
  EntityType,
} from "isaac-typescript-definitions";
import { PlayerHealth, saveDataManager } from "isaacscript-common";
import { DreamCatcherWarpState } from "../../../../enums/DreamCatcherWarpState";
import { config } from "../../../../modConfigMenu";

export const DREAM_CATCHER_FEATURE_NAME = "showDreamCatcherItem";

const v = {
  level: {
    warpState: DreamCatcherWarpState.INITIAL,
    warpRoomGridIndexes: [] as int[],
    floorDisplayFlags: new Map<int, BitFlags<DisplayFlag>>(),
    cardReadingPortalDescriptions: [] as Array<
      [subType: int, position: Vector]
    >,
    health: null as PlayerHealth | null,

    collectibles: [] as CollectibleType[],
    bosses: [] as Array<[entityType: EntityType, variant: int]>,

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
