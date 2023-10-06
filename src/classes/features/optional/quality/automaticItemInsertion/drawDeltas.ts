import { CollectibleType } from "isaac-typescript-definitions";
import {
  fonts,
  game,
  getElapsedGameFramesSince,
  getHUDOffsetVector,
  getScreenBottomLeftPos,
  getScreenBottomRightPos,
  isBethany,
  isJacobOrEsau,
} from "isaacscript-common";
import { v } from "./v";

const UI_X = 35;
const COINS_X_OFFSET = 10; // For Deep Pockets
const COINS_Y = 33;
const Y_OFFSET = 12;
const BOMBS_Y = COINS_Y + Y_OFFSET;
const KEYS_Y = BOMBS_Y + Y_OFFSET;
const BLOOD_SOUL_CHARGE_Y = KEYS_Y + Y_OFFSET - 3;
const FRAMES_BEFORE_FADE = 100;
const BOTTOM_CORNER_OFFSET = 40;
const BETHANY_Y_BOMB_OFFSET = -1;
const BETHANY_Y_KEY_OFFSET = -2;
const JACOB_ESAU_Y_OFFSET = 14;

export function drawDeltas(): void {
  const hud = game.GetHUD();
  if (!hud.IsVisible()) {
    return;
  }

  drawCoinsDelta();
  drawBombsDelta();
  drawKeysDelta();
  drawBloodOrSoulChargeDelta();
  drawPocketItemsDelta();
  drawTrinketsDelta();
}

function drawCoinsDelta() {
  if (v.run.delta.coins === null || v.run.delta.coinsGameFrame === null) {
    return;
  }

  const fade = getFade(v.run.delta.coinsGameFrame);
  if (fade <= 0) {
    v.run.delta.coins = null;
    v.run.delta.coinsGameFrame = null;
    return;
  }

  const player = Isaac.GetPlayer();
  const isJacobAndEsau = isJacobOrEsau(player);
  const hasDeepPockets = player.HasCollectible(CollectibleType.DEEP_POCKETS);

  const x = hasDeepPockets ? UI_X + COINS_X_OFFSET : UI_X;
  // Note that Bethany's coins are in the same place as the other characters, so there is no need to
  // account for her offset in this function.
  const y = isJacobAndEsau ? COINS_Y + JACOB_ESAU_Y_OFFSET : COINS_Y;

  const text = getDeltaText(v.run.delta.coins);

  drawFont(x, y, fade, text);
}

function drawKeysDelta() {
  if (v.run.delta.keys === null || v.run.delta.keysGameFrame === null) {
    return;
  }

  const fade = getFade(v.run.delta.keysGameFrame);
  if (fade <= 0) {
    v.run.delta.keys = null;
    v.run.delta.keysGameFrame = null;
    return;
  }

  const player = Isaac.GetPlayer();

  const x = UI_X;
  let y = KEYS_Y;
  if (isJacobOrEsau(player)) {
    y += JACOB_ESAU_Y_OFFSET;
  } else if (isBethany(player)) {
    y += BETHANY_Y_KEY_OFFSET;
  }

  const text = getDeltaText(v.run.delta.keys);

  drawFont(x, y, fade, text);
}

function drawBombsDelta() {
  if (v.run.delta.bombs === null || v.run.delta.bombsGameFrame === null) {
    return;
  }

  const fade = getFade(v.run.delta.bombsGameFrame);
  if (fade <= 0) {
    v.run.delta.bombs = null;
    v.run.delta.bombsGameFrame = null;
    return;
  }

  const player = Isaac.GetPlayer();

  const x = UI_X;
  let y = BOMBS_Y;
  if (isJacobOrEsau(player)) {
    y += JACOB_ESAU_Y_OFFSET;
  } else if (isBethany(player)) {
    y += BETHANY_Y_BOMB_OFFSET;
  }

  const text = getDeltaText(v.run.delta.bombs);

  drawFont(x, y, fade, text);
}

function drawBloodOrSoulChargeDelta() {
  if (
    v.run.delta.bloodOrSoulCharge === null ||
    v.run.delta.bloodOrSoulChargeGameFrame === null
  ) {
    return;
  }

  const fade = getFade(v.run.delta.bloodOrSoulChargeGameFrame);
  if (fade <= 0) {
    v.run.delta.bloodOrSoulCharge = null;
    v.run.delta.bloodOrSoulChargeGameFrame = null;
    return;
  }

  const x = UI_X;
  const y = BLOOD_SOUL_CHARGE_Y;

  const text = getDeltaText(v.run.delta.bloodOrSoulCharge);

  drawFont(x, y, fade, text);
}

function drawPocketItemsDelta() {
  if (
    v.run.delta.pocketItem === null ||
    v.run.delta.pocketItemGameFrame === null
  ) {
    return;
  }

  // Don't show pocket items delta on Jacob & Esau since their HUD is different.
  const player = Isaac.GetPlayer();
  if (isJacobOrEsau(player)) {
    return;
  }

  const fade = getFade(v.run.delta.pocketItemGameFrame);
  if (fade <= 0) {
    v.run.delta.pocketItem = null;
    v.run.delta.pocketItemGameFrame = null;
    return;
  }

  const bottomRightPos = getScreenBottomRightPos();
  const x = bottomRightPos.X - BOTTOM_CORNER_OFFSET;
  const y = bottomRightPos.Y - BOTTOM_CORNER_OFFSET;

  const string = v.run.delta.pocketItem.toString();
  const text = `+${string}`;

  drawFont(x, y, fade, text);
}

function drawTrinketsDelta() {
  if (v.run.delta.trinket === null || v.run.delta.trinketGameFrame === null) {
    return;
  }

  const fade = getFade(v.run.delta.trinketGameFrame);
  if (fade <= 0) {
    v.run.delta.trinket = null;
    v.run.delta.trinketGameFrame = null;
    return;
  }

  const bottomLeftPos = getScreenBottomLeftPos();
  const x = bottomLeftPos.X + BOTTOM_CORNER_OFFSET;
  const y = bottomLeftPos.Y - BOTTOM_CORNER_OFFSET;

  const string = v.run.delta.trinket.toString();
  const text = `+${string}`;

  drawFont(x, y, fade, text);
}

function getFade(gameFrame: int): float {
  const elapsedGameFrames = getElapsedGameFramesSince(gameFrame);

  if (elapsedGameFrames <= FRAMES_BEFORE_FADE) {
    return 1;
  }

  const fadeFrames = elapsedGameFrames - FRAMES_BEFORE_FADE;
  return 1 - 0.02 * fadeFrames;
}

function drawFont(x: float, y: float, fade: float, text: string) {
  const hudOffsetVector = getHUDOffsetVector();
  const position = Vector(x, y).add(hudOffsetVector);

  const color = getTextColor(fade);
  fonts.pfTempestaSevenCondensed.DrawString(
    text,
    position.X,
    position.Y,
    color,
    0,
    true,
  );
}

function getTextColor(fade: float): KColor {
  return KColor(0, 0.75, 0, fade);
}

function getDeltaText(delta: int): string {
  const deltaString = delta.toString();
  const paddedDeltaString = deltaString.padStart(2, "0");
  return `+${paddedDeltaString}`;
}
