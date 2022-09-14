import * as preserveCheckpoint from "../preserveCheckpoint";
import { inSpeedrun } from "../speedrun";

export function postUseItemVoid(): void {
  if (!inSpeedrun()) {
    return;
  }

  preserveCheckpoint.postUseItemVoid();
}
