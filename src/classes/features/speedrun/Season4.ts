import {
  ActiveSlot,
  CardType,
  Challenge,
  CollectibleType,
  LevelStage,
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
  getEffectiveStage,
  getPlayerIndex,
  hasCollectibleInActiveSlot,
  inStartingRoom,
  isActiveCollectible,
  isPickingUpItemCollectible,
  ModCallbackCustom,
  newCollectibleSprite,
  PickingUpItem,
  PlayerIndex,
  ReadonlyMap,
  ReadonlySet,
  removeCollectible,
  removeCollectibleFromPools,
  sfxManager,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../enums/ChallengeCustom";
import { CollectibleTypeCustom } from "../../../enums/CollectibleTypeCustom";
import {
  isOnFinalCharacter,
  isOnFirstCharacter,
} from "../../../features/speedrun/speedrun";
import { mod } from "../../../mod";
import { hotkeys } from "../../../modConfigMenu";
import { addCollectibleAndRemoveFromPools } from "../../../utilsGlobals";
import { ChallengeModFeature } from "../../ChallengeModFeature";

export const STARTING_CHARACTERS_FOR_THIRD_AND_BEYOND = [
  PlayerType.BETHANY, // 18
  PlayerType.JACOB, // 19
] as const;

const EXTRA_STARTING_COLLECTIBLE_TYPES_MAP = new ReadonlyMap<
  PlayerType,
  CollectibleType[]
>([
  // 13
  [PlayerType.LILITH, [CollectibleType.BIRTHRIGHT]],

  // 18
  [PlayerType.BETHANY, [CollectibleType.DUALITY]],

  // 19
  [
    PlayerType.JACOB,
    [CollectibleType.THERES_OPTIONS, CollectibleType.MORE_OPTIONS],
  ],
]);

const BANNED_COLLECTIBLES = [CollectibleType.WE_NEED_TO_GO_DEEPER] as const;

const BANNED_COLLECTIBLES_WITH_STORAGE = new ReadonlySet<CollectibleType>([
  CollectibleTypeCustom.CHECKPOINT,
]);

const STORED_ITEM_POSITIONS = [
  // Row 1 left
  Vector(80, 160),
  Vector(120, 160),
  Vector(160, 160),
  Vector(200, 160),
  Vector(240, 160),

  // Row 1 right
  Vector(400, 160),
  Vector(440, 160),
  Vector(480, 160),
  Vector(520, 160),
  Vector(560, 160),

  // Row 2 left
  Vector(80, 240),
  Vector(120, 240),
  Vector(160, 240),
  Vector(200, 240),
  Vector(240, 240),

  // Row 2 right
  Vector(400, 240),
  Vector(440, 240),
  Vector(480, 240),
  Vector(520, 240),
  Vector(560, 240),

  // Row 3 left
  Vector(80, 320),
  Vector(120, 320),
  Vector(160, 320),
  Vector(200, 320),
  Vector(240, 320),

  // Row 3 right
  Vector(400, 320),
  Vector(440, 320),
  Vector(480, 320),
  Vector(520, 320),
  Vector(560, 320),

  // Row 4 left
  Vector(80, 400),
  Vector(120, 400),
  Vector(160, 400),
  Vector(200, 400),
  Vector(240, 400),

  // Row 4 right
  Vector(400, 400),
  Vector(440, 400),
  Vector(480, 400),
  Vector(520, 400),
  Vector(560, 400),

  // --------
  // Overflow
  // --------

  // Row 1 left
  Vector(100, 160),
  Vector(140, 160),
  Vector(180, 160),
  Vector(220, 160),

  // Row 1 right
  Vector(420, 160),
  Vector(460, 160),
  Vector(500, 160),
  Vector(540, 160),

  // Row 2 left
  Vector(100, 240),
  Vector(140, 240),
  Vector(180, 240),
  Vector(220, 240),

  // Row 2 right
  Vector(420, 240),
  Vector(460, 240),
  Vector(500, 240),
  Vector(540, 240),

  // Row 3 left
  Vector(100, 320),
  Vector(140, 320),
  Vector(180, 320),
  Vector(220, 320),

  // Row 3 right
  Vector(420, 320),
  Vector(460, 320),
  Vector(500, 320),
  Vector(540, 320),

  // Row 4 left
  Vector(100, 400),
  Vector(140, 400),
  Vector(180, 400),
  Vector(220, 400),

  // Row 4 right
  Vector(420, 400),
  Vector(460, 400),
  Vector(500, 400),
  Vector(540, 400),
] as const;

const COLLECTIBLE_OVERFLOW_LENGTH = 40;

const STORAGE_ICON_OFFSET = Vector(0, -30);

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
  constructor(challenge: Challenge) {
    super(challenge);

    // See the comment in the "fastDrop.ts" file about reading keyboard inputs.
    const keyboardFunc = () =>
      hotkeys.storage === -1 ? undefined : hotkeys.storage;
    mod.setConditionalHotkey(keyboardFunc, checkStoreCollectible);
  }

  @Callback(ModCallback.POST_USE_CARD, CardType.RUNE_BLACK) // 5, 41
  useCardBlackRune(_card: CardType, player: EntityPlayer): void {
    this.preventBlackRuneOnStoredItems(player);
  }

  preventBlackRuneOnStoredItems(player: EntityPlayer): void {
    if (inRoomWithSeason4StoredItems()) {
      player.AnimateSad();
      player.Kill();
    }
  }

  @Callback(ModCallback.PRE_USE_ITEM, CollectibleType.DIPLOPIA) // 23, 347
  preUseItemDiplopia(
    _collectibleType: CollectibleType,
    _rng: RNG,
    player: EntityPlayer,
  ): boolean | undefined {
    return this.preUseItemDuplicateCollectibles(player);
  }

  @Callback(ModCallback.PRE_USE_ITEM, CollectibleType.CROOKED_PENNY) // 23, 485
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

  @Callback(ModCallback.POST_PLAYER_RENDER) // 32
  postPlayerRender(player: EntityPlayer): void {
    this.drawStorageIcon(player);
  }

  drawStorageIcon(player: EntityPlayer): void {
    const playerIndex = getPlayerIndex(player);
    if (!v.run.playersCurrentlyStoring.has(playerIndex)) {
      return;
    }

    const sprite = playersStoringSprites.getAndSetDefault(playerIndex);
    const playerScreenPosition = Isaac.WorldToScreen(player.Position);
    const abovePlayerPosition = playerScreenPosition.add(STORAGE_ICON_OFFSET);
    sprite.Render(abovePlayerPosition);
  }

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED)
  postGameStartedReordered(): void {
    this.resetDataStructures();
    this.giveStartingItems();
    this.spawnStoredCollectibles();
    removeCollectibleFromPools(...BANNED_COLLECTIBLES);
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
      EXTRA_STARTING_COLLECTIBLE_TYPES_MAP.get(character);
    if (collectibleTypes !== undefined) {
      for (const collectibleType of collectibleTypes) {
        addCollectibleAndRemoveFromPools(player, collectibleType);
      }
    }

    // Isaac is bugged in challenges; he must be explicitly given the D6. (Additionally, we don't
    // want the revival nerf mechanic to apply to the D6 in this situation.)
    if (character === PlayerType.ISAAC) {
      addCollectibleAndRemoveFromPools(player, CollectibleType.D6);
    }
  }

  spawnStoredCollectibles(): void {
    v.persistent.storedCollectibles.forEach((collectibleType, i) => {
      // If there are so many stored collectibles that they take up every available position in the
      // room, then start spawning them on an overlap starting at the top left again.
      const safeIndex = i % STORED_ITEM_POSITIONS.length;
      const position = STORED_ITEM_POSITIONS[safeIndex];
      if (position === undefined) {
        error("Failed to find a position for a stored collectible.");
      }

      const collectible = mod.spawnCollectible(collectibleType, position);
      if (
        v.persistent.storedCollectibles.length > COLLECTIBLE_OVERFLOW_LENGTH
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

    const startingCollectibleTypes = [
      ...getCharacterStartingCollectibles(startingCharacter),
    ];
    if (startingCharacter === PlayerType.JACOB) {
      // Racing+ artificially gives Jacob an extra D6.
      startingCollectibleTypes.push(CollectibleType.D6);
    }

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
      EXTRA_STARTING_COLLECTIBLE_TYPES_MAP.get(startingCharacter);
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
}

function checkStoreCollectible() {
  // We have to explicitly check for the challenge since this is not fired from a callback.
  const challenge = Isaac.GetChallenge();
  if (challenge !== ChallengeCustom.SEASON_4) {
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
  if (BANNED_COLLECTIBLES_WITH_STORAGE.has(collectibleType)) {
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

// Called from the `ModCallbackCustom.PRE_ITEM_PICKUP` callback.
export function season4CheckpointTouched(): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_4) {
    return;
  }

  emptyArray(v.persistent.storedCollectiblesOnThisRun);
}

export function inRoomWithSeason4StoredItems(): boolean {
  const challenge = Isaac.GetChallenge();
  const effectiveStage = getEffectiveStage();

  return (
    challenge === ChallengeCustom.SEASON_4 &&
    effectiveStage === LevelStage.BASEMENT_1 &&
    inStartingRoom()
    // We don't want to check to see if one or more collectibles exist because the player could be
    // in the process of taking one of them.
  );
}
