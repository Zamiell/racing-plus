import {
  getRoomIndex,
  onRepentanceStage,
  saveDataManager,
} from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import { initGlowingItemSprite } from "../../../util";
import { isSlideAnimationActive } from "../../mandatory/detectSlideAnimation";

// Near the top-left
const SPRITE_X = 123;
const SPRITE_Y = 17;
const SPRITE_SPACING = 30;

let activeSprite: Sprite | null = null;
let passiveSprite: Sprite | null = null;

const v = {
  run: {
    active: CollectibleType.COLLECTIBLE_NULL,
    passive: CollectibleType.COLLECTIBLE_NULL,
  },
};

export function init(): void {
  saveDataManager("showEdenStartingItems", v, featureEnabled);
}

function featureEnabled() {
  return config.showEdenStartingItems;
}

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  if (!config.showEdenStartingItems) {
    return;
  }

  drawItemSprites();
}

function drawItemSprites() {
  if (isSlideAnimationActive()) {
    return;
  }

  if (activeSprite !== null) {
    const position = Vector(SPRITE_X, SPRITE_Y);
    activeSprite.RenderLayer(0, position);
  }
  if (passiveSprite !== null) {
    const position = Vector(SPRITE_X + SPRITE_SPACING, SPRITE_Y);
    passiveSprite.RenderLayer(0, position);
  }
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
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

// Only show the sprites in the starting room of the first floor
function shouldShowSprites() {
  const stage = g.l.GetStage();
  const startingRoomIndex = g.l.GetStartingRoomIndex();
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();
  const roomIndex = getRoomIndex();

  return (
    (character === PlayerType.PLAYER_EDEN ||
      character === PlayerType.PLAYER_EDEN_B) &&
    stage === 1 &&
    !onRepentanceStage() &&
    roomIndex === startingRoomIndex
  );
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  if (!config.showEdenStartingItems) {
    return;
  }

  storeItemIdentities();
}

function storeItemIdentities() {
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();

  if (
    character !== PlayerType.PLAYER_EDEN &&
    character !== PlayerType.PLAYER_EDEN_B
  ) {
    return;
  }

  v.run.active = player.GetActiveItem(ActiveSlot.SLOT_PRIMARY);
  const passive = getEdenPassiveItem(player);
  if (passive === null) {
    error("Failed to find Eden's passive item.");
  }
  v.run.passive = passive;
}

function getEdenPassiveItem(player: EntityPlayer) {
  const activeItem = player.GetActiveItem(ActiveSlot.SLOT_PRIMARY);
  const highestCollectible = g.itemConfig.GetCollectibles().Size - 1;

  for (let i = 1; i <= highestCollectible; i++) {
    if (
      player.HasCollectible(i) &&
      i !== activeItem &&
      i !== CollectibleType.COLLECTIBLE_D6
    ) {
      return i;
    }
  }

  return null;
}
