import { CollectibleType } from "isaac-typescript-definitions";
import { RaceFormat } from "../../enums/RaceFormat";
import { RacerStatus } from "../../enums/RacerStatus";
import { RaceStatus } from "../../enums/RaceStatus";
import { g } from "../../globals";
import { mod } from "../../mod";
import { config } from "../../modConfigMenu";
import { ButtonDescription } from "../../types/ButtonDescription";

export const v = {
  run: {
    /** Used for Tainted Keeper when racing to the Boss Rush. */
    madeBossRushItemsFree: false,

    numVictoryLaps: 0,
    seeded3DollarBillItem: null as CollectibleType | null,

    spawnedCorpseTrapdoor: false,

    /** Used for the consistent Devil/Angel Room feature. */
    allAngelRooms: false,
  },

  level: {
    dpsButton: null as ButtonDescription | null,
    victoryLapButton: null as ButtonDescription | null,
  },

  room: {
    showEndOfRunText: false,
  },
};

export function init(): void {
  mod.saveDataManager("race", v, featureEnabled);
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

export function raceShouldShowEndOfRunText(): boolean {
  return v.room.showEndOfRunText;
}
