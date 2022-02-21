import { PlayerIndex, saveDataManager } from "isaacscript-common";
import { ActiveItemDescription } from "../../../types/ActiveItemDescription";
import { SeededDeathState } from "../../../types/SeededDeathState";

const v = {
  run: {
    state: SeededDeathState.DISABLED,
    dyingPlayerIndex: null as PlayerIndex | null,
    debuffEndFrame: null as int | null,

    devilRoomDeals: 0,
    frameOfLastDevilDeal: null as int | null,
    deferringDeathUntilForgottenSwitch: false,

    // Variables for tracking player state
    // All are explicitly set back to false after reading them as true
    hasBookOfVirtues: false,
    hasBookOfBelialBirthrightCombo: false,
    actives: new Map<ActiveSlot, ActiveItemDescription>(),
    actives2: new Map<ActiveSlot, ActiveItemDescription>(),
    items: [] as CollectibleType[],
    items2: [] as CollectibleType[],
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
  saveDataManager("seededDeath", v);
}

export function isSeededDeathActive(): boolean {
  return v.run.state !== SeededDeathState.DISABLED;
}
