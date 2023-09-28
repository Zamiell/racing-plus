import type { EntityType } from "isaac-typescript-definitions";
import { BossID, CollectibleType } from "isaac-typescript-definitions";
import {
  emptyArray,
  game,
  getBossIDFromEntityTypeVariant,
  getBossPortraitPNGFilePath,
  inStartingRoom,
  logError,
  newSprite,
} from "isaacscript-common";
import { newGlowingCollectibleSprite } from "../../../../../sprite";
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
        const bossSprite = newBossSprite(entityType, variant);
        if (bossSprite !== undefined) {
          bossSprites[i] = bossSprite;
        }
      }
    }
  }
}

function newBossSprite(
  entityType: EntityType,
  variant: int,
): Sprite | undefined {
  let bossID = getBossIDFromEntityTypeVariant(entityType, variant);
  if (bossID === undefined) {
    logError(
      `Failed to get the boss ID corresponding to: ${entityType}.${variant}`,
    );
    bossID = BossID.RAGLICH;
  }

  const pngPath = getBossPortraitPNGFilePath(bossID);
  return newSprite("gfx/boss.anm2", pngPath);
}

export function showDreamCatcherResetSprites(): void {
  dreamCatcherSprite = undefined;
  emptyArray(itemSprites);
  emptyArray(bossSprites);
}

function shouldShowSprites(): boolean {
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

  for (const [i, sprite] of itemSprites.entries()) {
    const renderPosition = Isaac.WorldToScreen(nextToDreamCatcherPosition);
    const numRightShifts = i;
    const positionAdjustment = Vector(SPRITE_SPACING * numRightShifts, 0);
    const position = renderPosition.add(positionAdjustment);
    sprite.Render(position);
  }

  for (const [i, sprite] of bossSprites.entries()) {
    const renderPosition = Isaac.WorldToScreen(nextToDreamCatcherPosition);
    const numRightShifts = i + itemSprites.length;
    const positionAdjustment = Vector(SPRITE_SPACING * numRightShifts, 0);
    const position = renderPosition.add(positionAdjustment);
    sprite.Render(position);
  }
}
