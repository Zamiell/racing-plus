import { saveDataManager } from "isaacscript-common";
import g from "../../globals";

const v = {
  run: {
    seed: 0,
    GBBugVisibleMap: new Map<PtrHash, boolean>(),
    lastFrameOfGBBugActivation: null as int | null,
  },
};

export function init(): void {
  saveDataManager("seededGBBug", v);
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  v.run.seed = g.seeds.GetStartSeed();
}

// ModCallbacks.MC_POST_PICKUP_INIT (34)
export function postPickupInit(_pickup: EntityPickup): void {
  const gameFrameCount = g.g.GetFrameCount();

  if (gameFrameCount !== v.run.lastFrameOfGBBugActivation) {
    return;
  }

  // pickup.Remove();
  spawnNewGBBugPickup();
}

function spawnNewGBBugPickup() {
  // TODO need the algorithm for how GB Bug determines pickups
}

// ModCallbacks.MC_POST_FAMILIAR_RENDER (25)
// FamiliarVariant.GB_BUG (93)
export function postFamiliarRenderGBBug(familiar: EntityFamiliar): void {
  const gameFrameCount = g.g.GetFrameCount();

  const ptrHash = GetPtrHash(familiar);
  const oldVisible = v.run.GBBugVisibleMap.get(ptrHash);
  const visible = familiar.IsVisible();
  v.run.GBBugVisibleMap.set(ptrHash, visible);

  if (oldVisible === true && !visible) {
    v.run.lastFrameOfGBBugActivation = gameFrameCount;
  }
}
