import * as startWithD6 from "../features/optional/major/startWithD6";
import g from "../globals";

// ModCallbacks.POST_UPDATE (1)
export function postUpdate(): void {
  const gameFrameCount = Isaac.GetFrameCount();

  // Check to see if it is the frame after the player has used Esau Jr.
  if (
    g.run.usedEsauJrFrame !== 0 &&
    gameFrameCount >= g.run.usedEsauJrFrame + 1
  ) {
    g.run.usedEsauJrFrame = 0;
    postEsauJr();

    if (!g.run.usedEsauJrAtLeastOnce) {
      g.run.usedEsauJrAtLeastOnce = true;
      postFirstEsauJr();
    }
  }
}

// ModCallbacks.USE_ITEM (3)
// CollectibleType.COLLECTIBLE_ESAU_JR (703)
export function useItem(): void {
  const gameFrameCount = Isaac.GetFrameCount();

  // The player only changes to Esau Jr. on the frame after the item is used
  g.run.usedEsauJrFrame = gameFrameCount + 1;
}

function postEsauJr() {}

function postFirstEsauJr() {
  // Assume that the first player is the one who used Esau Jr. a frame ago
  const player = Isaac.GetPlayer();

  startWithD6.postFirstEsauJr(player);
}
