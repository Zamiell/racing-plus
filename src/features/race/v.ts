import { saveDataManager } from "isaacscript-common";
import g from "../../globals";
import { config } from "../../modConfigMenu";
import { ButtonDescription } from "../../types/ButtonDescription";
import { RaceFormat } from "./types/RaceFormat";
import { RacerStatus } from "./types/RacerStatus";
import { RaceStatus } from "./types/RaceStatus";

const v = {
  run: {
    /** Used for Tainted Keeper when racing to the Boss Rush. */
    madeBossRushItemsFree: false,

    numVictoryLaps: 0,
    seeded3DollarBillItem: null as CollectibleType | null,

    spawnedCorpseTrapdoor: false,
  },

  level: {
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

export function inSeededRace(): boolean {
  return (
    config.clientCommunication &&
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.format === RaceFormat.SEEDED
  );
}
