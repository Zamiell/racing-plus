import g from "../../globals";

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  checkSlideAnimationFinished();
}

function checkSlideAnimationFinished() {
  const isPaused = g.g.IsPaused();
  if (!isPaused) {
    // The game is paused when the slide animation is happening
    g.run.slideAnimationHappening = false;
  }
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  recordSlideAnimationStarted();
}

function recordSlideAnimationStarted() {
  g.run.slideAnimationHappening = true;
}
