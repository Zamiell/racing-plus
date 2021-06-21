// This is the sprite for "1st", "2nd", etc. on the left side of the screen

import g from "../../globals";
import { initSprite } from "../../misc";
import { inRaceRoom } from "./raceRoom";

const GFX_PATH = "gfx/race/place-left";
const MAX_PLACE = 16; // There are only small sprites created for places up to 16

let sprite: Sprite | null = null;

export function postRender(): void {
  drawSprite();
}

function drawSprite() {
  // In the pre-race room, we have full graphics for "ready" and "not ready",
  // so the indicator on the left side of the screen is not necessary
  if (inRaceRoom()) {
    return;
  }

  if (sprite !== null) {
    const position = getPosition();
    sprite.RenderLayer(0, position);
  }
}

function getPosition() {
  const challenge = Isaac.GetChallenge();

  // Place it next to the "R+" icon
  let x = 24;

  // If playing on hard mode, the hard mode icon will interfere,
  // so it needs to be moved to the right
  if (g.g.Difficulty !== Difficulty.DIFFICULTY_NORMAL) {
    x += 10;
  }

  // If playing on a challenge, the challenge icon will interfere, so it needs to be moved to the right
  if (challenge !== 0) {
    x = 67;
  }

  return Vector(x, 79);
}

export function postNewLevel(): void {
  const stage = g.l.GetStage();

  if (g.race.status === "in progress" && stage === 2) {
    placeMidChanged();
  }
}

export function postGameStarted(): void {
  statusOrMyStatusChanged();
}

export function statusOrMyStatusChanged(): void {
  if (g.race.status === "open") {
    sprite = initSprite(`${GFX_PATH}/pre-${g.race.myStatus}.anm2`);
  } else if (g.race.status === "starting") {
    sprite = null;
  }
}

export function placeChanged(): void {
  // Update the place graphic with our final race place
  if (g.race.place > MAX_PLACE) {
    sprite = null;
  } else {
    sprite = initSprite(`${GFX_PATH}/${g.race.place}.anm2`);
  }
}

export function placeMidChanged(): void {
  if (g.race.status !== "in progress") {
    return;
  }

  // Update the place graphic with our mid-race place
  if (g.race.placeMid > MAX_PLACE) {
    sprite = null;
  } else {
    sprite = initSprite(`${GFX_PATH}/${g.race.placeMid}.anm2`);
  }
}

export function resetSprite(): void {
  sprite = null;
}
