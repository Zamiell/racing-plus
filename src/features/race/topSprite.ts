// We show several things at the top of the screen:
// 1) "Wait for the race to begin!" (only in the race room)
// 2) An error message if we are on the wrong difficulty
// 3) "Go!"
// 4) Once we have finished a race, the final place

import g from "../../globals";
import { getScreenCenterPosition, initSprite } from "../../misc";

const GFX_PATH = "gfx/race";
const GO_GFX_PATH = `${GFX_PATH}/countdown/go.anm2`;
const MAX_PLACE = 32; // There are only big sprites created for places up to 32

let sprite: null | Sprite = null;

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  if (g.race.myStatus === "quit" || g.race.myStatus === "disqualified") {
    return;
  }

  drawSprite();
  hideGoSprite();
}

function drawSprite() {
  if (sprite !== null) {
    const position = getPosition();
    sprite.RenderLayer(0, position);
  }
}

function getPosition() {
  const centerPos = getScreenCenterPosition();
  return Vector(centerPos.X, centerPos.Y - 80);
}

function hideGoSprite() {
  if (
    sprite !== null &&
    sprite.GetFilename() === GO_GFX_PATH &&
    shouldHideGoSprite()
  ) {
    sprite = null;
  }
}

function shouldHideGoSprite() {
  if (g.race.status !== "in progress" || g.race.myStatus !== "racing") {
    return true;
  }

  const elapsedMilliseconds = Isaac.GetTime() - g.raceVars.startedTime;
  const elapsedSeconds = elapsedMilliseconds / 1000;
  if (elapsedSeconds >= 3) {
    return true;
  }

  return false;
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  statusChanged();
}

export function statusChanged(): void {
  if (g.race.status === "starting") {
    countdownChanged();
  } else if (g.race.status === "in progress" && g.race.myStatus === "racing") {
    sprite = initSprite(GO_GFX_PATH);
  }
}

export function countdownChanged(): void {
  if (g.race.countdown === -1) {
    sprite = null;
  } else if (g.race.status === "starting") {
    sprite = initSprite(`${GFX_PATH}/countdown/${g.race.countdown}.anm2`);
  }
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  // Remove the "1st place!" graphic from the top if we have entered a new room
  if (g.race.status === "none" || g.raceVars.finished) {
    sprite = null;
  }
}

export function placeChanged(): void {
  if (!g.raceVars.finished || g.race.place === -1) {
    return;
  }

  // The client won't send a new place for solo races
  if (g.race.place > MAX_PLACE) {
    sprite = null;
  } else {
    sprite = initSprite(`${GFX_PATH}/place-top/${g.race.place}.anm2`);
  }
}

export function setErrorNormalMode(): void {
  sprite = initSprite(`${GFX_PATH}/error-not-hard-mode.anm2`); // Error: You are not on hard mode.
}

export function setErrorHardMode(): void {
  sprite = initSprite(`${GFX_PATH}/error-hard-mode.anm2`); // Error: You are on hard mode.
}

export function resetSprite(): void {
  sprite = null;
}
