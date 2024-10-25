import { newSprite, setSpriteOpacity, VectorZero } from "isaacscript-common";
import { FastTravelState } from "../../../../../enums/FastTravelState";
import { FADE_TO_BLACK_FRAMES } from "./constants";
import { v } from "./v";

const sprite = newSprite("gfx/black.anm2");

// ModCallback.POST_RENDER (2)
export function blackSpritePostRender(): void {
  drawBlackSprite();
}

/** We draw a black sprite on top of the screen in order to fade everything to black. */
function drawBlackSprite() {
  if (v.run.state === FastTravelState.DISABLED) {
    return;
  }

  // Conditionally adjust the opacity.
  if (v.run.state === FastTravelState.FADING_TO_BLACK) {
    const opacity = v.run.renderFramesPassed / FADE_TO_BLACK_FRAMES;
    setSpriteOpacity(sprite, opacity);
  } else if (v.run.state === FastTravelState.FADING_IN) {
    const opacity = 1 - v.run.renderFramesPassed / FADE_TO_BLACK_FRAMES;
    setSpriteOpacity(sprite, opacity);
  }

  sprite.Render(VectorZero);
}

export function setBlackSpriteFullyOpaque(): void {
  setSpriteOpacity(sprite, 1);
}

export function setBlackSpriteFullyTransparent(): void {
  setSpriteOpacity(sprite, 0);
}
