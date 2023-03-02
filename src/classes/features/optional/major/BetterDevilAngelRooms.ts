import {
  CollectibleType,
  EntityType,
  FallenVariant,
  ItemPoolType,
  ItemType,
  LevelStage,
  ModCallback,
  NPCState,
  PickupVariant,
  RoomType,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  emptyArray,
  emptyRoom,
  game,
  getAllPlayers,
  getCollectibleQuality,
  getPlayerFromIndex,
  getPlayerIndex,
  getRoomListIndex,
  giveTrinketsBack,
  inAngelShop,
  inGenesisRoom,
  inRoomType,
  itemConfig,
  ModCallbackCustom,
  onStage,
  repeat,
  setAllRNGToStartSeed,
  temporarilyRemoveTrinket,
} from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../../enums/CollectibleTypeCustom";
import { mod } from "../../../../mod";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";
import { setupSeededAngelRoom } from "./betterDevilAngelRooms/angel";
import {
  checkRespawnKrampus,
  setupSeededDevilRoom,
} from "./betterDevilAngelRooms/devil";
import { v } from "./betterDevilAngelRooms/v";

const MAX_GET_COLLECTIBLE_ATTEMPTS = 100;

export class BetterDevilAngelRooms extends ConfigurableModFeature {
  configKey: keyof Config = "BetterDevilAngelRooms";
  v = v;

  /**
   * Record the frame that the build is rerolled so that this feature will not affect getting the
   * replacement items. This callback is fired for D4, D100, 1-pip dice rooms, and 6-pip dice rooms.
   */
  // 23, 284
  @Callback(ModCallback.PRE_USE_ITEM, CollectibleType.D4)
  preUseItemD4(): boolean | undefined {
    v.room.usedD4Frame = game.GetFrameCount();
    return undefined;
  }

  /**
   * Prevent pitfalls from displaying an "Appear" animation when in Devil Rooms, as it is
   * distracting. This must be in the `POST_NPC_INIT` callback because we want to cancel the
   * animation on both the first spawning and subsequent entries to the room. There is also a bug
   * where if you try to do this in the `POST_NEW_ROOM` callback, the Pitfall becomes invisible.
   */
  // 27
  @Callback(ModCallback.POST_NPC_INIT, EntityType.PITFALL)
  postNPCInitPitfall(npc: EntityNPC): void {
    if (inRoomType(RoomType.DEVIL)) {
      npc.State = NPCState.IDLE;
    }
  }

  /**
   * Guppy's Eye will not work correctly with Red Chests that grant a devil deal item because
   * Racing+ changes what the vanilla pools normally give. Since there is not a Guppy's Eye API,
   * this bug is not fixable. However, as a workaround, we can temporarily remove Guppy's Eye from
   * the player to reduce confusion.
   */
  // 34, 360
  @Callback(ModCallback.POST_PICKUP_INIT, PickupVariant.RED_CHEST)
  postPickupInitRedChest(): void {
    if (!onStage(LevelStage.DARK_ROOM_CHEST)) {
      return;
    }

    const roomListIndex = getRoomListIndex();

    for (const player of getAllPlayers()) {
      const numGuppysEye = player.GetCollectibleNum(CollectibleType.GUPPYS_EYE);
      repeat(numGuppysEye, () => {
        player.RemoveCollectible(
          CollectibleType.GUPPYS_EYE,
          false,
          undefined,
          false,
        );

        const playerIndex = getPlayerIndex(player);
        v.run.regiveGuppysEyePlayers.push(playerIndex);
        v.run.regiveGuppysEyeRoomListIndex = roomListIndex;
      });
    }
  }

  // 62
  @Callback(ModCallback.PRE_GET_COLLECTIBLE)
  preGetCollectible(itemPoolType: ItemPoolType): CollectibleType | undefined {
    if (v.run.gettingCollectible) {
      return undefined;
    }

    const gameFrameCount = game.GetFrameCount();

    if (gameFrameCount === v.room.usedD4Frame) {
      return undefined;
    }

    if (
      itemPoolType !== ItemPoolType.DEVIL && // 3
      itemPoolType !== ItemPoolType.ANGEL // 4
    ) {
      return undefined;
    }

    // There is an unknown bug that causes collectibles in Genesis rooms to come from incorrect item
    // pools. Work around this by disabling this feature when the player is in a Genesis room.
    if (inGenesisRoom()) {
      return undefined;
    }

    // As soon as we enter a Devil Room or an Angel Room, vanilla collectibles may spawn before we
    // have had a chance to delete them. This will modify the item pool relating to the room. To
    // counteract this, replace all vanilla items with an arbitrary placeholder item, which should
    // not affect pools. The placeholder item will be deleted later on this frame.
    if (
      !v.level.vanillaCollectiblesHaveSpawnedInCustomRoom &&
      inRoomType(RoomType.DEVIL, RoomType.ANGEL) &&
      !inAngelShop()
    ) {
      return CollectibleTypeCustom.DEBUG;
    }

    return this.getDevilOrAngelCollectibleInOrder(itemPoolType);
  }

