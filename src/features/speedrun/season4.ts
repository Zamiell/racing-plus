import {
  CollectibleType,
  LevelStage,
  PlayerType,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  arrayRemoveInPlace,
  DefaultMap,
  dequeueItem,
  emptyArray,
  game,
  getEffectiveStage,
  getPlayerIndex,
  inStartingRoom,
  isPickingUpItemCollectible,
  newCollectibleSprite,
  PickingUpItem,
  PlayerIndex,
  ReadonlyMap,
  ReadonlySet,
  sfxManager,
} from "isaacscript-common";
import { ChallengeCustom } from "../../enums/ChallengeCustom";
import { CollectibleTypeCustom } from "../../enums/CollectibleTypeCustom";
import { mod } from "../../mod";
import { hotkeys } from "../../modConfigMenu";
import { addCollectibleAndRemoveFromPools } from "../../utilsGlobals";
import { drawErrorText } from "../mandatory/errors";
import { isOnFirstCharacter } from "./speedrun";

export const STARTING_CHARACTERS_FOR_THIRD_AND_BEYOND = [
  PlayerType.BETHANY, // 18
  PlayerType.JACOB, // 19
] as const;

const EXTRA_STARTING_COLLECTIBLE_TYPES_MAP = new ReadonlyMap<
  PlayerType,
  CollectibleType[]
>([
  // 13
  [PlayerType.LILITH, [CollectibleType.DUALITY]],

  // 18
  [PlayerType.BETHANY, [CollectibleType.DUALITY]],

  // 19
  [
    PlayerType.JACOB,
    [CollectibleType.THERES_OPTIONS, CollectibleType.MORE_OPTIONS],
  ],
]);

const BANNED_COLLECTIBLES_WITH_STORAGE = new ReadonlySet<CollectibleType>([
  CollectibleType.WE_NEED_TO_GO_DEEPER, // 84
  CollectibleType.MEGA_BLAST, // 441
  CollectibleType.MEGA_MUSH, // 625
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

const playersStoringSprites = new DefaultMap<PlayerIndex, Sprite>(() =>
  newCollectibleSprite(CollectibleType.SCHOOLBAG),
);

export function init(): void {
  mod.saveDataManager("season4", v);

  // See the comment in the "fastDrop.ts" file about reading keyboard inputs.
  const keyboardFunc = () =>
    hotkeys.storage === -1 ? undefined : hotkeys.storage;
  mod.setConditionalHotkey(keyboardFunc, checkStoreCollectible);
}

function checkStoreCollectible() {
  const challenge = Isaac.GetChallenge();
  if (challenge !== ChallengeCustom.SEASON_4) {
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

// ModCallback.POST_RENDER (2)
export function postRender(): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_4) {
    return;
  }

  drawErrors();
}

function drawErrors() {
  const hud = game.GetHUD();

  if (!hud.IsVisible()) {
    return;
  }

  if (hotkeys.storage === -1) {
    drawErrorText(
      "You must set a hotkey to store items using Mod Config Menu.",
    );
  }
}

// ModCallback.POST_PEFFECT_UPDATE (4)
export function postPEffectUpdate(player: EntityPlayer): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_4) {
    return;
  }

  checkStorageAnimationComplete(player);
  checkChangedCharacter(player);
}

function checkStorageAnimationComplete(player: EntityPlayer) {
  const playerIndex = getPlayerIndex(player);
  if (!v.run.playersCurrentlyStoring.has(playerIndex)) {
    return;
  }

  if (player.IsExtraAnimationFinished()) {
    v.run.playersCurrentlyStoring.delete(playerIndex);
    playersStoringSprites.delete(playerIndex);
  }
}

function checkChangedCharacter(player: EntityPlayer) {
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

  const collectibleTypes =
    EXTRA_STARTING_COLLECTIBLE_TYPES_MAP.get(startingCharacter);
  if (collectibleTypes !== undefined) {
    for (const collectibleType of collectibleTypes) {
      player.RemoveCollectible(collectibleType);
    }
  }

  v.run.playersRemovedExtraStartingItems.add(playerIndex);
}

// ModCallback.POST_USE_CARD (5)
// Card.RUNE_BLACK (41)
export function useCardBlackRune(player: EntityPlayer): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_4) {
    return;
  }

  preventBlackRuneOnStoredItems(player);
}

function preventBlackRuneOnStoredItems(player: EntityPlayer) {
  if (inRoomWithSeason4StoredItems()) {
    player.AnimateSad();
    player.Kill();
  }
}

