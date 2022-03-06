// In the "hudpickups.png" file, we blank out the "No Achievements" icon
// For every run, we draw a "R+" icon on top of where the "No Achievements" icon would normally be

import {
  getHUDOffsetVector,
  isBethany,
  isJacobOrEsau,
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

const SPRITE_POSITION = Vector(4, 72); // On top of where the "No Achievements" icon would be

const sprite = initSprite("gfx/ui/racing_plus/racing_plus.anm2");

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  const hud = g.g.GetHUD();

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

  // On vanilla, being in a challenge shifts the "No Achievements" icon to the left
  if (challenge !== Challenge.CHALLENGE_NULL) {
    position = position.add(SPRITE_CHALLENGE_OFFSET);
  }

  // On vanilla, being in Hard Mode shifts the "No Achievements" icon to the right
  // Being in greed mode shifts the "No Achievements" icon to the left
  if (g.g.Difficulty === Difficulty.DIFFICULTY_HARD) {
    position = position.add(SPRITE_DIFFICULTY_OFFSET);
  } else if (g.g.IsGreedMode()) {
    position = position.add(SPRITE_CHALLENGE_OFFSET);
  }

  // Certain characters have extra HUD elements, shifting the "No Achievements" icon down
  if (isBethany(player)) {
    position = position.add(SPRITE_BETHANY_OFFSET);
  } else if (isJacobOrEsau(player)) {
    position = position.add(SPRITE_JACOB_ESAU_OFFSET);
  }

  return position;
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  // We want this sprite to appear on all runs, so we need to disable achievements on all runs
  // The easiest way to do this without affecting gameplay is to enable an easter egg that prevents
  // a curse from appearing
  // (this will have no effect since all curses are removed in the "PostCurseEval" callback anyway)
  // Note that not all easter eggs prevent achievements, but this one does
  g.seeds.AddSeedEffect(SeedEffect.SEED_PREVENT_CURSE_DARKNESS);
}
