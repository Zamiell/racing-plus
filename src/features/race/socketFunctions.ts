import { jsonDecode, log } from "isaacscript-common";
import { cloneRaceData, RaceData } from "../../classes/RaceData";
import g from "../../globals";
import { ChatMessage } from "../../types/ChatMessage";
import { SocketCommandIn } from "../../types/SocketCommands";
import { checkRaceChanged } from "./checkRaceChanged";

export const SOCKET_DEBUG = false;

export const socketFunctions = new Map<
  SocketCommandIn,
  (data: string) => void
>();

socketFunctions.set("reset", reset);
export function reset(): void {
  const oldRaceData = cloneRaceData(g.race);
  g.race = new RaceData();
  g.race.userID = oldRaceData.userID;
  g.race.username = oldRaceData.username;
  checkRaceChanged(oldRaceData, g.race);
}

socketFunctions.set("set", (rawData: string) => {
  const [propertyString, data] = unpackSetMsg(rawData);
  const property = propertyString as keyof RaceData;
  const previousValue = g.race[property];
  if (previousValue === undefined) {
    error(
      `Got a set command from the Racing+ client for a property that does not exist: ${property}`,
    );
  }
  const previousValueType = type(previousValue);

  switch (previousValueType) {
    case "string": {
      // No type conversion is necessary.
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
      // "startingItems" is the only property that is a table.
      const newArray = jsonDecode(data) as unknown as int[];
      g.race.startingItems = newArray;
      break;
    }

    default: {
      return error(
        `Setting race types of "${previousValueType}" are not supported.`,
      );
    }
  }
});

socketFunctions.set("chat", (rawData: string) => {
  const renderFrameCount = Isaac.GetFrameCount();
  const chatMessage = jsonDecode(rawData) as unknown as ChatMessage;
  chatMessage.renderFrameReceived = renderFrameCount;
  g.chatMessages.unshift(chatMessage);
  log(
    `Chat: [${chatMessage.time}] <${chatMessage.username}> ${chatMessage.msg}`,
  );
});

/** This is mostly copied from the `unpackSocketMsg` function. */
function unpackSetMsg(rawData: string): [string, string] {
  const separator = " ";
  const [property, ...dataArray] = rawData.split(separator);
  const data = dataArray.join(separator);

  if (property === undefined) {
    return ["", data];
  }

  return [property, data];
}

function setRace<K extends keyof RaceData, V extends RaceData[K]>(
  key: K,
  value: V,
) {
  g.race[key] = value;
  if (SOCKET_DEBUG) {
    log(`Set race value: ${key} --> ${value}`);
  }
}