// ModCallback.POST_GAME_STARTED (15)
export function postGameStarted(): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_4) {
    return;
  }

  // Reset data structures for this season.
  if (isOnFirstCharacter()) {
    emptyArray(v.persistent.storedCollectibles);
  } else {
    for (const collectibleType of v.persistent.storedCollectiblesOnThisRun) {
      arrayRemoveInPlace(v.persistent.storedCollectibles, collectibleType);
    }
  }
  emptyArray(v.persistent.storedCollectiblesOnThisRun);
  playersStoringSprites.clear();

  giveStartingItems();
  spawnStoredCollectibles();
}

function giveStartingItems() {
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();

  const collectibleTypes = EXTRA_STARTING_COLLECTIBLE_TYPES_MAP.get(character);
  if (collectibleTypes !== undefined) {
    for (const collectibleType of collectibleTypes) {
      addCollectibleAndRemoveFromPools(player, collectibleType);
    }
  }

  // Isaac is bugged in challenges; he must be explicitly given the D6. (Additionally, we don't want
  // the revival nerf mechanic to apply to the D6 in this situation.)
  if (character === PlayerType.ISAAC) {
    addCollectibleAndRemoveFromPools(player, CollectibleType.D6);
  }
}

function spawnStoredCollectibles() {
  v.persistent.storedCollectibles.forEach((collectibleType, i) => {
    // If there are so many stored collectibles that they take up every available position in the
    // room, then start spawning them on an overlap starting at the top left again.
    const safeIndex = i % STORED_ITEM_POSITIONS.length;
    const position = STORED_ITEM_POSITIONS[safeIndex];
    if (position === undefined) {
      error("Failed to find a position for a stored collectible.");
    }

    const collectible = mod.spawnCollectible(collectibleType, position);
    if (v.persistent.storedCollectibles.length > COLLECTIBLE_OVERFLOW_LENGTH) {
      collectible.Size /= 3;

      const sprite = collectible.GetSprite();
      sprite.Scale = Vector(0.666, 0.666);
    }
  });
}

// ModCallback.PRE_USE_ITEM (23)
// CollectibleType.DIPLOPIA (347)
export function preUseItemDiplopia(player: EntityPlayer): boolean | undefined {
  return preUseItemDuplicateCollectibles(player);
}

// ModCallback.PRE_USE_ITEM (23)
// CollectibleType.CROOKED_PENNY (485)
export function preUseItemCrookedPenny(
  player: EntityPlayer,
): boolean | undefined {
  return preUseItemDuplicateCollectibles(player);
}

function preUseItemDuplicateCollectibles(
  player: EntityPlayer,
): boolean | undefined {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_4) {
    return;
  }

  if (inRoomWithSeason4StoredItems()) {
    player.AnimateSad();
    return true;
  }

  return undefined;
}

// ModCallback.POST_PLAYER_RENDER (32)
export function postPlayerRender(player: EntityPlayer): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_4) {
    return;
  }

  drawStorageIcon(player);
}

function drawStorageIcon(player: EntityPlayer) {
  const playerIndex = getPlayerIndex(player);
  if (!v.run.playersCurrentlyStoring.has(playerIndex)) {
    return;
  }

  const sprite = playersStoringSprites.getAndSetDefault(playerIndex);
  const playerScreenPosition = Isaac.WorldToScreen(player.Position);
  const abovePlayerPosition = playerScreenPosition.add(STORAGE_ICON_OFFSET);
  sprite.Render(abovePlayerPosition);
}

// ModCallbackCustom.POST_PLAYER_INIT_LATE
export function postPlayerInitLate(player: EntityPlayer): void {
  const character = player.GetPlayerType();
  const playerIndex = getPlayerIndex(player);
  v.run.playersStartingCharacter.set(playerIndex, character);
}

// ModCallbackCustom.PRE_ITEM_PICKUP
export function preItemPickup(
  _player: EntityPlayer,
  pickingUpItem: PickingUpItem,
): void {
  const challenge = Isaac.GetChallenge();
  if (challenge !== ChallengeCustom.SEASON_4) {
    return;
  }

  if (
    isPickingUpItemCollectible(pickingUpItem) &&
    inRoomWithSeason4StoredItems()
  ) {
    arrayRemoveInPlace(v.persistent.storedCollectibles, pickingUpItem.subType);
  }
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
