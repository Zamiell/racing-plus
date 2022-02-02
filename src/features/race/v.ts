import { PlayerIndex, saveDataManager } from "isaacscript-common";
import { config } from "../../modConfigMenu";
import { ActiveItemDescription } from "../../types/ActiveItemDescription";
import { ButtonDescription } from "../../types/ButtonDescription";
import { SeededDeathState } from "./types/SeededDeathState";

const v = {
  run: {
    /** Used for Tainted Keeper when racing to the Boss Rush. */
    madeBossRushItemsFree: false,

    numVictoryLaps: 0,
    seeded3DollarBillItem: null as CollectibleType | null,

    seededDeath: {
      state: SeededDeathState.DISABLED,
      dyingPlayerIndex: null as PlayerIndex | null,
      debuffEndFrame: null as int | null,

      devilRoomDeals: 0,
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

    spawnedCorpseTrapdoor: false,
  },

  level: {
    numSacrifices: 0,

    dpsButton: null as ButtonDescription | null,
    victoryLapButton: null as ButtonDescription | null,
  },

  room: {
    showEndOfRunText: false,
  },
};
export default v;

export function init(): void {
  saveDataManager("race", v, featureEnabled);
}

function featureEnabled() {
  return config.clientCommunication;
}

export function isSeededDeathActive(): boolean {
  return v.run.seededDeath.state !== SeededDeathState.DISABLED;
}
