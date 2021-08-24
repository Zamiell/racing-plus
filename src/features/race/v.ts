import { saveDataManager } from "isaacscript-common";
import { config } from "../../modConfigMenu";
import ActiveItemDescription from "../../types/ActiveItemDescription";
import SeededDeathState from "./types/SeededDeathState";

const v = {
  run: {
    /** Used for Tainted Keeper when racing to the Boss Rush. */
    madeBossRushItemsFree: false,

    numVictoryLaps: 0,

    seededDeath: {
      state: SeededDeathState.DISABLED,
      reviveFrame: null as int | null,
      debuffEndFrame: null as int | null,
      fetalPosition: Vector.Zero,

      devilRoomDeals: 0,
      frameOfLastDevilDeal: null as int | null,
      deferringDeathUntilForgottenSwitch: false,

      // Variables for tracking player state
      actives: new Map<ActiveSlot, ActiveItemDescription>(),
      actives2: new Map<ActiveSlot, ActiveItemDescription>(),
      items: [] as CollectibleType[],
      items2: [] as CollectibleType[],
      spriteScale: null as Vector | null,
      spriteScale2: null as Vector | null,
      goldenBomb: false,
      goldenKey: false,
      stage: null as int | null,
      removedDarkEsau: false,
    },

    spawnedCorpseTrapdoor: false,

    victoryLaps: 0,
  },

  level: {
    numSacrifices: 0,
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
