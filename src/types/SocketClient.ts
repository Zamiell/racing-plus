export default interface SocketClient {
  receive(): LuaMultiReturn<[data: string | undefined, errMsg: string]>;
  send(
    msg: string,
  ): LuaMultiReturn<[sentBytes: int | undefined, errMsg: string]>;
  settimeout(timeout: int): void;
}
