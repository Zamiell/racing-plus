import { emptyArray, inStartingRoom } from "isaacscript-common";
import g from "../../../../globals";
import { initGlowingItemSprite, initSprite } from "../../../../sprite";
import { bossPNGMap } from "./bossPNGMap";
import v from "./v";

const TOP_LEFT_GRID_INDEX = 32;
const SPRITE_SPACING = 30;

let dreamCatcherSprite: Sprite | null = null;
const itemSprites: Sprite[] = [];
const bossSprites: Sprite[] = [];

export function set(): void {
  if (!shouldShowSprites()) {
    reset();
    return;
  }

  dreamCatcherSprite = initGlowingItemSprite(
    CollectibleType.COLLECTIBLE_DREAM_CATCHER,
  );

  for (let i = 0; i < v.level.collectibles.length; i++) {
    if (itemSprites[i] === undefined) {
      const collectibleType = v.level.collectibles[i];
      itemSprites[i] = initGlowingItemSprite(collectibleType);
    }
  }

  for (let i = 0; i < v.level.bosses.length; i++) {
    if (bossSprites[i] === undefined) {
      const [entityType, variant] = v.level.bosses[i];
      bossSprites[i] = initBossSprite(entityType, variant);
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
  dreamCatcherSprite = null;
  emptyArray(itemSprites);
  emptyArray(bossSprites);
}

function shouldShowSprites() {
  const isGreedMode = g.g.IsGreedMode();

  return (
    (v.level.collectibles.length > 0 || v.level.bosses.length > 0) &&
    // Only show the sprites in the starting room
    inStartingRoom() &&
    // Disable this feature in Greed Mode, since that is outside of the scope of normal speedruns
    !isGreedMode
  );
}

export function draw(): void {
  const hud = g.g.GetHUD();
  const isPaused = g.g.IsPaused();
  const topLeftRoomPosition = g.r.GetGridPosition(TOP_LEFT_GRID_INDEX);
  const nextToDreamCatcherPosition = g.r.GetGridPosition(
    TOP_LEFT_GRID_INDEX + 1,
  );

  if (!hud.IsVisible()) {
    return;
  }

  if (isPaused) {
    return;
  }

  if (dreamCatcherSprite !== null) {
    const renderPosition = Isaac.WorldToRenderPosition(topLeftRoomPosition);
    dreamCatcherSprite.RenderLayer(0, renderPosition);
  }

  itemSprites.forEach((sprite, i) => {
    const renderPosition = Isaac.WorldToRenderPosition(
      nextToDreamCatcherPosition,
    );
    const numRightShifts = i;
    const positionAdjustment = Vector(SPRITE_SPACING * numRightShifts, 0);
    const position = renderPosition.add(positionAdjustment);
    sprite.RenderLayer(0, position);
  });

  bossSprites.forEach((sprite, i) => {
    const renderPosition = Isaac.WorldToRenderPosition(
      nextToDreamCatcherPosition,
    );
    const numRightShifts = i + itemSprites.length;
    const positionAdjustment = Vector(SPRITE_SPACING * numRightShifts, 0);
    const position = renderPosition.add(positionAdjustment);
    sprite.RenderLayer(0, position);
  });
}
