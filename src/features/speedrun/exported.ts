import { log } from "isaacscript-common";
import {
  restartOnNextFrame,
  setRestartCharacter,
} from "../util/restartOnNextFrame";
import { getCurrentCharacter } from "./speedrun";
import v from "./v";

export function speedrunGetCharacterNum(): number {
  return v.persistent.characterNum;
}

export function speedrunGetFinishedFrames(): number {
  return v.run.finishedFrames === null ? 0 : v.run.finishedFrames;
}

export function speedrunIsFinished(): boolean {
  return v.run.finished;
}

export function speedrunSetFastReset(): void {
  v.persistent.performedFastReset = true;
}

export function speedrunSetNext(goBack = false): void {
  v.persistent.performedFastReset = true; // Otherwise we will go back to the beginning again
  const adjustment = goBack ? -1 : 1;
  v.persistent.characterNum += adjustment;
  restartOnNextFrame();
  const character = getCurrentCharacter();
  setRestartCharacter(character);
  log(
    `Manually switching to the next character for the speedrun: ${v.persistent.characterNum}`,
  );
}
