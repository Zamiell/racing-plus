import SocketClient from "./SocketClient";

/** @noSelf */
export default interface Sandbox {
  isSocketInitialized(): boolean;
  connectLocalhost(port: int, useTCP: boolean): SocketClient;
  traceback(): void;
  getParentFunctionDescription(levels: int): string;
}
