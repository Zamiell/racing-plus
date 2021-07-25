import * as startWithD6 from "../features/optional/major/startWithD6";
import g from "../globals";

export function postUpdate(): void {
  const gameFrameCount = Isaac.GetFrameCount();

  // Give the pocket D6 to Esau Jr. only one frame after using it because of the player change.
  // Set g.run.usedEsauJrFrame to 0 again to avoid being in a softlock loop where we can't
  // take any item.
  if (
    gameFrameCount >= g.run.usedEsauJrFrame + 1 &&
    g.run.usedEsauJrFrame !== 0
  ) {
    postPlayerChange();
    g.run.usedEsauJrFrame = 0;
  }
}

function postPlayerChange() {
  startWithD6.esauJr();
}
