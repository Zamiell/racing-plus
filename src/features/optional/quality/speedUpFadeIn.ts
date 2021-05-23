import g from "../../../globals";

// This is fine tuned from trial and error to be a good speed
const FADE_IN_SPEED = 0.15;

export function postRender(): void {
  if (!g.config.speedUpFadeIn) {
    return;
  }

  speedUpFadeIn();
}

// Get rid of the slow fade-in at the beginning of a run
function speedUpFadeIn() {
  if (!g.run.spedUpFadeIn) {
    g.run.spedUpFadeIn = true;
    g.g.Fadein(FADE_IN_SPEED);
  }
}
