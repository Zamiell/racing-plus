// In vanilla, GB Bug morphs are determined via the InitSeed of the morphed pickup
// This is no good for seeded races because we need the pickups to spawn in order
// We can detect when the GB Bug morphs a pickup by looking at the frame that the familiar becomes
// invisible
// However, the PostFamiliarRender callback fires after the pickup has already spawned, so we must
// keep track of the last spawned pickup so that we can morph it from the PostFamiliarRender
// callback

import { nextSeed, saveDataManager } from "isaacscript-common";
import g from "../../globals";

const v = {
  run: {
    seed: 0,
    GBBugVisibleMap: new Map<PtrHash, boolean>(),
    lastSpawnedPickupPtrHash: null as PtrHash | null,
    lastSpawnedPickupFrame: null as int | null,
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
export function postPickupInit(pickup: EntityPickup): void {
  v.run.lastSpawnedPickupPtrHash = GetPtrHash(pickup);
  v.run.lastSpawnedPickupFrame = g.g.GetFrameCount();
}

// ModCallbacks.MC_POST_FAMILIAR_RENDER (25)
// FamiliarVariant.GB_BUG (93)
export function postFamiliarRenderGBBug(familiar: EntityFamiliar): void {
  const ptrHash = GetPtrHash(familiar);
  const oldVisible = v.run.GBBugVisibleMap.get(ptrHash);
  const visible = familiar.IsVisible();
  v.run.GBBugVisibleMap.set(ptrHash, visible);

  if (oldVisible === true && !visible) {
    replaceSpawnedPickup();
  }
}

function replaceSpawnedPickup() {
  const pickup = getLastSpawnedPickup();
  if (pickup === null) {
    return;
  }

  pickup.Remove();
  spawnGBBugPickup(pickup);
}

function getLastSpawnedPickup() {
  if (
    v.run.lastSpawnedPickupPtrHash === null ||
    v.run.lastSpawnedPickupFrame === null
  ) {
    return null;
  }

  const gameFrameCount = g.g.GetFrameCount();

  const pickups = Isaac.FindByType(EntityType.ENTITY_PICKUP);
  for (const entity of pickups) {
    const pickup = entity.ToPickup();
    if (pickup === undefined) {
      continue;
    }

    const ptrHash = GetPtrHash(pickup);

    if (ptrHash !== v.run.lastSpawnedPickupPtrHash) {
      continue;
    }

    if (gameFrameCount !== v.run.lastSpawnedPickupFrame) {
      continue;
    }

    return pickup;
  }

  return null;
}

function spawnGBBugPickup(oldPickup: EntityPickup) {
  // https://bindingofisaacrebirth.fandom.com/wiki/GB_Bug#Algorithm
  // In vanilla, a chest has a greater chance of morphing into another chest,
  // but we ignore this since we want morphs to go in order
  v.run.seed = nextSeed(v.run.seed);
  const shouldRollIntoChest = v.run.seed % 10 === 0;
  if (shouldRollIntoChest) {
    v.run.seed = nextSeed(v.run.seed);
    const shouldRollIntoLockedChest = (v.run.seed & 3) === 0;
    const chestVariant = shouldRollIntoLockedChest
      ? PickupVariant.PICKUP_LOCKEDCHEST
      : PickupVariant.PICKUP_CHEST;
    g.g.Spawn(
      EntityType.ENTITY_PICKUP,
      chestVariant,
      oldPickup.Position,
      oldPickup.Velocity,
      oldPickup.SpawnerEntity,
      0,
      v.run.seed,
    );
  } else {
    g.g.Spawn(
      EntityType.ENTITY_PICKUP,
      0,
      oldPickup.Position,
      oldPickup.Velocity,
      oldPickup.SpawnerEntity,
      0,
      v.run.seed,
    );
  }
}
