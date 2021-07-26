import * as startWithD6 from "../features/optional/major/startWithD6";
import g from "../globals";

export function postUpdate(): void {
  const gameFrameCount = Isaac.GetFrameCount();

  // The player only changes to Esau Jr. on the frame after the item is used
  if (
    g.run.usedEsauJrFrame !== 0 &&
    gameFrameCount >= g.run.usedEsauJrFrame + 1
  ) {
    g.run.usedEsauJrFrame = 0;
    postEsauJr();
  }
}

function postEsauJr() {
  startWithD6.postEsauJr();
}

export function useItem(): void {
  const gameFrameCount = Isaac.GetFrameCount();

  // The player only changes to Esau Jr. on the frame after the item is used
  g.run.usedEsauJrFrame = gameFrameCount + 1;
}
