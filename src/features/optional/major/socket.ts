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

  connect();
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
    g.socket.client.settimeout(0);
  }
}

function send(msg: string): void {
  if (g.socket.client === null) {
    return;
  }

  const [sentBytes, errMsg] = g.socket.client.send(msg);
  if (sentBytes === null) {
    Isaac.DebugString(`Failed to send data over the socket: ${errMsg}`);
    g.socket.client = null;
  }
}
