import { log, PickingUpItem } from "isaacscript-common";
import g from "../../globals";
import { SocketCommandIn, SocketCommandOut } from "../../types/SocketCommands";
import { checkRaceChanged } from "./checkRaceChanged";
import socketFunctions, { reset } from "./socketFunctions";
import RaceData, { cloneRaceData } from "./types/RaceData";

const DEBUG = false;
const MIN_FRAMES_BETWEEN_CONNECTION_ATTEMPTS = 2 * 60; // 2 seconds
const PORT = 9112; // Arbitrarily chosen to not conflict with common IANA ports

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  if (!g.config.clientCommunication) {
    return;
  }

  if (g.socket.client === null) {
    return;
  }

  // Send a ping as a quick test to see if the socket is still open
  send("ping");

  // Do nothing further if the ping failed
  if (g.socket.client === null) {
    return;
  }

  // Read the socket until we run out of data to read
  const oldRaceData = cloneRaceData(g.race);
  while (read()) {} // eslint-disable-line no-empty
  checkRaceChanged(oldRaceData, g.race);
}

function read() {
  if (g.socket.client === null) {
    return false;
  }

  const [rawData, errMsg] = g.socket.client.receive();
  if (rawData === null) {
    if (errMsg !== "timeout") {
      log(`Failed to read data: ${errMsg}`);
      disconnect();
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

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  const startSeedString = g.seeds.GetStartSeedString();

  if (g.socket.client === null) {
    if (!connect()) {
      g.race = new RaceData();
    }
  }

  send("seed", startSeedString);
}

export function connect(): boolean {
  // Do nothing if the sandbox is not present
  if (!g.socket.enabled || g.sandbox === null) {
    return false;
  }

  // To minimize lag,
  // don't attempt to connect if we have recently tried to connect and it has failed
  const isaacFrameCount = Isaac.GetFrameCount();
  if (
    g.socket.connectionAttemptFrame !== 0 &&
    isaacFrameCount <
      g.socket.connectionAttemptFrame + MIN_FRAMES_BETWEEN_CONNECTION_ATTEMPTS
  ) {
    // Reset the connection attempt frame to this one so that resetting over and over never triggers
    // a connection attempt
    g.socket.connectionAttemptFrame = isaacFrameCount;
    return false;
  }

  g.socket.connectionAttemptFrame = isaacFrameCount;
  g.socket.client = g.sandbox.connectLocalhost(PORT);
  if (g.socket.client === null) {
    return false;
  }

  // We check for new socket data on every PostRender frame
  // However, the remote socket might not necessarily have any new data for us
  // Thus, we set the timeout to 0 in order to prevent lag
  g.socket.client.settimeout(0);

  return true;
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
export function send(command: SocketCommandOut, data = ""): void {
  if (g.socket.client === null) {
    return;
  }

  if (g.race.status === "none" && command !== "ping") {
    return;
  }

  const packedMsg = packSocketMsg(command, data);
  const [sentBytes, errMsg] = g.socket.client.send(packedMsg);
  if (sentBytes === null) {
    log(`Failed to send data over the socket: ${errMsg}`);
    disconnect();
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

function disconnect() {
  g.socket.client = null;

  reset();
}
