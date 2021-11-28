import {
  arrayEquals,
  ensureAllCases,
  getEffectiveStage,
  getRoomIndex,
  log,
} from "isaacscript-common";
import g from "../../globals";
import { unseed } from "../../utilGlobals";
import { restartOnNextFrame, setRestartSeed } from "../util/restartOnNextFrame";
import * as placeLeft from "./placeLeft";
import * as raceRoom from "./raceRoom";
import { raceStart } from "./raceStart";
import * as sprites from "./sprites";
import * as topSprite from "./topSprite";
import { RaceData, RaceDataType } from "./types/RaceData";
import { RaceFormat } from "./types/RaceFormat";
import { RacerStatus } from "./types/RacerStatus";
import { RaceStatus } from "./types/RaceStatus";

export function checkRaceChanged(
  oldRaceData: RaceData,
  newRaceData: RaceData,
): void {
  const keys = Object.keys(oldRaceData);
  table.sort(keys); // The keys will be in a random order because of Lua's "pairs()"
  for (const key of keys) {
    const property = key as keyof RaceData;
    const oldValue = oldRaceData[property];
    if (oldValue === undefined) {
      error(`The previous value for "${key}" does not exist.`);
    }
    const newValue = newRaceData[property];
    if (newValue === undefined) {
      error(`The new value for "${key}" does not exist.`);
    }
    const valueType = type(oldValue);

    if (valueType === "table") {
      const oldArray = oldValue as int[];
      const newArray = newValue as int[];
      if (!arrayEquals(oldArray, newArray)) {
        raceValueChanged(property, oldArray, newArray);
      }
    } else if (oldValue !== newValue) {
      raceValueChanged(property, oldValue, newValue);
    }
  }
}

function raceValueChanged(
  property: keyof RaceData,
  oldValue: RaceDataType,
  newValue: RaceDataType,
) {
  log(`Race value "${property}" changed: ${oldValue} --> ${newValue}`);

  if (type(oldValue) === "table") {
    for (const [i, value] of ipairs(oldValue as Record<number, unknown>)) {
      log(`Old array: ${i}) - ${value}`);
    }
  }

  if (type(newValue) === "table") {
    for (const [i, value] of ipairs(newValue as Record<number, unknown>)) {
      log(`New array: ${i}) - ${value}`);
    }
  }

  const changedFunction = functionMap.get(property);
  if (changedFunction !== undefined) {
    changedFunction(oldValue, newValue);
  }
}

const functionMap = new Map<
  keyof RaceData,
  (oldValue: RaceDataType, newValue: RaceDataType) => void
>();

functionMap.set("status", (_oldValue: RaceDataType, newValue: RaceDataType) => {
  const newStatus = newValue as RaceStatus;
  const roomIndex = getRoomIndex();
  const effectiveStage = getEffectiveStage();
  const startingRoomIndex = g.l.GetStartingRoomIndex();

  switch (newStatus) {
    case RaceStatus.NONE: {
      if (raceRoom.inRaceRoom()) {
        restartOnNextFrame();
        log("Restarting because we want to exit the race room.");
      }

      sprites.resetAll();
      break;
    }

    case RaceStatus.OPEN: {
      // If we are in the first room of a run, go to the race room
      if (effectiveStage === 1 && roomIndex === startingRoomIndex) {
        restartOnNextFrame();
        log("Restarting to go to the race room.");
      }

      placeLeft.statusOrMyStatusChanged();
      topSprite.statusChanged();
      break;
    }

    case RaceStatus.STARTING: {
      raceRoom.statusChanged();
      placeLeft.statusOrMyStatusChanged();
      topSprite.statusChanged();

      break;
    }

    case RaceStatus.IN_PROGRESS: {
      restartOnNextFrame();
      if (g.race.format === RaceFormat.SEEDED) {
        setRestartSeed(g.race.seed);
      }
      log("Restarting because the run has now started.");

      raceStart();

      break;
    }

    default: {
      ensureAllCases(newStatus);
      break;
    }
  }
});

functionMap.set(
  "myStatus",
  (oldValue: RaceDataType, _newValue: RaceDataType) => {
    if (oldValue === RacerStatus.RACING) {
      // After racing on a set seed, automatically reset the game state to that of an unseeded run
      unseed();
    }

    raceRoom.myStatusChanged();
    placeLeft.statusOrMyStatusChanged();
  },
);

functionMap.set(
  "countdown",
  (_oldValue: RaceDataType, _newValue: RaceDataType) => {
    topSprite.countdownChanged();
  },
);

functionMap.set("place", (_oldValue: RaceDataType, _newValue: RaceDataType) => {
  placeLeft.placeChanged();
  topSprite.placeChanged();
});

functionMap.set(
  "placeMid",
  (_oldValue: RaceDataType, _newValue: RaceDataType) => {
    placeLeft.placeMidChanged();
  },
);

functionMap.set(
  "numReady",
  (_oldValue: RaceDataType, _newValue: RaceDataType) => {
    raceRoom.numReadyChanged();
  },
);

functionMap.set(
  "numEntrants",
  (_oldValue: RaceDataType, _newValue: RaceDataType) => {
    raceRoom.numEntrantsChanged();
  },
);
