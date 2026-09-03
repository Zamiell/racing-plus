import { setSpriteOpacity, VectorZero } from "isaacscript-common";
import { FastTravelState } from "../../../../../enums/FastTravelState";
import { FADE_TO_BLACK_FRAMES } from "./constants";
import { v } from "./v";

const sprite = Sprite();

// ModCallback.POST_RENDER (2)
export function blackSpritePostRender(): void {
  drawBlackSprite();
}

/** We draw a black sprite on top of the screen in order to fade everything to black. */
function drawBlackSprite() {
  if (v.run.state === FastTravelState.DISABLED) {
    return;
  }

  if (!sprite.IsLoaded()) {
    sprite.Load("gfx/ui/boss/versusscreen.anm2", true);
    sprite.SetFrame("Scene", 0);
    sprite.Scale = Vector(100, 100);
  }

  // Conditionally adjust the opacity.
  if (v.run.state === FastTravelState.FADING_TO_BLACK) {
    const opacity = v.run.renderFramesPassed / FADE_TO_BLACK_FRAMES;
    setSpriteOpacity(sprite, opacity);
  } else if (v.run.state === FastTravelState.FADING_IN) {
    const opacity = 1 - v.run.renderFramesPassed / FADE_TO_BLACK_FRAMES;
    setSpriteOpacity(sprite, opacity);
  }

  sprite.RenderLayer(0, VectorZero);
}

export function setBlackSpriteFullyOpaque(): void {
  setSpriteOpacity(sprite, 1);
}

export function setBlackSpriteFullyTransparent(): void {
  setSpriteOpacity(sprite, 0);
}
