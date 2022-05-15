// Get rid of the slow fade-in at the beginning of a run.

import { saveDataManager } from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";

/** This is fine tuned from trial and error to be a good speed. */
const FADE_IN_SPEED = 0.15;

const v = {
  run: {
    spedUpFadeIn: false,
  },
};

export function init(): void {
  saveDataManager("speedUpFadeIn", v, featureEnabled);
}

function featureEnabled() {
  return config.speedUpFadeIn;
}

// ModCallback.POST_RENDER (2)
export function postRender(): void {
  if (!config.speedUpFadeIn) {
    return;
  }

  if (shouldSpeedUpFadeIn()) {
    speedUpFadeIn();
  }
}

function shouldSpeedUpFadeIn() {
  const gameFrameCount = g.g.GetFrameCount();
  return !v.run.spedUpFadeIn && gameFrameCount === 0;
}

function speedUpFadeIn() {
  v.run.spedUpFadeIn = true;
  g.g.Fadein(FADE_IN_SPEED);
}
