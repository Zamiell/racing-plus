import g from "../../../../globals";
import { gridToPos } from "../../../../misc";
import { centerPlayers } from "../../../mandatory/centerStart";
import { WarpState } from "./enums";

// Near the top-left of the room
const SPRITE_SPACING = 30;

export function main(): void {
  if (!g.config.showDreamCatcherItem) {
    return;
  }

  repositionPlayer();
  drawItemSprites();
}

function repositionPlayer() {
  if (g.run.level.dreamCatcher.warpState === WarpState.RepositioningPlayer) {
    g.run.level.dreamCatcher.warpState = WarpState.Finished;
    centerPlayers();
  }
}

function drawItemSprites() {
  const playerSprite = g.p.GetSprite();
  const playerAnimation = playerSprite.GetAnimation();

  if (g.run.slideAnimationHappening && playerAnimation !== "Appear") {
    return;
  }

  const topLeftRoomPosition = gridToPos(1, 1);
  const nextToDreamCatcherPosition = gridToPos(2, 1);

  if (g.run.level.dreamCatcher.dreamCatcherSprite !== null) {
    const sprite = g.run.level.dreamCatcher.dreamCatcherSprite;
    const renderPosition = Isaac.WorldToRenderPosition(topLeftRoomPosition);
    sprite.RenderLayer(0, renderPosition);
  }

  for (let i = 0; i < g.run.level.dreamCatcher.itemSprites.length; i++) {
    const sprite = g.run.level.dreamCatcher.itemSprites[i];
    const renderPosition = Isaac.WorldToRenderPosition(
      nextToDreamCatcherPosition,
    );
    const numRightShifts = i;
    const positionAdjustment = Vector(SPRITE_SPACING * numRightShifts, 0);
    const position = renderPosition.__add(positionAdjustment);
    sprite.RenderLayer(0, position);
  }

  for (let i = 0; i < g.run.level.dreamCatcher.bossSprites.length; i++) {
    const sprite = g.run.level.dreamCatcher.bossSprites[i];
    const renderPosition = Isaac.WorldToRenderPosition(
      nextToDreamCatcherPosition,
    );
    const numRightShifts = i + g.run.level.dreamCatcher.itemSprites.length;
    const positionAdjustment = Vector(SPRITE_SPACING * numRightShifts, 0);
    const position = renderPosition.__add(positionAdjustment);
    sprite.RenderLayer(0, position);
  }
}
