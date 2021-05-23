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
  if (g.run.level.dreamCatcher.warpState === WarpState.REPOSITIONING_PLAYER) {
    g.run.level.dreamCatcher.warpState = WarpState.FINISHED_WARPING;
    centerPlayers();
  }
}

function drawItemSprites() {
  const playerSprite = g.p.GetSprite();
  const playerAnimation = playerSprite.GetAnimation();

  if (g.run.slideAnimationHappening && playerAnimation !== "Appear") {
    return;
  }

  if (g.run.level.dreamCatcher.dreamCatcherSprite !== null) {
    const topLeftRoomPosition = gridToPos(1, 1);
    const renderPosition = Isaac.WorldToRenderPosition(topLeftRoomPosition);
    g.run.level.dreamCatcher.dreamCatcherSprite.RenderLayer(0, renderPosition);
  }

  for (let i = 0; i < g.run.level.dreamCatcher.itemSprites.length; i++) {
    const sprite = g.run.level.dreamCatcher.itemSprites[i];
    const topLeftRoomPosition = gridToPos(2, 1);
    const renderPosition = Isaac.WorldToRenderPosition(topLeftRoomPosition);
    const positionAdjustment = Vector(SPRITE_SPACING * i, 0);
    const position = renderPosition.__add(positionAdjustment);
    sprite.RenderLayer(0, position);
  }
}
