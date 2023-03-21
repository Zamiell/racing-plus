import {
  Challenge,
  Difficulty,
  ModCallback,
  SeedEffect,
} from "isaac-typescript-definitions";
import { CallbackPriority } from "isaac-typescript-definitions/dist/src/enums/CallbackPriority";
import {
  CallbackCustom,
  ModCallbackCustom,
  PriorityCallback,
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
} from "../../../../constants";
import * as socketClient from "../../../../features/race/socketClient";
import { newSprite } from "../../../../sprite";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

enum RacingPlusSpriteLayer {
  BLUE,
  GREEN,
}

/** This is on top of where the "No Achievements" icon would be. */
const SPRITE_POSITION = Vector(4, 72);

const racingPlusSprite = newSprite("gfx/ui/racing_plus/racing_plus.anm2");

/**
 * In the "hudpickups.png" file, we blank out the "No Achievements" icon. For every run, we draw a
 * "R+" icon on top of where the "No Achievements" icon would normally be.
 */
export class RacingPlusIcon extends MandatoryModFeature {
  /**
   * We specify a late callback priority since we want the icon to be drawn on top of everything
   * else.
   */
  // 2
  @PriorityCallback(ModCallback.POST_RENDER, CallbackPriority.LATE)
  postRenderLate(): void {
    const hud = game.GetHUD();
    if (!hud.IsVisible()) {
      return;
    }

    const spriteLayer = socketClient.isActive()
      ? RacingPlusSpriteLayer.GREEN
      : RacingPlusSpriteLayer.BLUE;
    const position = getRacingPlusIconPosition();
    racingPlusSprite.RenderLayer(spriteLayer, position);
  }

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReorderedFalse(): void {
    disableAchievements();
  }
}

export function getRacingPlusIconPosition(): Vector {
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

/** Similar to the `setUnseeded` function from "isaacscript-common". */
export function setUnseededWithRacingPlusLogic(): void {
  setUnseeded();

  // Using the `Seeds.Reset` method will also remove any Easter Eggs that have been enabled, so we
  // must manually reactivate them.
  disableAchievements();
}

/**
 * We want the vanilla "no achievements" icon to appear in order to create a gap for the Racing+
 * icon. Thus, we need to disable achievements on all runs. The easiest way to do this without
 * affecting gameplay is to enable an easter egg that prevents a curse from appearing. Doing this
 * will have no effect since all curses are removed in the `POST_CURSE_EVAL` callback anyway.
 *
 * Note that not all easter eggs prevent achievements, but this one does.
 */
function disableAchievements() {
  const seeds = game.GetSeeds();
  seeds.AddSeedEffect(SeedEffect.PREVENT_CURSE_DARKNESS);
}
