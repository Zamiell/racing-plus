import {
  AngelVariant,
  CollectibleType,
  EntityType,
  ModCallback,
  NPCState,
  PickupVariant,
  RoomType,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  ReadonlySet,
  anyPlayerHasCollectible,
  anyPlayerHasTrinket,
  asNumber,
  doesEntityExist,
  findFreePosition,
  game,
  inRoomType,
  newRNG,
  setSeed,
  spawnCollectible,
} from "isaacscript-common";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const ANGEL_ENTITY_TYPES = new ReadonlySet([
  EntityType.URIEL, // 271
  EntityType.GABRIEL, // 272
]);

const v = {
  run: {
    /**
     * We cannot use "entity.InitSeed" as the seed for keys because it will cause bugs with the
     * "preventItemRotate" feature of the standard library.
     */
    collectibleRNG: newRNG(),
  },
};

/**
 * The game only spawns key pieces from angels after the death animation is over. This takes too
 * long, so manually spawn the key pieces as soon as the angel dies. This also prevents the
 * situation where a player can leave the room before the death animation is finished and miss out
 * on a key piece.
 */
export class FastAngels extends ConfigurableModFeature {
  configKey: keyof Config = "FastAngels";
  v = v;

  // 68
  @Callback(ModCallback.POST_ENTITY_KILL)
  postEntityKill(entity: Entity): void {
    if (this.shouldSpawnKeyPiece(entity)) {
      this.spawnKeyPiece(entity);
      this.morphDyingAngel(entity);
    }
  }

  shouldSpawnKeyPiece(entity: Entity): boolean {
    if (!ANGEL_ENTITY_TYPES.has(entity.Type)) {
      return false;
    }

    // Fallen Angels do not drop key pieces.
    if (entity.Variant !== asNumber(AngelVariant.NORMAL)) {
      return false;
    }

    // We don't want to drop key pieces from angels in Victory Lap bosses or the Boss Rush.
    if (
      !inRoomType(
        RoomType.SUPER_SECRET, // 8
        RoomType.SACRIFICE, // 13
        RoomType.ANGEL, // 15
      )
    ) {
      // Key pieces dropping from angels in non-Angel Rooms was introduced in Booster Pack 4.
      return false;
    }

    // Do not drop any key pieces if the player already has both of them. (This matches the behavior
    // of vanilla.)
    if (
      anyPlayerHasCollectible(CollectibleType.KEY_PIECE_1) // 238
      && anyPlayerHasCollectible(CollectibleType.KEY_PIECE_2) // 239
      && !anyPlayerHasTrinket(TrinketType.FILIGREE_FEATHERS) // 123
    ) {
      return false;
    }

    return true;
  }

  /**
   * Morph the boss into an arbitrary other boss so that it does not drop a vanilla key piece or
   * Angel Room item (with Filigree Feather). This is a better solution that removing the extra
   * collectible in the `PRE_ENTITY_SPAWN` or `POST_PICKUP_INIT` callbacks because it would
   * decrement items from pools if the player has Filigree Feather.
   */
  morphDyingAngel(entity: Entity): void {
    const npc = entity.ToNPC();
    if (npc === undefined) {
      return;
    }

    const sprite = npc.GetSprite();
    const fileName = sprite.GetFilename();
    const animation = sprite.GetAnimation();
    const frameNum = sprite.GetFrame();

    // We must change the state to prevent Monstro from doing an attack as he dies. We do it before
    // and after the morph to be safe.
    // https://clips.twitch.tv/AmazingPiercingStrawberryDancingBanana-YIyY5ZCoLcH3WJ14
    npc.State = NPCState.APPEAR;

    npc.Morph(EntityType.MONSTRO, 0, 0, -1);

    npc.State = NPCState.APPEAR;

    sprite.Load(fileName, true);
    sprite.SetAnimation(animation);
    sprite.SetFrame(frameNum);
  }

  spawnKeyPiece(entity: Entity): void {
    const collectibleType = this.getAngelCollectibleType(entity);
    const position = findFreePosition(entity.Position);

    // In vanilla, on Tainted Keeper, for Filigree Feather items, the item is always free.
    spawnCollectible(
      collectibleType,
      position,
      v.run.collectibleRNG,
      false,
      true,
    );
  }

  getAngelCollectibleType(
    entity: Entity,
  ):
    | CollectibleType.KEY_PIECE_1
    | CollectibleType.KEY_PIECE_2
    | CollectibleType.NULL {
    const hasFiligreeFeather = anyPlayerHasTrinket(
      TrinketType.FILIGREE_FEATHERS,
    );
    const hasKeyPiece1 = anyPlayerHasCollectible(CollectibleType.KEY_PIECE_1);
    const hasKeyPiece2 = anyPlayerHasCollectible(CollectibleType.KEY_PIECE_2);
    const keyPiece1Spawned = doesEntityExist(
      EntityType.PICKUP,
      PickupVariant.COLLECTIBLE,
      CollectibleType.KEY_PIECE_1,
    );
    const keyPiece2Spawned = doesEntityExist(
      EntityType.PICKUP,
      PickupVariant.COLLECTIBLE,
      CollectibleType.KEY_PIECE_2,
    );

    // First, handle the special case of the Filigree Feather trinket.
    if (hasFiligreeFeather) {
      // Even if the player has both key pieces, Filigree Feather will still make an angel drop a
      // random item.
      return CollectibleType.NULL; // A random item
    }

    // Second, try to assign key pieces based on the type of angel that was killed.
    if (
      entity.Type === EntityType.URIEL
      && !hasKeyPiece1
      && !keyPiece1Spawned
    ) {
      return CollectibleType.KEY_PIECE_1;
    }

    if (
      entity.Type === EntityType.GABRIEL
      && !hasKeyPiece2
      && !keyPiece2Spawned
    ) {
      return CollectibleType.KEY_PIECE_2;
    }

    // Third, try to assign key pieces based on what the players have already.
    if (hasKeyPiece1) {
      return CollectibleType.KEY_PIECE_2;
    }

    if (hasKeyPiece2) {
      return CollectibleType.KEY_PIECE_1;
    }

    // Fourth, try to assign key pieces based on the ones that are already dropped (from fighting
    // multiple angels in the same room).
    if (keyPiece1Spawned) {
      return CollectibleType.KEY_PIECE_2;
    }

    if (keyPiece2Spawned) {
      return CollectibleType.KEY_PIECE_1;
    }

    // Spawn key piece 1 by default.
    return CollectibleType.KEY_PIECE_1;
  }

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReorderedFalse(): void {
    const seeds = game.GetSeeds();
    const startSeed = seeds.GetStartSeed();
    setSeed(v.run.collectibleRNG, startSeed);
  }
}
