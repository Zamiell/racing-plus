import {
  ActiveSlot,
  CardType,
  CollectibleType,
  ItemType,
  ModCallback,
  PlayerType,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  arrayRemoveInPlace,
  Callback,
  CallbackCustom,
  DefaultMap,
  dequeueItem,
  emptyArray,
  game,
  getCharacterStartingCollectibles,
  getPlayerIndex,
  hasCollectibleInActiveSlot,
  inStartingRoom,
  isActiveCollectible,
  isPickingUpItemCollectible,
  ModCallbackCustom,
  newCollectibleSprite,
  onFirstFloor,
  PickingUpItem,
  PlayerIndex,
  removeCollectible,
  removeCollectibleFromPools,
  sfxManager,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../enums/ChallengeCustom";
import { CollectibleTypeCustom } from "../../../enums/CollectibleTypeCustom";
import { mod } from "../../../mod";
import { hotkeys } from "../../../modConfigMenu";
import { onSeason } from "../../../speedrun/utilsSpeedrun";
import { addCollectibleAndRemoveFromPools } from "../../../utils";
import { ChallengeModFeature } from "../../ChallengeModFeature";
import { hasErrors } from "../mandatory/misc/checkErrors/v";
import { isOnFinalCharacter, isOnFirstCharacter } from "./characterProgress/v";
import {
  SEASON_4_BANNED_COLLECTIBLES,
  SEASON_4_BANNED_COLLECTIBLES_WITH_STORAGE,
  SEASON_4_COLLECTIBLE_OVERFLOW_LENGTH,
  SEASON_4_EXTRA_STARTING_COLLECTIBLE_TYPES_MAP,
  SEASON_4_STORAGE_ICON_OFFSET,
  SEASON_4_STORED_ITEM_POSITIONS,
} from "./season4/constants";

const playersStoringSprites = new DefaultMap<PlayerIndex, Sprite>(() =>
  newCollectibleSprite(CollectibleType.SCHOOLBAG),
);

const v = {
  persistent: {
    storedCollectibles: [] as CollectibleType[],
    storedCollectiblesOnThisRun: [] as CollectibleType[],
  },

  run: {
    playersCurrentlyStoring: new Set<PlayerIndex>(),
    playersStartingCharacter: new Map<PlayerIndex, PlayerType>(),
    playersRemovedExtraStartingItems: new Set<PlayerIndex>(),
  },
};

export class Season4 extends ChallengeModFeature {
  challenge = ChallengeCustom.SEASON_4;
  v = v;

  constructor() {
    super();

    // See the comment in the "FastDrop.ts" file about reading keyboard inputs.
    const keyboardFunc = () =>
      hotkeys.storage === -1 ? undefined : hotkeys.storage;
    mod.setConditionalHotkey(keyboardFunc, checkStoreCollectible);
  }

  // 5, 41
  @Callback(ModCallback.POST_USE_CARD, CardType.RUNE_BLACK)
  postUseCardBlackRune(_card: CardType, player: EntityPlayer): void {
    this.preventBlackRuneOnStoredItems(player);
  }

  preventBlackRuneOnStoredItems(player: EntityPlayer): void {
    if (inRoomWithSeason4StoredItems()) {
      player.AnimateSad();
      player.Kill();
    }
  }

  // 23, 347
  @Callback(ModCallback.PRE_USE_ITEM, CollectibleType.DIPLOPIA)
  preUseItemDiplopia(
    _collectibleType: CollectibleType,
    _rng: RNG,
    player: EntityPlayer,
  ): boolean | undefined {
    return this.preUseItemDuplicateCollectibles(player);
  }

  // 23, 485
  @Callback(ModCallback.PRE_USE_ITEM, CollectibleType.CROOKED_PENNY)
  preUseItemCrookedPenny(
    _collectibleType: CollectibleType,
    _rng: RNG,
    player: EntityPlayer,
  ): boolean | undefined {
    return this.preUseItemDuplicateCollectibles(player);
  }

  preUseItemDuplicateCollectibles(player: EntityPlayer): boolean | undefined {
    if (inRoomWithSeason4StoredItems()) {
      player.AnimateSad();
      return true;
    }

    return undefined;
  }

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReorderedFalse(): void {
    if (hasErrors()) {
      return;
    }

    this.resetDataStructures();
    this.giveStartingItems();
    this.spawnStoredCollectibles();

    removeCollectibleFromPools(...SEASON_4_BANNED_COLLECTIBLES);
  }

  resetDataStructures(): void {
    if (isOnFirstCharacter()) {
      emptyArray(v.persistent.storedCollectibles);
    } else {
      for (const collectibleType of v.persistent.storedCollectiblesOnThisRun) {
        arrayRemoveInPlace(v.persistent.storedCollectibles, collectibleType);
      }
    }
    emptyArray(v.persistent.storedCollectiblesOnThisRun);
    playersStoringSprites.clear();
  }

  giveStartingItems(): void {
    const player = Isaac.GetPlayer();
    const character = player.GetPlayerType();

    const collectibleTypes =
      SEASON_4_EXTRA_STARTING_COLLECTIBLE_TYPES_MAP.get(character);
    if (collectibleTypes !== undefined) {
      for (const collectibleType of collectibleTypes) {
        addCollectibleAndRemoveFromPools(player, collectibleType);
      }
    }
  }

  spawnStoredCollectibles(): void {
    v.persistent.storedCollectibles.forEach((collectibleType, i) => {
      // If there are so many stored collectibles that they take up every available position in the
      // room, then start spawning them on an overlap starting at the top left again.
      const safeIndex = i % SEASON_4_STORED_ITEM_POSITIONS.length;
      const position = SEASON_4_STORED_ITEM_POSITIONS[safeIndex];
      if (position === undefined) {
        error("Failed to find a position for a stored collectible.");
      }

      const collectible = mod.spawnCollectible(collectibleType, position);
      if (
        v.persistent.storedCollectibles.length >
        SEASON_4_COLLECTIBLE_OVERFLOW_LENGTH
      ) {
        collectible.Size /= 3;

        const sprite = collectible.GetSprite();
        sprite.Scale = Vector(0.666, 0.666);
      }
    });
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdate(player: EntityPlayer): void {
    this.checkStorageAnimationComplete(player);
    this.checkChangedCharacter(player);
  }

  checkStorageAnimationComplete(player: EntityPlayer): void {
    const playerIndex = getPlayerIndex(player);
    if (!v.run.playersCurrentlyStoring.has(playerIndex)) {
      return;
    }

    if (player.IsExtraAnimationFinished()) {
      v.run.playersCurrentlyStoring.delete(playerIndex);
      playersStoringSprites.delete(playerIndex);
    }
  }

  checkChangedCharacter(player: EntityPlayer): void {
    const character = player.GetPlayerType();
    const playerIndex = getPlayerIndex(player);

    const removedExtraStartingItems =
      v.run.playersRemovedExtraStartingItems.has(playerIndex);
    if (removedExtraStartingItems) {
      return;
    }

    const startingCharacter = v.run.playersStartingCharacter.get(playerIndex);
    if (startingCharacter === undefined || startingCharacter === character) {
      return;
    }

    const startingCollectibleTypes =
      getCharacterStartingCollectibles(startingCharacter);
    for (const collectibleType of startingCollectibleTypes) {
      // Don't remove the D6 if it is in the pocket item slot.
      if (
        !isActiveCollectible(collectibleType) ||
        hasCollectibleInActiveSlot(
          player,
          collectibleType,
          ActiveSlot.PRIMARY,
          ActiveSlot.SECONDARY,
        )
      ) {
        player.RemoveCollectible(collectibleType);
      }
    }

    const extraStartingCollectibleTypes =
      SEASON_4_EXTRA_STARTING_COLLECTIBLE_TYPES_MAP.get(startingCharacter);
    if (extraStartingCollectibleTypes !== undefined) {
      removeCollectible(player, ...extraStartingCollectibleTypes);
    }

    v.run.playersRemovedExtraStartingItems.add(playerIndex);
  }

  @CallbackCustom(ModCallbackCustom.POST_PLAYER_INIT_LATE)
  postPlayerInitLate(player: EntityPlayer): void {
    const character = player.GetPlayerType();
    const playerIndex = getPlayerIndex(player);
    v.run.playersStartingCharacter.set(playerIndex, character);
  }

  @CallbackCustom(ModCallbackCustom.POST_PLAYER_RENDER_REORDERED)
  postPlayerRenderReordered(player: EntityPlayer): void {
    this.drawStorageIcon(player);
  }

  drawStorageIcon(player: EntityPlayer): void {
    const playerIndex = getPlayerIndex(player);
    if (!v.run.playersCurrentlyStoring.has(playerIndex)) {
      return;
    }

    const sprite = playersStoringSprites.getAndSetDefault(playerIndex);
    const playerScreenPosition = Isaac.WorldToScreen(player.Position);
    const abovePlayerPosition = playerScreenPosition.add(
      SEASON_4_STORAGE_ICON_OFFSET,
    );
    sprite.Render(abovePlayerPosition);
  }

  @CallbackCustom(ModCallbackCustom.PRE_ITEM_PICKUP)
  preItemPickup(_player: EntityPlayer, pickingUpItem: PickingUpItem): void {
    if (
      isPickingUpItemCollectible(pickingUpItem) &&
      inRoomWithSeason4StoredItems()
    ) {
      arrayRemoveInPlace(
        v.persistent.storedCollectibles,
        pickingUpItem.subType,
      );
    }
  }

  @CallbackCustom(
    ModCallbackCustom.PRE_ITEM_PICKUP,
    ItemType.PASSIVE,
    CollectibleTypeCustom.CHECKPOINT,
  )
  preItemPickupCheckpoint(): void {
    emptyArray(v.persistent.storedCollectiblesOnThisRun);
  }
}

function checkStoreCollectible() {
  // We have to explicitly check for the challenge since this is not fired from a callback.
  if (!onSeason(4)) {
    return;
  }

  if (isOnFinalCharacter()) {
    return;
  }

  const player = Isaac.GetPlayer();
  if (
    player.QueuedItem.Item === undefined ||
    !player.QueuedItem.Item.IsCollectible() ||
    // Only allow active collectibles that have not already been touched in order to prevent abuse
    // (e.g. shovel on all 7 characters).
    player.QueuedItem.Touched
  ) {
    return;
  }

  const collectibleType = player.QueuedItem.Item.ID;
  if (SEASON_4_BANNED_COLLECTIBLES_WITH_STORAGE.has(collectibleType)) {
    return;
  }

  storeCollectible(player, collectibleType);
}

function storeCollectible(
  player: EntityPlayer,
  collectibleType: CollectibleType,
) {
  dequeueItem(player);

  v.persistent.storedCollectibles.push(collectibleType);
  v.persistent.storedCollectiblesOnThisRun.push(collectibleType);

  const playerIndex = getPlayerIndex(player);
  v.run.playersCurrentlyStoring.add(playerIndex);

  player.AnimateHappy();
  sfxManager.Stop(SoundEffect.THUMBS_UP);
  sfxManager.Play(SoundEffect.TOOTH_AND_NAIL_TICK);

  const itemPool = game.GetItemPool();
  itemPool.RemoveCollectible(collectibleType);
}

export function inRoomWithSeason4StoredItems(): boolean {
  // We don't want to check to see if one or more collectibles exist because the player could be in
  // the process of taking one of them.
  return onSeason(4) && onFirstFloor() && inStartingRoom();
}
