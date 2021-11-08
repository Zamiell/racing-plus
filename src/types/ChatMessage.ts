export interface ChatMessage {
  time: string;
  username: string;
  msg: string;
  /** In Isaac frames. */
  frameReceived: int;
}