  getDevilOrAngelCollectibleInOrder(
    itemPoolType: ItemPoolType.DEVIL | ItemPoolType.ANGEL,
  ): CollectibleType | undefined {
    const player = Isaac.GetPlayer();

    // The NO trinket has a special effect when it is golden.
    const numNoTrinket = player.GetTrinketMultiplier(TrinketType.NO);
    const shouldRerollQuality0 = numNoTrinket >= 2;

    // We need to account for the NO trinket; if the player has it, we need to temporarily remove
    // it, otherwise the random items selected will not be consistent.
    const trinketSituation = temporarilyRemoveTrinket(player, TrinketType.NO);

    // Only attempt to find a valid item for N iterations in case something goes wrong.
    for (let i = 0; i < MAX_GET_COLLECTIBLE_ATTEMPTS; i++) {
      v.run.gettingCollectible = true;
      const collectibleType = this.getNewCollectibleType(itemPoolType);
      v.run.gettingCollectible = false;

      // Simply return the new sub-type if we do not have the NO trinket.
      if (trinketSituation === undefined) {
        return collectibleType;
      }

      // Otherwise, check to see if this is an active item.
      const itemConfigItem = itemConfig.GetCollectible(collectibleType);
      if (
        itemConfigItem === undefined ||
        itemConfigItem.Type === ItemType.ACTIVE
      ) {
        continue;
      }

      if (shouldRerollQuality0) {
        const quality = getCollectibleQuality(collectibleType);
        if (quality === 0) {
          continue;
        }
      }

      // It is not an active item. Give the NO trinket back and return the new sub-type.
      giveTrinketsBack(player, trinketSituation);
      return collectibleType;
    }

    return undefined;
  }

  getNewCollectibleType(
    itemPoolType: ItemPoolType.DEVIL | ItemPoolType.ANGEL,
  ): CollectibleType {
    const itemPool = game.GetItemPool();

    switch (itemPoolType) {
      // 3
      case ItemPoolType.DEVIL: {
        const seed = v.run.rng.devilCollectibles.Next();
        return itemPool.GetCollectible(itemPoolType, true, seed);
      }

      // 4
      case ItemPoolType.ANGEL: {
        const seed = v.run.rng.angelCollectibles.Next();
        return itemPool.GetCollectible(itemPoolType, true, seed);
      }
    }
  }

  @CallbackCustom(
    ModCallbackCustom.POST_ENTITY_KILL_FILTER,
    EntityType.FALLEN,
    FallenVariant.KRAMPUS,
  )
  postEntityKillKrampus(): void {
    v.level.killedKrampusOnThisFloor = true;
  }

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReorderedFalse(): void {
    setAllRNGToStartSeed(v.run.rng);
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    this.checkDevilAngelRoomReplacement();
    this.checkRegiveGuppysEye();
  }

  checkDevilAngelRoomReplacement(): void {
    const room = game.GetRoom();
    const isFirstVisit = room.IsFirstVisit();

    if (!isFirstVisit) {
      checkRespawnKrampus();
      return;
    }

    if (!inRoomType(RoomType.DEVIL, RoomType.ANGEL)) {
      return;
    }

    // Angel shops do not need to be seeded.
    if (inAngelShop()) {
      return;
    }

    if (v.run.intentionallyLeaveEmpty) {
      v.run.intentionallyLeaveEmpty = false;
      emptyRoom();
      mod.preventGridEntityRespawn();
      return;
    }

    v.level.vanillaCollectiblesHaveSpawnedInCustomRoom = true;

    if (inRoomType(RoomType.DEVIL)) {
      setupSeededDevilRoom();
    } else if (inRoomType(RoomType.ANGEL)) {
      setupSeededAngelRoom();
    }
  }

  checkRegiveGuppysEye(): void {
    if (v.run.regiveGuppysEyePlayers.length === 0) {
      return;
    }

    // Wait until we switch rooms before giving back the Guppy's Eye that we took away.
    const roomListIndex = getRoomListIndex();
    if (roomListIndex === v.run.regiveGuppysEyeRoomListIndex) {
      return;
    }

    for (const playerIndex of v.run.regiveGuppysEyePlayers) {
      const player = getPlayerFromIndex(playerIndex);
      if (player !== undefined) {
        player.AddCollectible(CollectibleType.GUPPYS_EYE, 0, false);
      }
    }

    emptyArray(v.run.regiveGuppysEyePlayers);
    v.run.regiveGuppysEyeRoomListIndex = null;
  }
}

export function setDevilAngelDebugRoom(num: int): void {
  v.run.debugRoomNum = num;
}

export function setDevilAngelEmpty(): void {
  v.run.intentionallyLeaveEmpty = true;
}
