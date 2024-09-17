import type { CollectibleType } from "isaac-typescript-definitions";
import { jsonDecode, log } from "isaacscript-common";
import { RaceData, cloneRaceData } from "../../classes/RaceData";
import { g } from "../../globals";
import type { ChatMessage } from "../../interfaces/ChatMessage";
import type { SocketCommandIn } from "../../types/SocketCommands";
import { checkRaceChanged } from "./checkRaceChanged";

export const SOCKET_DEBUG = false as boolean;

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
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
      return undefined;
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
      return undefined;
    }

    case "number": {
      const num = tonumber(data);
      if (num === undefined) {
        error(
          `Failed to convert "${data}" to a number when setting the race property: ${property}`,
        );
      }
      setRace(property, num);
      return undefined;
    }

    case "table": {
      // "startingItems" is the only property that is a table.
      const newArray = jsonDecode(data) as unknown as CollectibleType[];
      g.race.startingItems = newArray;
      return undefined;
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

function setRace<K extends keyof RaceData>(key: K, value: RaceData[K]) {
  g.race[key] = value;

  if (SOCKET_DEBUG) {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    log(`Set race value: ${key} --> ${value}`);
  }
}
