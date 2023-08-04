// We show several things at the top of the screen:
// 1) "Wait for the race to begin" (only in the race room)
// 2) An error message if we are on the wrong difficulty.
// 3) "Go!"
// 4) Once we have finished a race, the final place.

import { game, getScreenCenterPos, newSprite } from "isaacscript-common";
import { RaceStatus } from "../../enums/RaceStatus";
import { RacerStatus } from "../../enums/RacerStatus";
import { g } from "../../globals";

const GFX_PATH = "gfx/race";
const GO_GFX_PATH = `${GFX_PATH}/countdown/go.anm2`;
const MAX_PLACE = 32; // There are only big sprites created for places up to 32

let sprite: Sprite | undefined;

// ModCallback.POST_RENDER (2)
export function postRender(): void {
  if (
    g.race.myStatus === RacerStatus.QUIT ||
    g.race.myStatus === RacerStatus.DISQUALIFIED
  ) {
    return;
  }

  drawSprite();
  hideGoSprite();
}

function drawSprite() {
  const hud = game.GetHUD();

  if (!hud.IsVisible()) {
    return;
  }

  if (sprite !== undefined) {
    const position = getPosition();
    sprite.Render(position);
  }
}

function getPosition() {
  const centerPos = getScreenCenterPos();
  return Vector(centerPos.X, centerPos.Y - 80);
}

function hideGoSprite() {
  if (
    sprite !== undefined &&
    sprite.GetFilename() === GO_GFX_PATH &&
    shouldHideGoSprite()
  ) {
    sprite = undefined;
  }
}

function shouldHideGoSprite() {
  if (
    g.race.status !== RaceStatus.IN_PROGRESS ||
    g.race.myStatus !== RacerStatus.RACING
  ) {
    return true;
  }

  const elapsedMilliseconds = Isaac.GetTime() - g.raceVars.startedTime;
  const elapsedSeconds = elapsedMilliseconds / 1000;
  if (elapsedSeconds >= 3) {
    return true;
  }

  return false;
}

// ModCallback.POST_GAME_STARTED (15)
export function postGameStarted(): void {
  statusChanged();
}

export function statusChanged(): void {
  if (g.race.status === RaceStatus.STARTING) {
    countdownChanged();
  } else if (
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING
  ) {
    sprite = newSprite(GO_GFX_PATH);
  }
}

export function countdownChanged(): void {
  if (g.race.countdown === -1) {
    sprite = undefined;
  } else if (g.race.status === RaceStatus.STARTING) {
    sprite = newSprite(`${GFX_PATH}/countdown/${g.race.countdown}.anm2`);
  }
}

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  // Remove the "1st place" graphic from the top if we have entered a new room.
  if (g.race.status === RaceStatus.NONE || g.raceVars.finished) {
    sprite = undefined;
  }
}

export function placeChanged(): void {
  if (!g.raceVars.finished || g.race.place === -1) {
    return;
  }

  // The client won't send a new place for solo races.
  sprite = g.race.place > MAX_PLACE ? undefined : newSprite(`${GFX_PATH}/place-top/${g.race.place}.anm2`);
}

export function setErrorNormalMode(): void {
  sprite = newSprite(`${GFX_PATH}/error-not-hard-mode.anm2`); // Error: You are not on hard mode.
}

export function setErrorHardMode(): void {
  sprite = newSprite(`${GFX_PATH}/error-hard-mode.anm2`); // Error: You are on hard mode.
}

export function resetSprite(): void {
  sprite = undefined;
}
