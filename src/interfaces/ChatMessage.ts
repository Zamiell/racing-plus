export interface ChatMessage {
  readonly time: string;
  readonly username: string;
  readonly msg: string;
  renderFrameReceived: int;
}
