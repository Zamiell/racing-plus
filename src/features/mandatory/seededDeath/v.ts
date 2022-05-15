import { ActiveSlot, CollectibleType } from "isaac-typescript-definitions";
import { PlayerIndex, saveDataManager } from "isaacscript-common";
import { SeededDeathState } from "../../../enums/SeededDeathState";
import { ActiveCollectibleDescription } from "../../../types/ActiveCollectibleDescription";
import { SEEDED_DEATH_FEATURE_NAME } from "./constants";

const v = {
  run: {
    state: SeededDeathState.DISABLED,
    dyingPlayerIndex: null as PlayerIndex | null,
    debuffEndFrame: null as int | null,

    devilRoomDeals: 0,
    frameOfLastDevilDeal: null as int | null,
    deferringDeathUntilForgottenSwitch: false,

    // Variables for tracking player state. All are explicitly set back to false after reading them
    // as true.
    hasBookOfVirtues: false,
    hasBookOfBelialBirthrightCombo: false,
    actives: new Map<ActiveSlot, ActiveCollectibleDescription>(),
    actives2: new Map<ActiveSlot, ActiveCollectibleDescription>(),
    collectibles: [] as CollectibleType[],
    collectibles2: [] as CollectibleType[],
    spriteScale: null as Vector | null,
    spriteScale2: null as Vector | null,
    goldenBomb: false,
    goldenKey: false,
    stage: null as int | null,
    stageType: null as int | null,
    removedDarkEsau: false,

    switchingBackToGhostLazarus: false,
  },
};
export default v;

export function init(): void {
  saveDataManager(SEEDED_DEATH_FEATURE_NAME, v);
}

export function isSeededDeathActive(): boolean {
  return v.run.state !== SeededDeathState.DISABLED;
}
