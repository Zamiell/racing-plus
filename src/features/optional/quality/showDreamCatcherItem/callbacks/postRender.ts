import { gridToPos } from "isaacscript-common";
import g from "../../../../../globals";
import { config } from "../../../../../modConfigMenu";
import { centerPlayers } from "../../../../mandatory/centerStart";
import { WarpState } from "../enums";
import v from "../v";

// Near the top-left of the room
const SPRITE_SPACING = 30;

export default function showDreamCatcherItemPostRender(): void {
  if (!config.showDreamCatcherItem) {
    return;
  }

  repositionPlayer();
  drawItemSprites();
}

function repositionPlayer() {
  if (v.level.warpState === WarpState.RepositioningPlayer) {
    v.level.warpState = WarpState.Finished;
    centerPlayers();
  }
}

function drawItemSprites() {
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
