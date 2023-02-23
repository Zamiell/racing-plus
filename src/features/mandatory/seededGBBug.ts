// In vanilla, GB Bug morphs are determined via the InitSeed of the morphed pickup. This is not good
// for seeded races because we need the pickups to spawn in order.

// We can detect when the GB Bug morphs a pickup by looking at the frame that the familiar becomes
// invisible. However, the PostFamiliarRender callback fires after the pickup has already spawned,
// so we must keep track of the last spawned pickup so that we can morph it from the
// PostFamiliarRender callback.

import { PickupNullSubType, PickupVariant } from "isaac-typescript-definitions";
import {
  game,
  getPickups,
  newRNG,
  setSeed,
  spawnPickup,
} from "isaacscript-common";
import { mod } from "../../mod";

const v = {
  run: {
    rng: newRNG(),
    GBBugVisibleMap: new Map<PtrHash, boolean>(),
    lastSpawnedPickupPtrHash: null as PtrHash | null,
    lastSpawnedPickupFrame: null as int | null,
  },
};

export function init(): void {
  mod.saveDataManager("seededGBBug", v);
}

// ModCallback.POST_GAME_STARTED (15)
export function postGameStarted(): void {
  const seeds = game.GetSeeds();
  const startSeed = seeds.GetStartSeed();
  setSeed(v.run.rng, startSeed);
}

// ModCallback.POST_PICKUP_INIT (34)
export function postPickupInit(pickup: EntityPickup): void {
  v.run.lastSpawnedPickupPtrHash = GetPtrHash(pickup);
  v.run.lastSpawnedPickupFrame = game.GetFrameCount();
}

// ModCallback.POST_FAMILIAR_RENDER (25)
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
  if (pickup === undefined) {
    return;
  }

  pickup.Remove();
  spawnGBBugPickup(pickup);
}

function getLastSpawnedPickup(): EntityPickup | undefined {
  if (
    v.run.lastSpawnedPickupPtrHash === null ||
    v.run.lastSpawnedPickupFrame === null
  ) {
    return undefined;
  }

  const gameFrameCount = game.GetFrameCount();

  for (const pickup of getPickups()) {
    const ptrHash = GetPtrHash(pickup);

    if (ptrHash !== v.run.lastSpawnedPickupPtrHash) {
      continue;
    }

    if (gameFrameCount !== v.run.lastSpawnedPickupFrame) {
      continue;
    }

    return pickup;
  }

  return undefined;
}

function spawnGBBugPickup(oldPickup: EntityPickup) {
  // https://bindingofisaacrebirth.fandom.com/wiki/GB_Bug#Algorithm
  // In vanilla, a chest has a greater chance of morphing into another chest, but we ignore this
  // since we want the new pickups to go in order. We can't use the `EntityPickup.Morph` method
  // because then the results would not be seeded properly.
  const chestSeed = v.run.rng.Next();
  const shouldRollIntoChest = chestSeed % 10 === 0;
  if (shouldRollIntoChest) {
    const lockedChestSeed = v.run.rng.Next();
    const shouldRollIntoLockedChest = (lockedChestSeed & 3) === 0;
    const chestVariant = shouldRollIntoLockedChest
      ? PickupVariant.LOCKED_CHEST
      : PickupVariant.CHEST;
    const seed = v.run.rng.Next();
    spawnPickup(
      chestVariant,
      0,
      oldPickup.Position,
      oldPickup.Velocity,
      oldPickup.SpawnerEntity,
      seed,
    );
  } else {
    const seed = v.run.rng.Next();
    spawnPickup(
      PickupVariant.NULL,
      PickupNullSubType.EXCLUDE_COLLECTIBLES_CHESTS,
      oldPickup.Position,
      oldPickup.Velocity,
      oldPickup.SpawnerEntity,
      seed,
    );
  }
}
