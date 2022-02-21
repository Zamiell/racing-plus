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
