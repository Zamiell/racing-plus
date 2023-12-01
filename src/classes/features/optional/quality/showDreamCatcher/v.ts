import type {
  CollectibleType,
  DisplayFlag,
  EntityType,
} from "isaac-typescript-definitions";
import type { PlayerHealth } from "isaacscript-common";
import { ReadonlyMap } from "isaacscript-common";
import { DreamCatcherWarpState } from "../../../../../enums/DreamCatcherWarpState";

export interface CardReadingPortalDescription {
  readonly subType: int;
  readonly position: Vector;
}

// This is registered in "ShowDreamCatcher.ts".
// eslint-disable-next-line isaacscript/require-v-registration
export const v = {
  level: {
    __ignoreGlowingHourGlass: true, // Tell the Save Data Manager to not revert this variable.
    warpState: DreamCatcherWarpState.INITIAL,
    warpRoomGridIndexes: [] as int[],
    floorDisplayFlags: new ReadonlyMap<int, BitFlags<DisplayFlag>>(),
    cardReadingPortalDescriptions: [] as CardReadingPortalDescription[],
    health: null as PlayerHealth | null,

    collectibles: [] as CollectibleType[],
    bosses: [] as Array<[entityType: EntityType, variant: int]>,

    /** Used so that the fast-travel feature can communicate with this feature. */
    arrivedOnNewFloor: false,
  },
};

export function isDreamCatcherWarping(): boolean {
  return v.level.warpState === DreamCatcherWarpState.WARPING;
}

export function setDreamCatcherArrivedOnNewFloor(): void {
  v.level.arrivedOnNewFloor = true;
}
