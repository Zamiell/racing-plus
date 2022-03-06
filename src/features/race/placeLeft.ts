// This is the sprite for "1st", "2nd", etc. on the left side of the screen

import g from "../../globals";
import { initSprite } from "../../sprite";
import * as racingPlusSprite from "../mandatory/racingPlusSprite";
import { inRaceRoom } from "./raceRoom";
import { RacerStatus } from "./types/RacerStatus";
import { RaceStatus } from "./types/RaceStatus";

const GFX_PATH = "gfx/race/place-left";
const MAX_PLACE = 16; // There are only small sprites created for places up to 16
const SPRITE_OFFSET = Vector(20, 7);

let sprite: Sprite | null = null;

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  drawSprite();
}

function drawSprite() {
  if (shouldDrawPlaceLeftSprite() && sprite !== null) {
    const position = getPosition();
    sprite.RenderLayer(0, position);
  }
}

export function shouldDrawPlaceLeftSprite(): boolean {
  if (sprite === null) {
    return false;
  }

  const hud = g.g.GetHUD();
  if (!hud.IsVisible()) {
    return false;
  }

  // In the pre-race room, we have full graphics for "ready" and "not ready",
  // so the indicator on the left side of the screen is not necessary
  if (inRaceRoom()) {
    return false;
  }

  // We don't want place graphics to show in solo races
  if (g.race.solo) {
    return false;
  }

  return true;
}

function getPosition() {
  return racingPlusSprite.getPosition().add(SPRITE_OFFSET);
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  resetSprite();
  statusOrMyStatusChanged();
  placeMidChanged();
}

export function statusOrMyStatusChanged(): void {
  if (g.race.status === RaceStatus.OPEN) {
    sprite = initSprite(`${GFX_PATH}/pre-${g.race.myStatus}.anm2`);
  }
}

export function placeChanged(): void {
  // Update the place graphic with our final race place
  if (g.race.place === -1 || g.race.place > MAX_PLACE) {
    sprite = null;
  } else {
    sprite = initSprite(`${GFX_PATH}/${g.race.place}.anm2`);
  }
}

export function placeMidChanged(): void {
  if (
    g.race.status !== RaceStatus.IN_PROGRESS ||
    g.race.myStatus !== RacerStatus.RACING
  ) {
    return;
  }

  // Update the place graphic with our mid-race place
  // A place of -1 represents that we have just started the race or just reset
  if (g.race.placeMid === -1 || g.race.placeMid > MAX_PLACE) {
    sprite = null;
  } else {
    sprite = initSprite(`${GFX_PATH}/${g.race.placeMid}.anm2`);
  }
}

export function resetSprite(): void {
  sprite = null;
}
