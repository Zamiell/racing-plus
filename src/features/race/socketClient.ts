import { log } from "isaacscript-common";
import { Sandbox } from "../../types/Sandbox";

const TCP_PORT = 9112; // Arbitrarily chosen to not conflict with common IANA ports
const UDP_PORT = 9113;
const MIN_FRAMES_BETWEEN_CONNECTION_ATTEMPTS = 2 * 60; // 2 seconds

let sandbox: Sandbox | null = null;
let connectionAttemptFrame = null as int | null;
let clientTCP = null as SocketClient | null;
let clientUDP = null as SocketClient | null;

export function init(): void {
  // Racing+ installs a sandbox that prevents mods from doing unsafe things
  // If the sandbox is in place, then we should be clear to request a socket later on
  const [ok, requiredSandbox] = pcall(require, "sandbox");
  if (!ok) {
    log("Did not detect the sandbox environment.");
    return;
  }

  sandbox = requiredSandbox as Sandbox;

  if (sandbox.init !== undefined) {
    sandbox = null;
    log(
      'Detected sandbox environment, but it was not initialized correctly. (The invocation in the "main.lua" file is probably missing.)',
    );
    return;
  }

  if (!sandbox.isSocketInitialized()) {
    sandbox = null;
    log(
      'Detected sandbox environment, but the socket library failed to load. (The "--luadebug" flag is probably turned off.)',
    );
    return;
  }

  log("Detected sandbox environment.");
}

export function connect(): boolean {
  // Do nothing if the sandbox is not present
  if (sandbox === null) {
    return false;
  }

  // To minimize lag,
  // don't attempt to connect if we have recently tried to connect and it has failed
  const isaacFrameCount = Isaac.GetFrameCount();
  if (
    connectionAttemptFrame !== null &&
    isaacFrameCount <
      connectionAttemptFrame + MIN_FRAMES_BETWEEN_CONNECTION_ATTEMPTS
  ) {
    // Reset the connection attempt frame to this one so that resetting over and over never triggers
    // a connection attempt
    connectionAttemptFrame = isaacFrameCount;
    return false;
  }
  connectionAttemptFrame = isaacFrameCount;

  clientTCP = sandbox.connectLocalhost(TCP_PORT, true);
  if (clientTCP === null) {
    return false;
  }

  clientUDP = sandbox.connectLocalhost(UDP_PORT, false);
  if (clientUDP === null) {
    return false;
  }

  // We check for new socket data on every PostRender frame
  // However, the remote socket might not necessarily have any new data for us
  // Thus, we set the timeout to 0 in order to prevent lag
  clientTCP.settimeout(0);
  clientUDP.settimeout(0);

  return true;
}

export function disconnect(): void {
  clientTCP = null;
  clientUDP = null;
}

export function send(packedMsg: string): [number | undefined, string] {
  if (clientTCP === null) {
    return [undefined, "TCP client is not initialized"];
  }

  return clientTCP.send(packedMsg);
}

export function sendUDP(packedMsg: string): [number | undefined, string] {
  if (clientUDP === null) {
    return [undefined, "UDP client is not initialized"];
  }

  return clientUDP.send(packedMsg);
}

export function receive(): [string | undefined, string] {
  if (clientTCP === null) {
    return [undefined, "TCP client is not initialized"];
  }

  return clientTCP.receive();
}

export function receiveUDP(): [string | undefined, string] {
  if (clientUDP === null) {
    return [undefined, "UDP client is not initialized"];
  }

  return clientUDP.receive();
}

export function isActive(): boolean {
  return clientTCP !== null && clientUDP !== null;
}
