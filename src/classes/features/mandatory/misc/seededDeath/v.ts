import type { ActiveSlot, CollectibleType } from "isaac-typescript-definitions";
import type { PlayerIndex} from "isaacscript-common";
import { log } from "isaacscript-common";
import { SeededDeathState } from "../../../../../enums/SeededDeathState";
import type { ActiveCollectibleDescription } from "../../../../../interfaces/ActiveCollectibleDescription";
import { SEEDED_DEATH_DEBUG } from "./constants";

// This is registered in "SeededDeath.ts".
// eslint-disable-next-line isaacscript/require-v-registration
export const v = {
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

export function isSeededDeathActive(): boolean {
  return v.run.state !== SeededDeathState.DISABLED;
}

export function setSeededDeathState(state: SeededDeathState): void {
  v.run.state = state;

  if (SEEDED_DEATH_DEBUG) {
    log(
      `Seeded death state changed: ${SeededDeathState[v.run.state]} (${
        v.run.state
      })`,
    );
  }
}
