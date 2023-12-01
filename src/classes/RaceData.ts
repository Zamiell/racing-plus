import type {
  CollectibleType,
  TrinketType,
} from "isaac-typescript-definitions";
import { PlayerType } from "isaac-typescript-definitions";
import { arrayToString, isArray, log } from "isaacscript-common";
import { RaceDifficulty } from "../enums/RaceDifficulty";
import { RaceFormat } from "../enums/RaceFormat";
import { RaceGoal } from "../enums/RaceGoal";
import { RaceStatus } from "../enums/RaceStatus";
import { RacerStatus } from "../enums/RacerStatus";
import type { ServerCollectibleID } from "../types/ServerCollectibleID";

/** The possible types for values of `RaceData`. */
export type RaceDataType = boolean | number | string | readonly int[];

/** This must match the "ModSocket" class on the client. */
export class RaceData {
  userID = -1;
  username = "";

  /** -1 if a race is not going on. */
  raceID = -1;

  status = RaceStatus.NONE;
  myStatus = RacerStatus.NOT_READY;
  ranked = false;
  solo = false;
  format = RaceFormat.UNSEEDED;
  difficulty = RaceDifficulty.NORMAL;
  character = PlayerType.JUDAS;
  goal = RaceGoal.BLUE_BABY;

  /** Corresponds to the seed that is the race goal or "-". */
  seed = "-";

  /**
   * The starting items for this race, if any. (The format of the race and the position in the array
   * determines whether it is a `CollectibleType`, `TrinketType`, or `ServerCollectibleID`.
   */
  startingItems: Array<CollectibleType | TrinketType | ServerCollectibleID> =
    [];

  /** This corresponds to the graphic to draw on the screen. */
  countdown = -1;

  /**
   * This is either the number of people ready (in a pre-race) or the non-finished place (in a
   * race).
   */
  placeMid = 0;

  /** This is the final place. */
  place = -1;

  /** In a pre-race, the number of people who have readied up. */
  numReady = 0;

  /** The number of people in the race. */
  numEntrants = 1;

  /** Used to display a message in the starting room of the floor. */
  millisecondsBehindLeader = 0;

  /** Used to display a short message on demand from the client. */
  message = "";
}

export function cloneRaceData(raceData: RaceData): RaceData {
  const copiedRaceData = { ...raceData }; // Shallow copy
  copiedRaceData.startingItems = [...raceData.startingItems]; // Copy nested arrays
  return copiedRaceData;
}

export function logRaceData(raceData: RaceData): void {
  log("Race data:");
  const keys = Object.keys(raceData);
  keys.sort();
  for (const key of keys) {
    const property = key as keyof RaceData;
    const value = raceData[property];
    const valueString = isArray(value) ? arrayToString(value) : `${value}`;
    log(`- ${key} - ${valueString}`);
  }
}
