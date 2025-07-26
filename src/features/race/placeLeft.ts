// This is the sprite for "1st", "2nd", etc. on the left side of the screen.

import { game, newSprite } from "isaacscript-common";
import { getRacingPlusIconPosition } from "../../classes/features/mandatory/misc/RacingPlusIcon";
import { RaceStatus } from "../../enums/RaceStatus";
import { RacerStatus } from "../../enums/RacerStatus";
import { g } from "../../globals";
import { inRaceRoom } from "./raceRoom";

const GFX_PATH = "gfx/race/place-left";
const MAX_PLACE = 16; // There are only small sprites created for places up to 16.
const SPRITE_OFFSET = Vector(20, 7);

let sprite: Sprite | undefined;

// ModCallback.POST_RENDER (2)
export function postRender(): void {
  drawSprite();
}

function drawSprite() {
  if (shouldDrawPlaceLeftSprite() && sprite !== undefined) {
    const position = getPlaceSpritePosition();
    sprite.Render(position);
  }
}

export function shouldDrawPlaceLeftSprite(): boolean {
  if (sprite === undefined) {
    return false;
  }

  const hud = game.GetHUD();
  if (!hud.IsVisible()) {
    return false;
  }

  // In the pre-race room, we have full graphics for "ready" and "not ready", so the indicator on
  // the left side of the screen is not necessary.
  if (inRaceRoom()) {
    return false;
  }

  // We don't want place graphics to show in solo races.
  if (g.race.solo) {
    return false;
  }

  return true;
}

function getPlaceSpritePosition() {
  const position = getRacingPlusIconPosition();
  return position.add(SPRITE_OFFSET);
}

// ModCallback.POST_GAME_STARTED (15)
export function postGameStarted(): void {
  resetSprite();
  statusOrMyStatusChanged();
  placeMidChanged();
}

export function statusOrMyStatusChanged(): void {
  if (g.race.status === RaceStatus.OPEN) {
    sprite = newSprite(`${GFX_PATH}/pre-${g.race.myStatus}.anm2`);
  }
}

export function placeChanged(): void {
  // Update the place graphic with our final race place.
  sprite =
    g.race.place === -1 || g.race.place > MAX_PLACE
      ? undefined
      : newSprite(`${GFX_PATH}/${g.race.place}.anm2`);
}

export function placeMidChanged(): void {
  if (
    g.race.status !== RaceStatus.IN_PROGRESS
    || g.race.myStatus !== RacerStatus.RACING
  ) {
    return;
  }

  // Update the place graphic with our mid-race place. A place of -1 represents that we have just
  // started the race or just reset.
  sprite =
    g.race.placeMid === -1 || g.race.placeMid > MAX_PLACE
      ? undefined
      : newSprite(`${GFX_PATH}/${g.race.placeMid}.anm2`);
}

export function resetSprite(): void {
  sprite = undefined;
}
