import { DEBUG_LOGGING } from "./constants";

export default function log(msg: string): void {
  Isaac.DebugString(msg);
}

export function debugLog(callbackName: string, begin: boolean): void {
  if (!DEBUG_LOGGING) {
    return;
  }

  const gameFrameCount = Game().GetFrameCount();
  const isaacFrameCount = Isaac.GetFrameCount();
  const verb = begin ? "begin" : "end";

  log(
    `${callbackName} ${verb} (game frame ${gameFrameCount}) (isaac frame ${isaacFrameCount})`,
  );
}
