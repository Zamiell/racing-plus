import g from "../../../globals";

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

  send("ping"); // Send a ping as a quick test to see if the socket is still open
  read();
}

function read() {
  if (g.socket.client === null) {
    return;
  }

  const [data, errMsg] = g.socket.client.receive();
  if (data === null) {
    if (errMsg !== "timeout") {
      g.socket.client = null;
      Isaac.DebugString(`Failed to read data: ${errMsg}`);
    }
    return;
  }

  Isaac.DebugString(`Received data: ${data}`);
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  if (!g.config.clientCommunication) {
    return;
  }

  const startSeedString = g.seeds.GetStartSeedString();
  const difficulty = g.g.Difficulty;

  connect();
  send("seed", startSeedString);
  send("difficulty", difficulty.toString());
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
export function postNewLevel(stage: int, stageType: int): void {
  send("level", `${stage}-${stageType}`);
}

// Subroutines
export function send(command: string, data = ""): void {
  if (g.socket.client === null) {
    return;
  }

  const separator = " ";
  const combined = `${command}${separator}${data}`;
  const [sentBytes, errMsg] = g.socket.client.send(combined);
  if (sentBytes === null) {
    Isaac.DebugString(`Failed to send data over the socket: ${errMsg}`);
    g.socket.client = null;
  }
}
