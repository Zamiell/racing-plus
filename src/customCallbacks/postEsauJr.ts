import * as startWithD6 from "../features/optional/major/startWithD6";
import g from "../globals";

// ModCallbacks.POST_UPDATE (1)
export function postUpdate(): void {
  const gameFrameCount = Isaac.GetFrameCount();

  // The player only changes to Esau Jr. on the frame after the item is used
  if (
    g.run.usedEsauJrFrame !== 0 &&
    gameFrameCount >= g.run.usedEsauJrFrame + 1 &&
    !g.run.usedEsauJrAtLeastOnce
  ) {
    g.run.usedEsauJrFrame = 0;
    g.run.usedEsauJrAtLeastOnce = true;
    postFirstEsauJr();
  }

  postEsauJr();
}

// ModCallbacks.USE_ITEM (3)
// CollectibleType.COLLECTIBLE_ESAU_JR (703)
function postFirstEsauJr() {
  startWithD6.postEsauJr();
}

export function useItem(): void {
  const gameFrameCount = Isaac.GetFrameCount();

  // The player only changes to Esau Jr. on the frame after the item is used
  g.run.usedEsauJrFrame = gameFrameCount + 1;
}

function postEsauJr() {}
