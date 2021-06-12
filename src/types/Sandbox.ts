import SocketClient from "./SocketClient";

export default interface Sandbox {
  isSocketInitialized(): boolean;
  connectLocalhost(this: void, port: int): SocketClient;
}
