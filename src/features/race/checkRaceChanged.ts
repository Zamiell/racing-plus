import g from "../../globals";
import { arrayEquals, ensureAllCases, getRoomIndex } from "../../misc";
import RaceVars from "../../types/RaceVars";
import * as raceRoom from "./raceRoom";
import RaceData from "./types/RaceData";

export function checkRaceChanged(
  oldRaceData: RaceData,
  newRaceData: RaceData,
): void {
  for (const key of Object.keys(newRaceData)) {
    const property = key as keyof RaceData;
    const previousValue = oldRaceData[property];
    if (previousValue === undefined) {
      error(`The previous value for "${key}" does not exist.`);
    }
    const newValue = newRaceData[property];
    if (newValue === undefined) {
      error(`The new value for "${key}" does not exist.`);
    }
    const valueType = type(previousValue);

    if (valueType === "table") {
      const previousArray = previousValue as int[];
      const newArray = newValue as int[];
      if (!arrayEquals(previousArray, newArray)) {
        raceValueChanged(property, newArray.join(","));
      }
    } else if (previousValue !== newValue) {
      raceValueChanged(property, newValue as string | number | boolean);
    }
  }
}

function raceValueChanged(
  property: keyof RaceData,
  newValue: string | number | boolean,
) {
  Isaac.DebugString(`Race value changed: ${property} - ${newValue}`);
  const changedFunction = functionMap.get(property);
  if (changedFunction !== undefined) {
    changedFunction();
  }
}

const functionMap = new Map<keyof RaceData, () => void>();

functionMap.set("status", () => {
  const roomIndex = getRoomIndex();
  const stage = g.l.GetStage();
  const startingRoomIndex = g.l.GetStartingRoomIndex();

  Isaac.DebugString(`Changed status to: ${g.race.status}`);
  switch (g.race.status) {
    case "none": {
      if (raceRoom.inRaceRoom()) {
        g.run.restart = true;
        Isaac.DebugString("Restarting because we want to exit the race room.");
      }

      break;
    }

    case "open": {
      // If we are in the first room of a run, go to the race room
      // Otherwise, show the sprites on the left side of the screen
      if (stage === 1 && roomIndex === startingRoomIndex) {
        g.run.restart = true;
        Isaac.DebugString("Restarting to go to the race room.");
      } else if (g.race.myStatus === "not ready") {
        // sprites.init("place", "pre1");
      } else if (g.race.myStatus === "ready") {
        // sprites.init("place", "pre2");
      }

      break;
    }

    case "starting": {
      // Remove the final place graphic, if present
      // sprites.init("place2", "");

      break;
    }

    case "in progress": {
      g.run.restart = true;
      Isaac.DebugString("Restarting because the run has now started.");

      g.raceVars = new RaceVars();
      g.raceVars.started = true;
      g.raceVars.startedTime = Isaac.GetTime(); // Mark when the race started
      g.raceVars.startedFrame = Isaac.GetFrameCount(); // Also mark the frame the race started

      break;
    }

    default: {
      ensureAllCases(g.race.status);
      break;
    }
  }
});

functionMap.set("myStatus", () => {
  const roomIndex = getRoomIndex();

  if (
    (g.race.status === "open" || g.race.status === "starting") &&
    g.race.myStatus === "not ready" &&
    roomIndex !== GridRooms.ROOM_DEBUG_IDX
  ) {
    // sprites.init("place", "pre1");
  } else if (
    (g.race.status === "open" || g.race.status === "starting") &&
    g.race.myStatus === "ready" &&
    roomIndex !== GridRooms.ROOM_DEBUG_IDX
  ) {
    // sprites.init("place", "pre2");
  }
});

functionMap.set("place", () => {
  if (g.raceVars.finished) {
    // Show a big graphic at the top of the screen with our final place
    // (the client won't send a new place for solo races)
    // sprites.init("place2", g.race.place.toString());
    // Also, update the place graphic on the left by the R+ icon with our final place
    // sprites.init("place", g.race.place.toString());
  }
});
