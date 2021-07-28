// We draw a black sprite on top of the screen in order to fade everything to black

import g from "../../../../globals";
import { initSprite } from "../../../../util";
import { FADE_TO_BLACK_FRAMES } from "./constants";
import { FastTravelState } from "./enums";

const sprite = initSprite("gfx/black.anm2");

export function draw(): void {
  if (g.run.fastTravel.state === FastTravelState.Disabled) {
    return;
  }

  // Conditionally adjust the opacity
  if (g.run.fastTravel.state === FastTravelState.FadingToBlack) {
    const opacity = g.run.fastTravel.framesPassed / FADE_TO_BLACK_FRAMES;
    sprite.Color = Color(1, 1, 1, opacity, 0, 0, 0);
  } else if (g.run.fastTravel.state === FastTravelState.FadingIn) {
    const opacity = 1 - g.run.fastTravel.framesPassed / FADE_TO_BLACK_FRAMES;
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
