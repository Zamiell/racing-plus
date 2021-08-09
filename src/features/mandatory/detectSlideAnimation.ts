import { saveDataManager } from "isaacscript-common";
import g from "../../globals";

const v = {
  run: {
    slideAnimationHappening: false,
  },
};

export function init(): void {
  saveDataManager("detectSlideAnimation", v);
}

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  checkSlideAnimationFinished();
}

function checkSlideAnimationFinished() {
  const isPaused = g.g.IsPaused();
  if (!isPaused) {
    // The game is paused when the slide animation is happening
    v.run.slideAnimationHappening = false;
  }
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  recordSlideAnimationStarted();
}

function recordSlideAnimationStarted() {
  v.run.slideAnimationHappening = true;
}

export function isSlideAnimationActive(): boolean {
  return v.run.slideAnimationHappening;
}
