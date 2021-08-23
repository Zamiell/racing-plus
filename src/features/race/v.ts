import { saveDataManager } from "isaacscript-common";
import { config } from "../../modConfigMenu";
import SeededDeathState from "./types/SeededDeathState";

const v = {
  run: {
    /** Used for Tainted Keeper when racing to the Boss Rush. */
    madeBossRushItemsFree: false,

    numVictoryLaps: 0,

    seededDeath: {
      state: SeededDeathState.DISABLED,
      reviveFrame: null as int | null,
      guppysCollar: false,
      guppysCollarSeed: 0,
      debuffEndFrame: null as int | null,
      curseSetFrame: 0,
      fetalPosition: Vector.Zero,

      devilRoomDeals: 0,
      frameOfLastDevilDeal: null as int | null,

      // TODO check to see if all of these are used
      items: [] as CollectibleType[],
      charge: null as int | null,
      spriteScale: Vector.Zero,
      goldenBomb: false,
      goldenKey: false,
      stage: null as int | null,
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
