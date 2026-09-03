// eslint-disable-next-line complete/type-declaration-immutability
export interface ChatMessage {
  readonly time: string;
  readonly username: string;
  readonly msg: string;
  renderFrameReceived: int;
}
