import { ActiveSlot, CollectibleType } from "isaac-typescript-definitions";
import {
  getEffectiveStage,
  inStartingRoom,
  irange,
  isEden,
  MAX_COLLECTIBLE_TYPE,
  saveDataManager,
} from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import { initGlowingItemSprite } from "../../../sprite";

/** Near the top-left. */
const ACTIVE_COLLECTIBLE_SPRITE_POSITION = Vector(123, 17);
const PASSIVE_COLLECTIBLE_SPRITE_OFFSET = Vector(30, 0);
const PASSIVE_COLLECTIBLE_SPRITE_POSITION =
  ACTIVE_COLLECTIBLE_SPRITE_POSITION.add(PASSIVE_COLLECTIBLE_SPRITE_OFFSET);

let activeSprite: Sprite | null = null;
let passiveSprite: Sprite | null = null;

const v = {
  run: {
    active: CollectibleType.NULL,
    passive: CollectibleType.NULL,
  },
};

export function init(): void {
  saveDataManager("showEdenStartingItems", v, featureEnabled);
}

function featureEnabled() {
  return config.showEdenStartingItems;
}

// ModCallback.POST_RENDER (2)
export function postRender(): void {
  if (!config.showEdenStartingItems) {
    return;
  }

  drawItemSprites();
}

function drawItemSprites() {
  const hud = g.g.GetHUD();
  const isPaused = g.g.IsPaused();

  if (!hud.IsVisible()) {
    return;
  }

  // We don't care if the sprites show when the game is paused, but we do not want the sprites to
  // show during room slide animations.
  if (isPaused) {
    return;
  }

  if (activeSprite !== null) {
    activeSprite.RenderLayer(0, ACTIVE_COLLECTIBLE_SPRITE_POSITION);
  }
  if (passiveSprite !== null) {
    passiveSprite.RenderLayer(0, PASSIVE_COLLECTIBLE_SPRITE_POSITION);
  }
}

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (!config.showEdenStartingItems) {
    return;
  }

  resetItemSprites();
  setItemSprites();
}

function resetItemSprites() {
  activeSprite = null;
  passiveSprite = null;
}

function setItemSprites() {
  if (shouldShowSprites()) {
    activeSprite = initGlowingItemSprite(v.run.active);
    passiveSprite = initGlowingItemSprite(v.run.passive);
  }
}

// Only show the sprites in the starting room of the first floor.
function shouldShowSprites() {
  const effectiveStage = getEffectiveStage();
  const player = Isaac.GetPlayer();

  return isEden(player) && effectiveStage === 1 && inStartingRoom();
}

// ModCallback.POST_GAME_STARTED (15)
export function postGameStarted(): void {
  if (!config.showEdenStartingItems) {
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
  const passive = getEdenPassiveItem(player);
  if (passive === undefined) {
    error("Failed to find Eden / Tainted Eden passive item.");
  }
  v.run.passive = passive;
}

function getEdenPassiveItem(player: EntityPlayer) {
  const activeItem = player.GetActiveItem(ActiveSlot.PRIMARY);

  for (const collectibleType of irange(1, MAX_COLLECTIBLE_TYPE)) {
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
