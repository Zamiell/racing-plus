import {
  anyPlayerHasCollectible,
  getRoomIndex,
  gridToPos,
} from "isaacscript-common";
import g from "../../../../globals";
import { initGlowingItemSprite, initSprite } from "../../../../util";
import { bossPNGMap } from "./bossPNGMap";
import v from "./v";

// Near the top-left of the room
const SPRITE_SPACING = 30;

export function set(): void {
  if (!shouldShowSprites()) {
    reset();
    return;
  }

  v.level.dreamCatcherSprite = initGlowingItemSprite(
    CollectibleType.COLLECTIBLE_DREAM_CATCHER,
  );

  for (let i = 0; i < v.level.items.length; i++) {
    if (v.level.itemSprites[i] === null) {
      const collectibleType = v.level.items[i];
      v.level.itemSprites[i] = initGlowingItemSprite(collectibleType);
    }
  }

  for (let i = 0; i < v.level.bosses.length; i++) {
    if (v.level.bossSprites[i] === null) {
      const [entityType, variant] = v.level.bosses[i];
      v.level.bossSprites[i] = initBossSprite(entityType, variant);
    }
  }
}

function initBossSprite(entityType: EntityType, variant: int) {
  const pngArray = bossPNGMap.get(entityType);
  if (pngArray === undefined) {
    error(`Failed to find the boss of ${entityType} in the boss PNG map.`);
  }

  const pngFileName = pngArray[variant];
  if (pngFileName === undefined) {
    error(
      `Failed to find the boss of ${entityType}.${variant} in the boss PNG map.`,
    );
  }

  const pngPath = `gfx/ui/boss/${pngFileName}`;
  return initSprite("gfx/boss.anm2", pngPath);
}

export function reset(): void {
  v.level.dreamCatcherSprite = null;
  v.level.itemSprites = [];
  v.level.bossSprites = [];
}

function shouldShowSprites() {
  const startingRoomIndex = g.l.GetStartingRoomIndex();
  const roomIndex = getRoomIndex();

  return (
    anyPlayerHasCollectible(CollectibleType.COLLECTIBLE_DREAM_CATCHER) &&
    (v.level.items.length > 0 || v.level.bosses.length > 0) &&
    // Only show the sprites in the starting room
    roomIndex === startingRoomIndex &&
    // Disable this feature in Greed Mode, since that is outside of the scope of normal speedruns
    !g.g.IsGreedMode()
  );
}

export function draw(): void {
  const player = Isaac.GetPlayer();
  const playerSprite = player.GetSprite();
  const playerAnimation = playerSprite.GetAnimation();

  if (g.run.slideAnimationHappening && playerAnimation !== "Appear") {
    return;
  }

  const topLeftRoomPosition = gridToPos(1, 1);
  const nextToDreamCatcherPosition = gridToPos(2, 1);

  if (v.level.dreamCatcherSprite !== null) {
    const sprite = v.level.dreamCatcherSprite;
    const renderPosition = Isaac.WorldToRenderPosition(topLeftRoomPosition);
    sprite.RenderLayer(0, renderPosition);
  }

  for (let i = 0; i < v.level.itemSprites.length; i++) {
    const sprite = v.level.itemSprites[i];
    const renderPosition = Isaac.WorldToRenderPosition(
      nextToDreamCatcherPosition,
    );
    const numRightShifts = i;
    const positionAdjustment = Vector(SPRITE_SPACING * numRightShifts, 0);
    const position = renderPosition.add(positionAdjustment);
    sprite.RenderLayer(0, position);
  }

  for (let i = 0; i < v.level.bossSprites.length; i++) {
    const sprite = v.level.bossSprites[i];
    const renderPosition = Isaac.WorldToRenderPosition(
      nextToDreamCatcherPosition,
    );
    const numRightShifts = i + v.level.itemSprites.length;
    const positionAdjustment = Vector(SPRITE_SPACING * numRightShifts, 0);
    const position = renderPosition.add(positionAdjustment);
    sprite.RenderLayer(0, position);
  }
}
