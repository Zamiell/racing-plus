import {
  CollectibleType,
  EntityType,
  PickupVariant,
  PlayerType,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  arrayRemoveInPlace,
  countEntities,
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
  PickingUpItemCollectible,
  PlayerIndex,
  sfxManager,
} from "isaacscript-common";
import { ChallengeCustom } from "../../enums/ChallengeCustom";
import { mod } from "../../mod";
import { hotkeys } from "../../modConfigMenu";
import { addCollectibleAndRemoveFromPools } from "../../utilsGlobals";
import { drawErrorText } from "../mandatory/errors";
import { isOnFirstCharacter } from "./speedrun";

export const STARTING_CHARACTERS_FOR_THIRD_AND_BEYOND = [
  PlayerType.BETHANY, // 18
  PlayerType.JACOB, // 19
] as const;

const STORED_ITEM_GRID_INDEXES = [
  // Row 1 left
  16, 17, 18, 19, 20,

  // Row 1 right
  24, 25, 26, 27, 28,

  // Row 2 left
  46, 47, 48, 49, 50,

  // Row 2 right
  54, 55, 56, 57, 58,

  // Row 3 left
  76, 77, 78, 79, 80,

  // Row 3 right
  84, 85, 86, 87, 88,

  // Row 4 left
  106, 107, 108, 109, 110,

  // Row 4 right
  114, 115, 116, 117, 118,
] as const;

const STORAGE_ICON_OFFSET = Vector(0, -40);

const BANNED_STORAGE_ACTIVE_COLLECTIBLES: ReadonlySet<CollectibleType> =
  new Set([
    CollectibleType.WE_NEED_TO_GO_DEEPER, // 84
    CollectibleType.DIPLOPIA, // 347
    CollectibleType.MEGA_BLAST, // 441
    CollectibleType.CROOKED_PENNY, // 485
  ]);

const v = {
  persistent: {
    storedCollectibles: [] as CollectibleType[],
    storedCollectiblesOnThisRun: [] as CollectibleType[],
  },

  run: {
    playersCurrentlyStoring: new Set<PlayerIndex>(),
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
  const player = Isaac.GetPlayer();

  if (
    player.QueuedItem.Item === undefined ||
    !player.QueuedItem.Item.IsCollectible()
  ) {
    return;
  }

  const collectibleType = player.QueuedItem.Item.ID;
  if (BANNED_STORAGE_ACTIVE_COLLECTIBLES.has(collectibleType)) {
    sfxManager.Play(SoundEffect.BOSS_2_INTRO_ERROR_BUZZ);
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

  // Give extra items to some characters.
  switch (character) {
    // 0
    case PlayerType.ISAAC: {
      addCollectibleAndRemoveFromPools(player, CollectibleType.D6);
      break;
    }

    // 13
    case PlayerType.LILITH: {
      addCollectibleAndRemoveFromPools(player, CollectibleType.BIRTHRIGHT);
      break;
    }

    // 18
    case PlayerType.BETHANY: {
      addCollectibleAndRemoveFromPools(player, CollectibleType.DUALITY);
      break;
    }

    // 19
    case PlayerType.JACOB: {
      addCollectibleAndRemoveFromPools(player, CollectibleType.THERES_OPTIONS); // 249
      addCollectibleAndRemoveFromPools(player, CollectibleType.MORE_OPTIONS); // 414
      break;
    }

    default: {
      break;
    }
  }
}

function spawnStoredCollectibles() {
  v.persistent.storedCollectibles.forEach((collectibleType, i) => {
    // If there are so many stored collectibles that they take up every available position in the
    // room, then start spawning them on an overlap starting at the top left again.
    const safeIndex = i % STORED_ITEM_GRID_INDEXES.length;
    const gridIndex = STORED_ITEM_GRID_INDEXES[safeIndex];
    if (gridIndex === undefined) {
      error("Failed to find a grid index for a stored collectible.");
    }

    mod.spawnCollectible(collectibleType, gridIndex);
  });
}

// ModCallback.PRE_USE_ITEM (23)
// CollectibleType.D6 (105)
export function preUseItemD6(player: EntityPlayer): boolean | undefined {
  // This feature only affects the starting room of the run.
  const effectiveStage = getEffectiveStage();
  if (effectiveStage !== 1 || !inStartingRoom()) {
    return;
  }

  // Prevent using the D6 if there are one or more collectibles in the room.
  const numCheckpoints = countEntities(
    EntityType.PICKUP,
    PickupVariant.COLLECTIBLE,
  );
  if (numCheckpoints > 0) {
    player.AnimateSad();
    return true;
  }

  return undefined;
}

// ModCallback.PRE_USE_ITEM (23)
// CollectibleType.MOVING_BOX (523)
export function preUseItemMovingBox(player: EntityPlayer): boolean | undefined {
  // Use the same logic as the normal D6.
  return preUseItemD6(player);
}

// ModCallback.PRE_USE_ITEM (23)
// CollectibleType.ETERNAL_D6 (609)
export function preUseItemEternalD6(player: EntityPlayer): boolean | undefined {
  // Use the same logic as the normal D6.
  return preUseItemD6(player);
}

// ModCallback.POST_PLAYER_RENDER (32)
export function postPlayerRender(player: EntityPlayer): void {
  const playerIndex = getPlayerIndex(player);
  if (!v.run.playersCurrentlyStoring.has(playerIndex)) {
    return;
  }

  const sprite = playersStoringSprites.getAndSetDefault(playerIndex);
  const playerScreenPosition = Isaac.WorldToScreen(player.Position);
  const abovePlayerPosition = playerScreenPosition.add(STORAGE_ICON_OFFSET);
  sprite.Render(abovePlayerPosition);
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

  if (!isPickingUpItemCollectible(pickingUpItem)) {
    return;
  }

  checkPlayerTakingStoredCollectible(pickingUpItem);
}

function checkPlayerTakingStoredCollectible(
  pickingUpItemCollectible: PickingUpItemCollectible,
) {
  const effectiveStage = getEffectiveStage();

  if (effectiveStage === 1 && inStartingRoom()) {
    arrayRemoveInPlace(
      v.persistent.storedCollectibles,
      pickingUpItemCollectible.subType,
    );
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
