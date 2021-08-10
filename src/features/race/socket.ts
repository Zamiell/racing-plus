import { log, PickingUpItem } from "isaacscript-common";
import g from "../../globals";
import { config } from "../../modConfigMenu";
import { SocketCommandIn, SocketCommandOut } from "../../types/SocketCommands";
import { checkRaceChanged } from "./checkRaceChanged";
import * as socketClient from "./socketClient";
import socketFunctions, { reset } from "./socketFunctions";
import RaceData, { cloneRaceData } from "./types/RaceData";

const DEBUG = false;

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  if (!config.clientCommunication) {
    return;
  }

  if (!socketClient.isActive()) {
    return;
  }

  // Send a ping as a quick test to see if the socket is still open
  send("ping");

  // Do nothing further if the ping failed
  if (!socketClient.isActive()) {
    return;
  }

  // Read the socket until we run out of data to read
  const oldRaceData = cloneRaceData(g.race);
  while (read()) {} // eslint-disable-line no-empty
  checkRaceChanged(oldRaceData, g.race);
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  const startSeedString = g.seeds.GetStartSeedString();

  if (!socketClient.isActive()) {
    if (!socketClient.connect()) {
      g.race = new RaceData();
    }
  }

  send("seed", startSeedString);
}

// ModCallbacks.MC_PRE_GAME_EXIT (17)
export function preGameExit(): void {
  send("mainMenu");
}

// ModCallbacks.MC_POST_NEW_LEVEL (18)
export function postNewLevel(): void {
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const backwards = g.g.GetStateFlag(GameStateFlag.STATE_BACKWARDS_PATH)
    ? "true"
    : "false";

  send("level", `${stage}-${stageType}-${backwards}`);
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  const roomDesc = g.l.GetCurrentRoomDesc();
  const roomData = roomDesc.Data;
  const roomType = roomData.Type;
  const roomVariant = roomData.Variant;

  // This roughly emulates a log.txt line of e.g. "[INFO] - Room 13.12(New Room)"
  send("room", `${roomType}-${roomVariant}`);
}

// ModCallbacksCustom.MC_POST_ITEM_PICKUP
export function postItemPickup(pickingUpItem: PickingUpItem): void {
  if (
    pickingUpItem.type === ItemType.ITEM_ACTIVE ||
    pickingUpItem.type === ItemType.ITEM_PASSIVE ||
    pickingUpItem.type === ItemType.ITEM_FAMILIAR
  ) {
    send("item", pickingUpItem.id.toString());
  }
}

// Subroutines
function read() {
  if (!socketClient.isActive()) {
    return false;
  }

  const [rawData, errMsg] = socketClient.receive();
  if (rawData === null) {
    if (errMsg !== "timeout") {
      log(`Failed to read data: ${errMsg}`);
      socketClient.disconnect();
      reset();
    }
    return false;
  }

  const [command, data] = unpackSocketMsg(rawData);
  if (DEBUG) {
    log(`Got socket data: ${rawData}`);
  }

  const socketFunction = socketFunctions.get(command);
  if (socketFunction !== undefined) {
    socketFunction(data);
  } else {
    log(`Error: Received an unknown socket command: ${command}`);
  }

  return true;
}

export function send(command: SocketCommandOut, data = ""): void {
  if (!socketClient.isActive()) {
    return;
  }

  if (g.race.status === "none" && command !== "ping") {
    return;
  }

  const packedMsg = packSocketMsg(command, data);
  const [sentBytes, errMsg] = socketClient.send(packedMsg);
  if (sentBytes === null) {
    log(`Failed to send data over the socket: ${errMsg}`);
    socketClient.disconnect();
    reset();
  }
}

function packSocketMsg(command: string, data: string) {
  if (data === "") {
    return `${command}\n`;
  }

  const separator = " ";
  return `${command}${separator}${data}\n`; // Socket messages must be terminated by a newline
}

// e.g. "floor 1" or "finish"
function unpackSocketMsg(rawData: string): [SocketCommandIn, string] {
  const separator = " ";
  const [command, ...dataArray] = rawData.trim().split(separator);
  const data = dataArray.join(separator);

  return [command as SocketCommandIn, data];
}
