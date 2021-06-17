import g from "../../globals";
import log from "../../log";
import PickingUpItemDescription from "../../types/PickingUpItemDescription";
import { SocketCommandIn, SocketCommandOut } from "../../types/SocketCommands";
import { checkRaceChanged } from "./checkRaceChanged";
import socketFunctions, { reset } from "./socketFunctions";

const PORT = 9112; // Arbitrarily chosen to not conflict with common IANA ports
const MIN_FRAMES_BETWEEN_CONNECTION_ATTEMPTS = 2 * 60; // 2 seconds

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
  Isaac.DebugString(`1 STARTING ITEMS: ${g.race.startingItems.join(",")}`);
  const oldRaceData = g.race.clone();
  Isaac.DebugString(`2 STARTING ITEMS: ${g.race.startingItems.join(",")}`);
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
      Isaac.DebugString(`Failed to read data: ${errMsg}`);
      disconnect();
    }
    return false;
  }

  const [command, data] = unpackSocketMsg(rawData);

  const socketFunction = socketFunctions.get(command);
  if (socketFunction !== undefined) {
    Isaac.DebugString(`XXX ${command} ${data}`);
    socketFunction(data);
  } else {
    Isaac.DebugString(`Error: Received an unknown socket command: ${command}`);
  }

  return true;
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  const startSeedString = g.seeds.GetStartSeedString();

  connect();
  send("seed", startSeedString);
}

function connect(): void {
  // Do nothing if the sandbox is not present
  if (!g.socket.enabled || g.socket.sandbox === null) {
    return;
  }

  // Do nothing if we are already connected
  if (g.socket.client !== null) {
    return;
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
    return;
  }

  g.socket.connectionAttemptFrame = isaacFrameCount;
  g.socket.client = g.socket.sandbox.connectLocalhost(PORT);
  if (g.socket.client !== null) {
    // We check for new socket data on every PostRender frame
    // However, the remote socket might not necessarily have any new data for us
    // Thus, we set the timeout to 0 in order to prevent lag
    g.socket.client.settimeout(0);
  }
}

// ModCallbacks.MC_PRE_GAME_EXIT (17)
export function preGameExit(): void {
  send("mainMenu");
}

// ModCallbacks.MC_POST_NEW_LEVEL (18)
export function postNewLevel(): void {
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  send("level", `${stage}-${stageType}`);
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

export function postItemPickup(
  pickingUpItemDescription: PickingUpItemDescription,
): void {
  if (
    pickingUpItemDescription.type === ItemType.ITEM_ACTIVE ||
    pickingUpItemDescription.type === ItemType.ITEM_PASSIVE ||
    pickingUpItemDescription.type === ItemType.ITEM_FAMILIAR
  ) {
    send("item", pickingUpItemDescription.id.toString());
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
export function unpackSocketMsg(rawData: string): [SocketCommandIn, string] {
  const separator = " ";
  const [command, ...dataArray] = rawData.trim().split(separator);
  const data = dataArray.join(separator);

  return [command as SocketCommandIn, data];
}

function disconnect() {
  g.socket.client = null;

  reset();
}
