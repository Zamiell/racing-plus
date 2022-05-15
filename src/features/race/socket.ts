import { GameStateFlag, ItemType } from "isaac-typescript-definitions";
import { getRoomVariant, log, PickingUpItem } from "isaacscript-common";
import { cloneRaceData, RaceData } from "../../classes/RaceData";
import { RaceStatus } from "../../enums/RaceStatus";
import g from "../../globals";
import { config } from "../../modConfigMenu";
import { SocketCommandIn, SocketCommandOut } from "../../types/SocketCommands";
import { checkRaceChanged } from "./checkRaceChanged";
import * as socketClient from "./socketClient";
import { reset, socketFunctions, SOCKET_DEBUG } from "./socketFunctions";

// ModCallback.POST_RENDER (2)
export function postRender(): void {
  if (!config.clientCommunication) {
    return;
  }

  if (!socketClient.isActive()) {
    return;
  }

  // Send a ping as a quick test to see if the socket is still open.
  send("ping");

  // Do nothing further if the ping failed.
  if (!socketClient.isActive()) {
    return;
  }

  // Read the socket until we run out of data to read.
  const oldRaceData = cloneRaceData(g.race);
  while (read()) {} // eslint-disable-line no-empty
  checkRaceChanged(oldRaceData, g.race);
}

// ModCallback.POST_GAME_STARTED (15)
export function postGameStarted(): void {
  const startSeedString = g.seeds.GetStartSeedString();

  if (!socketClient.isActive()) {
    if (!socketClient.connect()) {
      g.race = new RaceData();
    }
  }

  send("seed", startSeedString);
}

// ModCallback.PRE_GAME_EXIT (17)
export function preGameExit(): void {
  send("mainMenu");
}

// ModCallback.POST_NEW_LEVEL (18)
export function postNewLevel(): void {
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const backwards = g.g.GetStateFlag(GameStateFlag.BACKWARDS_PATH)
    ? "true"
    : "false";

  send("level", `${stage}-${stageType}-${backwards}`);
}

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  const roomType = g.r.GetType();
  const roomVariant = getRoomVariant();

  // This roughly emulates a log.txt line of e.g.: "[INFO] - Room 13.12(New Room)"
  send("room", `${roomType}-${roomVariant}`);
}

// ModCallbacksCustom.MC_POST_ITEM_PICKUP
export function postItemPickup(pickingUpItem: PickingUpItem): void {
  if (
    pickingUpItem.itemType === ItemType.ACTIVE ||
    pickingUpItem.itemType === ItemType.PASSIVE ||
    pickingUpItem.itemType === ItemType.FAMILIAR
  ) {
    send("item", pickingUpItem.subType.toString());
  }
}

function read() {
  if (!socketClient.isActive()) {
    return false;
  }

  const { data, errMsg } = socketClient.receive();
  if (data === undefined) {
    if (errMsg !== "timeout") {
      log(`Error: Failed to read data: ${errMsg}`);
      socketClient.disconnect();
      reset();
    }

    return false;
  }

  if (SOCKET_DEBUG) {
    log(`Got socket data: ${data}`);
  }

  const [command, parsedData] = unpackSocketMsg(data);
  const socketFunction = socketFunctions.get(command);
  if (socketFunction !== undefined) {
    socketFunction(parsedData);
  } else {
    log(`Error: Received an unknown socket command: ${command}`);
  }

  return true;
}

export function readUDP(): string | null {
  if (!socketClient.isActive()) {
    return null;
  }

  const { data, errMsg } = socketClient.receiveUDP();
  if (data === undefined) {
    if (errMsg !== "timeout") {
      log(`Error: Failed to read data: ${errMsg}`);
      socketClient.disconnect();
      reset();
    }

    return null;
  }

  return data;
}

export function send(command: SocketCommandOut, data = ""): void {
  if (!socketClient.isActive()) {
    return;
  }

  if (g.race.status === RaceStatus.NONE && command !== "ping") {
    return;
  }

  const packedMsg = packSocketMsg(command, data);
  const { sentBytes, errMsg } = socketClient.send(packedMsg);
  if (sentBytes === undefined) {
    log(`Error: Failed to send data over the TCP socket: ${errMsg}`);
    socketClient.disconnect();
    reset();
  }
}

export function sendUDP(data: string): void {
  if (!socketClient.isActive()) {
    return;
  }

  const { sentBytes, errMsg } = socketClient.sendUDP(data);
  if (sentBytes === undefined) {
    log(`Error: Failed to send data over the UDP socket: ${errMsg}`);
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
function unpackSocketMsg(data: string): [SocketCommandIn, string] {
  const separator = " ";
  const [command, ...dataArray] = data.trim().split(separator);
  const parsedData = dataArray.join(separator);

  return [command as SocketCommandIn, parsedData];
}
