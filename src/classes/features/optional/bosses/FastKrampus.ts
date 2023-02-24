import {
  CollectibleType,
  EntityType,
  FallenVariant,
  ItemPoolType,
  LevelStage,
  ModCallback,
  PickupVariant,
} from "isaac-typescript-definitions";
import {
  anyPlayerHasCollectible,
  Callback,
  CallbackCustom,
  findFreePosition,
  game,
  getCollectibleName,
  getRandom,
  log,
  ModCallbackCustom,
  newRNG,
  nextSeed,
  onEffectiveStage,
} from "isaacscript-common";
import { mod } from "../../../../mod";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const v = {
  run: {
    /**
     * We cannot use "entity.InitSeed" as the seed for keys because it will cause bugs with the
     * "preventItemRotate" feature of the standard library.
     */
    collectibleRNG: newRNG(),

    startedWithLumpOfCoal: false,
    startedWithHeadOfKrampus: false,
  },
};

/**
 * The game only spawns Krampus' drop after his death animation is over. This takes too long, so
 * manually spawn the drop as soon as Krampus dies. This also prevents the situation where a player
 * can leave the room before the death animation is finished and miss out on a drop.
 */
export class FastKrampus extends ConfigurableModFeature {
  configKey: keyof Config = "FastKrampus";
  v = v;

  // 34, 100
  @Callback(ModCallback.POST_PICKUP_INIT, PickupVariant.COLLECTIBLE)
  postPickupInitCollectible(pickup: EntityPickup): void {
    this.checkRemoveVanillaKrampusDrop(pickup);
  }

  checkRemoveVanillaKrampusDrop(pickup: EntityPickup): void {
    // There is no need to check for the collectible type since the only situation where a Fallen
    // NPC can drop a collectible is Krampus dropping A Lump of Coal or Krampus' Head.
    if (pickup.SpawnerType === EntityType.FALLEN) {
      pickup.Remove();
      log("Removed a vanilla Krampus drop.");
    }
  }

  @CallbackCustom(
    ModCallbackCustom.POST_ENTITY_KILL_FILTER,
    EntityType.FALLEN,
    FallenVariant.KRAMPUS,
  )
  postEntityKillFallen(entity: Entity): void {
    this.spawnKrampusDrop(entity);
  }

  spawnKrampusDrop(entity: Entity): void {
    const collectibleType = this.getKrampusCollectibleType();
    const position = findFreePosition(entity.Position);

    mod.spawnCollectible(
      collectibleType,
      position,
      v.run.collectibleRNG,
      false,
      true,
    );

    const collectibleName = getCollectibleName(collectibleType);
    log(`Spawned fast-Krampus item: ${collectibleName} (${collectibleType})`);
  }

  getKrampusCollectibleType(): CollectibleType {
    const seeds = game.GetSeeds();
    const itemPool = game.GetItemPool();
    const startSeed = seeds.GetStartSeed();

    // Normally, Krampus has a 50% chance of dropping A Lump of Coal and a 50% chance of dropping
    // Krampus' Head. However, we might be in a special situation where we should always spawn one
    // or the other.
    const { coalBanned, headBanned } = this.getKrampusBans();

    if (coalBanned && headBanned) {
      // Since both of the items are banned, make Krampus drop a random Devil Room item.
      return itemPool.GetCollectible(ItemPoolType.DEVIL, true, startSeed);
    }

    if (coalBanned) {
      return CollectibleType.HEAD_OF_KRAMPUS;
    }

    if (headBanned) {
      return CollectibleType.LUMP_OF_COAL;
    }

    // We want to use the starting seed of the run as a base for the random check, but if we use the
    // starting seed without iterating it, coal will always drop in seeded races. This is because
    // the `consistentDevilAngelRooms` feature only selects Devil Rooms 50% of the time.
    const seed = nextSeed(startSeed);
    const chance = getRandom(seed);
    const shouldGetCoal = chance < 0.5;

    return shouldGetCoal
      ? CollectibleType.LUMP_OF_COAL
      : CollectibleType.HEAD_OF_KRAMPUS;
  }

  getKrampusBans(): { coalBanned: boolean; headBanned: boolean } {
    const coalBanned =
      v.run.startedWithLumpOfCoal ||
      anyPlayerHasCollectible(CollectibleType.LUMP_OF_COAL);
    const headBanned =
      v.run.startedWithHeadOfKrampus ||
      anyPlayerHasCollectible(CollectibleType.HEAD_OF_KRAMPUS);

    return { coalBanned, headBanned };
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_LEVEL_REORDERED)
  postNewLevelReordered(): void {
    if (!onEffectiveStage(LevelStage.BASEMENT_2)) {
      return;
    }

    // Since we have reached the second floor, account for if the player "started" with either Lump
    // of Coal or Head of Krampus. (For example, they may have been given as part of the race
    // starting items, or maybe they were picked up in the first Treasure Room through some custom
    // mechanic.)
    v.run.startedWithLumpOfCoal = anyPlayerHasCollectible(
      CollectibleType.LUMP_OF_COAL,
    );
    v.run.startedWithHeadOfKrampus = anyPlayerHasCollectible(
      CollectibleType.HEAD_OF_KRAMPUS,
    );
  }
}
