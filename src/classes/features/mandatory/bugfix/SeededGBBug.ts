import {
  FamiliarVariant,
  ModCallback,
  PickupNullSubType,
  PickupVariant,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  game,
  getPickups,
  newRNG,
  onGameFrame,
  setSeed,
  spawnPickup,
} from "isaacscript-common";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

const v = {
  run: {
    rng: newRNG(),
    GBBugVisibleMap: new Map<PtrHash, boolean>(),
    lastSpawnedPickupPtrHash: null as PtrHash | null,
    lastSpawnedPickupFrame: null as int | null,
  },
};

/**
 * In vanilla, GB Bug morphs are determined via the InitSeed of the morphed pickup. This is not good
 * for seeded races because we need the pickups to spawn in order.
 *
 * We can detect when the GB Bug morphs a pickup by looking at the frame that the familiar becomes
 * invisible. However, the PostFamiliarRender callback fires after the pickup has already spawned,
 * so we must keep track of the last spawned pickup so that we can morph it from the
 * PostFamiliarRender callback.
 */
export class SeededGBBug extends MandatoryModFeature {
  v = v;

  // 25, 93
  @Callback(ModCallback.POST_FAMILIAR_RENDER, FamiliarVariant.GB_BUG)
  postFamiliarRenderGBBug(familiar: EntityFamiliar): void {
    const ptrHash = GetPtrHash(familiar);
    const oldVisible = v.run.GBBugVisibleMap.get(ptrHash);
    const visible = familiar.IsVisible();
    v.run.GBBugVisibleMap.set(ptrHash, visible);

    if (oldVisible === true && !visible) {
      this.replaceSpawnedPickup();
    }
  }

  replaceSpawnedPickup(): void {
    const pickup = this.getLastSpawnedPickup();
    if (pickup === undefined) {
      return;
    }

    pickup.Remove();
    this.spawnGBBugPickup(pickup);
  }

  getLastSpawnedPickup(): EntityPickup | undefined {
    if (
      v.run.lastSpawnedPickupPtrHash === null
      || v.run.lastSpawnedPickupFrame === null
    ) {
      return undefined;
    }

    for (const pickup of getPickups()) {
      const ptrHash = GetPtrHash(pickup);

      if (
        ptrHash === v.run.lastSpawnedPickupPtrHash
        && onGameFrame(v.run.lastSpawnedPickupFrame)
      ) {
        return pickup;
      }
    }

    return undefined;
  }

  /**
   * In vanilla, a chest has a greater chance of morphing into another chest, but we ignore this
   * since we want the new pickups to go in order. We can't use the `EntityPickup.Morph` method
   * because then the results would not be seeded properly.
   *
   * @see https://bindingofisaacrebirth.fandom.com/wiki/GB_Bug#Algorithm
   */
  spawnGBBugPickup(oldPickup: EntityPickup): void {
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

  // 34
  @Callback(ModCallback.POST_PICKUP_INIT)
  postPickupInit(pickup: EntityPickup): void {
    v.run.lastSpawnedPickupPtrHash = GetPtrHash(pickup);
    v.run.lastSpawnedPickupFrame = game.GetFrameCount();
  }

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReorderedFalse(): void {
    const seeds = game.GetSeeds();
    const startSeed = seeds.GetStartSeed();
    setSeed(v.run.rng, startSeed);
  }
}
