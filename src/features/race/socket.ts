import { GameStateFlag, ItemType } from "isaac-typescript-definitions";
import type {
  PickingUpItem} from "isaacscript-common";
import {
  game,
  getRoomVariant,
  log,
  logError,
} from "isaacscript-common";
import { RaceData, cloneRaceData } from "../../classes/RaceData";
import { RaceStatus } from "../../enums/RaceStatus";
import { g } from "../../globals";
import { config } from "../../modConfigMenu";
import type { SocketCommandIn, SocketCommandOut } from "../../types/SocketCommands";
import { checkRaceChanged } from "./checkRaceChanged";
import {
  socketClientConnect,
  socketClientDisconnect,
  socketClientIsActive,
  socketClientReceiveTCP,
  socketClientReceiveUDP,
  socketClientSendTCP,
  socketClientSendUDP,
} from "./socketClient";
import { SOCKET_DEBUG, reset, socketFunctions } from "./socketFunctions";

// ModCallback.POST_RENDER (2)
export function postRender(): void {
  if (!config.ClientCommunication) {
    return;
  }

  if (!socketClientIsActive()) {
    return;
  }

  // Send a ping as a quick test to see if the socket is still open.
  send("ping");

  // Do nothing further if the ping failed.
  if (!socketClientIsActive()) {
    return;
  }

  // Read the socket until we run out of data to read.
  const oldRaceData = cloneRaceData(g.race);
  while (read()) {} // eslint-disable-line no-empty
  checkRaceChanged(oldRaceData, g.race);
}

// ModCallback.POST_GAME_STARTED (15)
export function postGameStarted(): void {
  const seeds = game.GetSeeds();
  const startSeedString = seeds.GetStartSeedString();

  if (!socketClientIsActive() && !socketClientConnect()) {
      g.race = new RaceData();
    }

  send("seed", startSeedString);
}

// ModCallback.PRE_GAME_EXIT (17)
export function preGameExit(): void {
  send("mainMenu");
}

// ModCallback.POST_NEW_LEVEL (18)
export function postNewLevel(): void {
  const backwards = game.GetStateFlag(GameStateFlag.BACKWARDS_PATH)
    ? "true"
    : "false";
  const level = game.GetLevel();
  const stage = level.GetStage();
  const stageType = level.GetStageType();

  send("level", `${stage}-${stageType}-${backwards}`);
}

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  const room = game.GetRoom();
  const roomType = room.GetType();
  const roomVariant = getRoomVariant();

  // This roughly emulates a log.txt line of e.g.: "[INFO] - Room 13.12(New Room)"
  send("room", `${roomType}-${roomVariant}`);
}

// ModCallbackCustom.POST_ITEM_PICKUP
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
  if (!socketClientIsActive()) {
    return false;
  }

  const { data, errMsg } = socketClientReceiveTCP();
  if (data === undefined) {
    if (errMsg !== "timeout") {
      log(`Error: Failed to read data: ${errMsg}`);
      socketClientDisconnect();
      reset();
    }

    return false;
  }

  if (SOCKET_DEBUG) {
    log(`Got socket data: ${data}`);
  }

  const [command, parsedData] = unpackSocketMsg(data);
  const socketFunction = socketFunctions.get(command);
  if (socketFunction === undefined) {
    logError(`Error: Received an unknown socket command: ${command}`);
  } else {
    socketFunction(parsedData);
  }

  return true;
}

export function readUDP(): string | undefined {
  if (!socketClientIsActive()) {
    return undefined;
  }

  const { data, errMsg } = socketClientReceiveUDP();
  if (data === undefined) {
    if (errMsg !== "timeout") {
      log(`Error: Failed to read data: ${errMsg}`);
      socketClientDisconnect();
      reset();
    }

    return undefined;
  }

  return data;
}

export function send(command: SocketCommandOut, data = ""): void {
  if (!socketClientIsActive()) {
    return;
  }

  if (g.race.status === RaceStatus.NONE && command !== "ping") {
    return;
  }

  const packedMsg = packSocketMsg(command, data);
  const { sentBytes, errMsg } = socketClientSendTCP(packedMsg);
  if (sentBytes === undefined) {
    log(`Error: Failed to send data over the TCP socket: ${errMsg}`);
    socketClientDisconnect();
    reset();
  }
}

export function sendUDP(data: string): void {
  if (!socketClientIsActive()) {
    return;
  }

  const { sentBytes, errMsg } = socketClientSendUDP(data);
  if (sentBytes === undefined) {
    log(`Error: Failed to send data over the UDP socket: ${errMsg}`);
    socketClientDisconnect();
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
