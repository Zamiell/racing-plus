export default interface SocketClient {
  receive(): LuaMultiReturn<[data: string | null, errMsg: string]>;
  send(msg: string): LuaMultiReturn<[sentBytes: int | null, errMsg: string]>;
  settimeout(timeout: int): void;
}
