// In the "hudpickups.png" file, we blank out the "No Achievements" icon. For every run, we draw a
// "R+" icon on top of where the "No Achievements" icon would normally be.

import {
  Challenge,
  Difficulty,
  SeedEffect,
} from "isaac-typescript-definitions";
import {
  game,
  getHUDOffsetVector,
  isBethany,
  isJacobOrEsau,
  setUnseeded,
} from "isaacscript-common";
import {
  SPRITE_BETHANY_OFFSET,
  SPRITE_CHALLENGE_OFFSET,
  SPRITE_DIFFICULTY_OFFSET,
  SPRITE_JACOB_ESAU_OFFSET,
} from "../../constants";
import g from "../../globals";
import { initSprite } from "../../sprite";
import * as socketClient from "../race/socketClient";

enum SpriteLayer {
  BLUE,
  GREEN,
}

/** This is on top of where the "No Achievements" icon would be. */
const SPRITE_POSITION = Vector(4, 72);

const sprite = initSprite("gfx/ui/racing_plus/racing_plus.anm2");

// ModCallback.POST_RENDER (2)
export function postRender(): void {
  const hud = game.GetHUD();
  if (!hud.IsVisible()) {
    return;
  }

  const spriteLayer = socketClient.isActive()
    ? SpriteLayer.GREEN
    : SpriteLayer.BLUE;
  const position = getPosition();
  sprite.RenderLayer(spriteLayer, position);
}

export function getPosition(): Vector {
  const challenge = Isaac.GetChallenge();
  const HUDOffsetVector = getHUDOffsetVector();
  const player = Isaac.GetPlayer();

  let position = SPRITE_POSITION.add(HUDOffsetVector);

  // On vanilla, being in a challenge shifts the "No Achievements" icon to the left.
  if (challenge !== Challenge.NULL) {
    position = position.add(SPRITE_CHALLENGE_OFFSET);
  }

  // On vanilla, being in Hard Mode shifts the "No Achievements" icon to the right. Being in greed
  // mode shifts the "No Achievements" icon to the left.
  if (game.Difficulty === Difficulty.HARD) {
    position = position.add(SPRITE_DIFFICULTY_OFFSET);
  } else if (game.IsGreedMode()) {
    position = position.add(SPRITE_CHALLENGE_OFFSET);
  }

  // Certain characters have extra HUD elements, shifting the "No Achievements" icon down.
  if (isBethany(player)) {
    position = position.add(SPRITE_BETHANY_OFFSET);
  } else if (isJacobOrEsau(player)) {
    position = position.add(SPRITE_JACOB_ESAU_OFFSET);
  }

  return position;
}

// ModCallback.POST_GAME_STARTED (15)
export function postGameStarted(): void {
  disableAchievements();
}

/**
 * We want this sprite to appear on all runs, so we need to disable achievements on all runs. The
 * easiest way to do this without affecting gameplay is to enable an easter egg that prevents a
 * curse from appearing. (This will have no effect since all curses are removed in the
 * "PostCurseEval" callback anyway.)
 *
 * Note that not all easter eggs prevent achievements, but this one does.
 */
export function disableAchievements(): void {
  g.seeds.AddSeedEffect(SeedEffect.PREVENT_CURSE_DARKNESS);
}

export function setUnseededWithRacingPlusLogic(): void {
  setUnseeded();

  // Using the `Seeds.Reset` method will also remove any Easter Eggs that have been enabled, so we
  // must manually reactivate them.
  disableAchievements();
}
