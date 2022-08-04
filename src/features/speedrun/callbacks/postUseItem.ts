import * as preserveCheckpoint from "../preserveCheckpoint";
import { inSpeedrun } from "../speedrun";

export function voidItem(): void {
  if (!inSpeedrun()) {
    return;
  }

  preserveCheckpoint.useItemVoid();
}
