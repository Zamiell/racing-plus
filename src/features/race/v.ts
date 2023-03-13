import { CollectibleType } from "isaac-typescript-definitions";
import { RaceFormat } from "../../enums/RaceFormat";
import { RaceGoal } from "../../enums/RaceGoal";
import { RacerStatus } from "../../enums/RacerStatus";
import { RaceStatus } from "../../enums/RaceStatus";
import { g } from "../../globals";
import { mod } from "../../mod";
import { config } from "../../modConfigMenu";

interface ButtonDescription {
  roomListIndex: int;
  gridIndex: int;
  spritePosition: Vector;
  pressed: boolean;
}

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
  return config.ClientCommunication;
}

export function inRace(): boolean {
  return (
    config.ClientCommunication &&
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING
  );
}

export function inUnseededRace(): boolean {
  return inRace() && g.race.format === RaceFormat.UNSEEDED;
}

export function inSeededRace(): boolean {
  return inRace() && g.race.format === RaceFormat.SEEDED;
}

export function inDiversityRace(): boolean {
  return inRace() && g.race.format === RaceFormat.DIVERSITY;
}

export function inRaceToDarkRoom(): boolean {
  return (
    inRace() &&
    (g.race.goal === RaceGoal.THE_LAMB || g.race.goal === RaceGoal.MEGA_SATAN)
  );
}

export function raceShouldShowEndOfRunText(): boolean {
  return v.room.showEndOfRunText;
}
