import { jsonDecode } from "isaacscript-common";
import g from "../../globals";
import { SocketCommandIn } from "../../types/SocketCommands";
import { checkRaceChanged } from "./checkRaceChanged";
import RaceData, { cloneRaceData } from "./types/RaceData";

const functionMap = new Map<SocketCommandIn, (data: string) => void>();
export default functionMap;

functionMap.set("reset", reset);
export function reset(): void {
  const oldRaceData = cloneRaceData(g.race);
  g.race = new RaceData();
  g.race.userID = oldRaceData.userID;
  checkRaceChanged(oldRaceData, g.race);
}

functionMap.set("set", (rawData: string) => {
  const [propertyString, data] = unpackSetMsg(rawData);
  const property = propertyString as keyof RaceData;
  const previousValue = g.race[property];
  if (previousValue === undefined) {
    error(
      "Got a set command from the Racing+ client for a property that does not exist.",
    );
  }
  const previousValueType = type(previousValue);

  switch (previousValueType) {
    case "string": {
      // No type conversion is necessary
      setRace(property, data);
      break;
    }

    case "boolean": {
      let bool: boolean;
      if (data === "true") {
        bool = true;
      } else if (data === "false") {
        bool = false;
      } else {
        error(
          `Failed to convert "${data}" to a boolean when setting the race property: ${property}`,
        );
      }
      setRace(property, bool);
      break;
    }

    case "number": {
      const num = tonumber(data);
      if (num === undefined) {
        error(
          `Failed to convert "${data}" to a number when setting the race property: ${property}`,
        );
      }
      setRace(property, num);

      break;
    }

    case "table": {
      // "startingItems" is the only property that is a table
      const newArray = jsonDecode(data) as unknown as int[];
      g.race.startingItems = newArray;
      break;
    }

    default: {
      error(`Setting race types of "${previousValueType}" are not supported.`);
    }
  }
});

// Mostly copied from the "unpackSocketMsg()" function
function unpackSetMsg(rawData: string): [string, string] {
  const separator = " ";
  const [property, ...dataArray] = rawData.split(separator);
  const data = dataArray.join(separator);

  return [property, data];
}

function setRace<K extends keyof RaceData, V extends RaceData[K]>(
  key: K,
  value: V,
) {
  g.race[key] = value;
}
