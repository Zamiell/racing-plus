import { CollectibleType, EntityType } from "isaac-typescript-definitions";
import { emptyArray, game, inStartingRoom, logError } from "isaacscript-common";
import { newGlowingCollectibleSprite, newSprite } from "../../../../../sprite";
import { BOSS_PNG_MAP } from "./bossPNGMap";
import { v } from "./v";

const TOP_LEFT_GRID_INDEX = 32;
const SPRITE_SPACING = 30;

let dreamCatcherSprite: Sprite | undefined;
const itemSprites: Sprite[] = [];
const bossSprites: Sprite[] = [];

export function showDreamCatcherSetSprites(): void {
  if (!shouldShowSprites()) {
    showDreamCatcherResetSprites();
    return;
  }

  dreamCatcherSprite = newGlowingCollectibleSprite(
    CollectibleType.DREAM_CATCHER,
  );

  for (let i = 0; i < v.level.collectibles.length; i++) {
    if (itemSprites[i] === undefined) {
      const collectibleType = v.level.collectibles[i];
      if (collectibleType !== undefined) {
        itemSprites[i] = newGlowingCollectibleSprite(collectibleType);
      }
    }
  }

  for (let i = 0; i < v.level.bosses.length; i++) {
    if (bossSprites[i] === undefined) {
      const boss = v.level.bosses[i];
      if (boss !== undefined) {
        const [entityType, variant] = boss;
        const bossSprite = initBossSprite(entityType, variant);
        if (bossSprite !== undefined) {
          bossSprites[i] = bossSprite;
        }
      }
    }
  }
}

function initBossSprite(entityType: EntityType, variant: int) {
  const pngArray = BOSS_PNG_MAP.get(entityType);
  if (pngArray === undefined) {
    logError(
      `Failed to find the boss of entity type ${entityType} in the boss PNG map.`,
    );
    return undefined;
  }

  const pngFileName = pngArray[variant];
  if (pngFileName === undefined) {
    logError(
      `Failed to find the entity type & variant of ${entityType}.${variant} in the boss PNG map.`,
    );
    return undefined;
  }

  const pngPath = `gfx/ui/boss/${pngFileName}`;
  return newSprite("gfx/boss.anm2", pngPath);
}

export function showDreamCatcherResetSprites(): void {
  dreamCatcherSprite = undefined;
  emptyArray(itemSprites);
  emptyArray(bossSprites);
}

function shouldShowSprites() {
  const isGreedMode = game.IsGreedMode();

  return (
    (v.level.collectibles.length > 0 || v.level.bosses.length > 0) &&
    // Only show the sprites in the starting room.
    inStartingRoom() &&
    // Disable this feature in Greed Mode, since that is outside of the scope of normal speedruns.
    !isGreedMode
  );
}

export function showDreamCatcherDrawSprites(): void {
  const isPaused = game.IsPaused();
  const hud = game.GetHUD();
  const room = game.GetRoom();
  const topLeftRoomPosition = room.GetGridPosition(TOP_LEFT_GRID_INDEX);
  const nextToDreamCatcherPosition = room.GetGridPosition(
    TOP_LEFT_GRID_INDEX + 1,
  );

  if (!hud.IsVisible()) {
    return;
  }

  // We don't care if the sprites show when the game is paused, but we do not want the sprites to
  // show during room slide animations.
  if (isPaused) {
    return;
  }

  if (dreamCatcherSprite !== undefined) {
    const renderPosition = Isaac.WorldToScreen(topLeftRoomPosition);
    dreamCatcherSprite.Render(renderPosition);
  }

  itemSprites.forEach((sprite, i) => {
    const renderPosition = Isaac.WorldToScreen(nextToDreamCatcherPosition);
    const numRightShifts = i;
    const positionAdjustment = Vector(SPRITE_SPACING * numRightShifts, 0);
    const position = renderPosition.add(positionAdjustment);
    sprite.Render(position);
  });

  bossSprites.forEach((sprite, i) => {
    const renderPosition = Isaac.WorldToScreen(nextToDreamCatcherPosition);
    const numRightShifts = i + itemSprites.length;
    const positionAdjustment = Vector(SPRITE_SPACING * numRightShifts, 0);
    const position = renderPosition.add(positionAdjustment);
    sprite.Render(position);
  });
}
