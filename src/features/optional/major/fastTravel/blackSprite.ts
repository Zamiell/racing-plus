// We draw a black sprite on top of the screen in order to fade everything to black

import { initSprite } from "../../../../sprite";
import { FADE_TO_BLACK_FRAMES } from "./constants";
import { FastTravelState } from "./enums";
import v from "./v";

const sprite = initSprite("gfx/black.anm2");

export function draw(): void {
  if (v.run.state === FastTravelState.DISABLED) {
    return;
  }

  // Conditionally adjust the opacity
  if (v.run.state === FastTravelState.FADING_TO_BLACK) {
    const opacity = v.run.framesPassed / FADE_TO_BLACK_FRAMES;
    sprite.Color = Color(1, 1, 1, opacity, 0, 0, 0);
  } else if (v.run.state === FastTravelState.FADING_IN) {
    const opacity = 1 - v.run.framesPassed / FADE_TO_BLACK_FRAMES;
    sprite.Color = Color(1, 1, 1, opacity, 0, 0, 0);
  }

  sprite.RenderLayer(0, Vector.Zero);
}

export function setFullyOpaque(): void {
  const opacity = 1;
  sprite.Color = Color(1, 1, 1, opacity, 0, 0, 0);
}

export function setFullyTransparent(): void {
  const opacity = 0;
  sprite.Color = Color(1, 1, 1, opacity, 0, 0, 0);
}
