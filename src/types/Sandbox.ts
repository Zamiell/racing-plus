/** @noSelf */
export interface Sandbox {
  init?: () => void;

  isSocketInitialized(): boolean;
  connectLocalhost(port: int, useTCP: boolean): SocketClient;
  traceback(): void;
  getTraceback(): string;
  getParentFunctionDescription(levels: int): string;
}
