import { ActiveSlot, CollectibleType } from "isaac-typescript-definitions";
import { game, inStartingRoom, isEden, onFirstFloor } from "isaacscript-common";
import { mod } from "../../../mod";
import { config } from "../../../modConfigMenu";
import { newGlowingCollectibleSprite } from "../../../sprite";

/** Near the top-left. */
const ACTIVE_COLLECTIBLE_SPRITE_POSITION = Vector(123, 17);
const PASSIVE_COLLECTIBLE_SPRITE_OFFSET = Vector(30, 0);
const PASSIVE_COLLECTIBLE_SPRITE_POSITION =
  ACTIVE_COLLECTIBLE_SPRITE_POSITION.add(PASSIVE_COLLECTIBLE_SPRITE_OFFSET);

let activeSprite: Sprite | undefined;
let passiveSprite: Sprite | undefined;

const v = {
  run: {
    active: CollectibleType.NULL,
    passive: CollectibleType.NULL,
  },
};

export function init(): void {
  mod.saveDataManager("showEdenStartingItems", v, featureEnabled);
}

function featureEnabled() {
  return config.ShowEdenStartingItems;
}

// ModCallback.POST_RENDER (2)
export function postRender(): void {
  if (!config.ShowEdenStartingItems) {
    return;
  }

  drawItemSprites();
}

function drawItemSprites() {
  const isPaused = game.IsPaused();
  const hud = game.GetHUD();

  if (!hud.IsVisible()) {
    return;
  }

  // We don't care if the sprites show when the game is paused, but we do not want the sprites to
  // show during room slide animations.
  if (isPaused) {
    return;
  }

  if (activeSprite !== undefined) {
    activeSprite.Render(ACTIVE_COLLECTIBLE_SPRITE_POSITION);
  }
  if (passiveSprite !== undefined) {
    passiveSprite.Render(PASSIVE_COLLECTIBLE_SPRITE_POSITION);
  }
}

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (!config.ShowEdenStartingItems) {
    return;
  }

  resetItemSprites();
  setItemSprites();
}

function resetItemSprites() {
  activeSprite = undefined;
  passiveSprite = undefined;
}

function setItemSprites() {
  if (shouldShowSprites()) {
    activeSprite = newGlowingCollectibleSprite(v.run.active);
    passiveSprite = newGlowingCollectibleSprite(v.run.passive);
  }
}

// Only show the sprites in the starting room of the first floor.
function shouldShowSprites() {
  const player = Isaac.GetPlayer();

  return isEden(player) && onFirstFloor() && inStartingRoom();
}

// ModCallback.POST_GAME_STARTED (15)
export function postGameStarted(): void {
  if (!config.ShowEdenStartingItems) {
    return;
  }

  storeItemIdentities();
}

function storeItemIdentities() {
  const player = Isaac.GetPlayer();

  if (!isEden(player)) {
    return;
  }

  v.run.active = player.GetActiveItem(ActiveSlot.PRIMARY);
  const passive = getEdenPassiveItemStarted(player);
  if (passive === undefined) {
    error("Failed to find Eden / Tainted Eden passive item.");
  }
  v.run.passive = passive;
}

function getEdenPassiveItemStarted(
  player: EntityPlayer,
): CollectibleType | undefined {
  const activeItem = player.GetActiveItem(ActiveSlot.PRIMARY);

  for (const collectibleType of mod.getCollectibleArray()) {
    if (
      player.HasCollectible(collectibleType) &&
      collectibleType !== activeItem &&
      collectibleType !== CollectibleType.D6
    ) {
      return collectibleType;
    }
  }

  return undefined;
}

export function changeStartingPassiveItem(
  collectibleType: CollectibleType,
): void {
  v.run.passive = collectibleType;
  setItemSprites();
}
