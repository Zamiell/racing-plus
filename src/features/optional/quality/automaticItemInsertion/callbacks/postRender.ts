import {
  getScreenBottomLeftPos,
  getScreenBottomRightPos,
  isBethany,
  isJacobOrEsau,
} from "isaacscript-common";
import g from "../../../../../globals";
import { config } from "../../../../../modConfigMenu";
import v from "../v";

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

export function automaticItemInsertionPostRender(): void {
  if (!config.automaticItemInsertion) {
    return;
  }

  const hud = g.g.GetHUD();
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
  if (v.run.delta.coins !== null && v.run.delta.coinsFrame !== null) {
    const text = getDeltaText(v.run.delta.coins);
    const fade = getFade(v.run.delta.coinsFrame);
    if (fade <= 0) {
      v.run.delta.coins = null;
      v.run.delta.coinsFrame = null;
      return;
    }

    const player = Isaac.GetPlayer();
    const isJacobAndEsau = isJacobOrEsau(player);
    const hasDeepPockets = player.HasCollectible(
      CollectibleType.COLLECTIBLE_DEEP_POCKETS,
    );
    const x = hasDeepPockets ? UI_X + COINS_X_OFFSET : UI_X;
    // Note that Bethany's coins are in the same place as the other characters, so there is no need to
    // account for her offset in this function
    const y = isJacobAndEsau ? COINS_Y + JACOB_ESAU_Y_OFFSET : COINS_Y;

    const color = getTextColor(fade);
    g.fonts.pf.DrawString(text, x, y, color, 0, true);
  }
}

function drawKeysDelta() {
  if (v.run.delta.keys !== null && v.run.delta.keysFrame !== null) {
    const text = getDeltaText(v.run.delta.keys);
    const fade = getFade(v.run.delta.keysFrame);
    if (fade <= 0) {
      v.run.delta.keys = null;
      v.run.delta.keysFrame = null;
      return;
    }

    const player = Isaac.GetPlayer();
    let y = KEYS_Y;
    if (isJacobOrEsau(player)) {
      y += JACOB_ESAU_Y_OFFSET;
    } else if (isBethany(player)) {
      y += BETHANY_Y_KEY_OFFSET;
    }

    const color = getTextColor(fade);
    g.fonts.pf.DrawString(text, UI_X, y, color, 0, true);
  }
}

function drawBombsDelta() {
  if (v.run.delta.bombs !== null && v.run.delta.bombsFrame !== null) {
    const text = getDeltaText(v.run.delta.bombs);
    const fade = getFade(v.run.delta.bombsFrame);
    if (fade <= 0) {
      v.run.delta.bombs = null;
      v.run.delta.bombsFrame = null;
      return;
    }

    const player = Isaac.GetPlayer();
    let y = BOMBS_Y;
    if (isJacobOrEsau(player)) {
      y += JACOB_ESAU_Y_OFFSET;
    } else if (isBethany(player)) {
      y += BETHANY_Y_BOMB_OFFSET;
    }

    const color = getTextColor(fade);
    g.fonts.pf.DrawString(text, UI_X, y, color, 0, true);
  }
}

function drawBloodOrSoulChargeDelta() {
  if (
    v.run.delta.bloodOrSoulCharge !== null &&
    v.run.delta.bloodOrSoulChargeFrame !== null
  ) {
    const text = getDeltaText(v.run.delta.bloodOrSoulCharge);
    const fade = getFade(v.run.delta.bloodOrSoulChargeFrame);
    if (fade <= 0) {
      v.run.delta.bloodOrSoulCharge = null;
      v.run.delta.bloodOrSoulChargeFrame = null;
      return;
    }

    const color = getTextColor(fade);
    g.fonts.pf.DrawString(text, UI_X, BLOOD_SOUL_CHARGE_Y, color, 0, true);
  }
}

function drawPocketItemsDelta() {
  if (v.run.delta.pocketItem !== null && v.run.delta.pocketItemFrame !== null) {
    const string = v.run.delta.pocketItem.toString();
    const text = `+${string}`;

    // Don't show pocket items delta on J&E since their HUD is different
    const player = Isaac.GetPlayer();
    if (isJacobOrEsau(player)) {
      return;
    }

    const fade = getFade(v.run.delta.pocketItemFrame);
    if (fade <= 0) {
      v.run.delta.pocketItem = null;
      v.run.delta.pocketItemFrame = null;
      return;
    }

    const color = getTextColor(fade);
    const bottomRightPos = getScreenBottomRightPos();
    const x = bottomRightPos.X - BOTTOM_CORNER_OFFSET;
    const y = bottomRightPos.Y - BOTTOM_CORNER_OFFSET;
    g.fonts.pf.DrawString(text, x, y, color, 0, true);
  }
}

function drawTrinketsDelta() {
  if (v.run.delta.trinket !== null && v.run.delta.trinketFrame !== null) {
    const string = v.run.delta.trinket.toString();
    const text = `+${string}`;

    const fade = getFade(v.run.delta.trinketFrame);
    if (fade <= 0) {
      v.run.delta.trinket = null;
      v.run.delta.trinketFrame = null;
      return;
    }

    const color = getTextColor(fade);
    const bottomLeftPos = getScreenBottomLeftPos();
    const x = bottomLeftPos.X + BOTTOM_CORNER_OFFSET;
    const y = bottomLeftPos.Y - BOTTOM_CORNER_OFFSET;
    g.fonts.pf.DrawString(text, x, y, color, 0, true);
  }
}

function getFade(frame: int) {
  const gameFrameCount = g.g.GetFrameCount();
  const elapsedFrames = gameFrameCount - frame;

  if (elapsedFrames <= FRAMES_BEFORE_FADE) {
    return 1;
  }

  const fadeFrames = elapsedFrames - FRAMES_BEFORE_FADE;
  return 1 - 0.02 * fadeFrames;
}

function getTextColor(fade: float) {
  return KColor(0, 0.75, 0, fade);
}

function getDeltaText(delta: int) {
  const deltaString = delta.toString();
  const paddedDeltaString = deltaString.padStart(2, "0");
  return `+${paddedDeltaString}`;
}
