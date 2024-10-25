import {
  CallbackPriority,
  Difficulty,
  ModCallback,
  SeedEffect,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  PriorityCallback,
  game,
  getHUDOffsetVector,
  isBethany,
  isJacobOrEsau,
  newSprite,
  onAnyChallenge,
  setUnseeded,
} from "isaacscript-common";
import {
  SPRITE_BETHANY_OFFSET,
  SPRITE_CHALLENGE_OFFSET,
  SPRITE_DIFFICULTY_OFFSET,
  SPRITE_JACOB_ESAU_OFFSET,
} from "../../../../constants";
import { socketClientIsActive } from "../../../../features/race/socketClient";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

enum IconSpriteLayer {
  BLUE = 0,
  GREEN = 1,
}

/** This is on top of where the "No Achievements" icon would be. */
const SPRITE_POSITION = Vector(4, 72);

const ICON_SPRITE = newSprite("gfx/ui/racing_plus/racing_plus.anm2");

/**
 * In the "gfx/ui/hudpickups.png" file, we blank out the "No Achievements" icon. For every run, we
 * draw a "R+" icon on top of where the "No Achievements" icon would normally be.
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

    // The `HUD.IsVisible` method does not take into account `SeedEffect.NO_HUD`.
    const seeds = game.GetSeeds();
    if (seeds.HasSeedEffect(SeedEffect.NO_HUD)) {
      return;
    }

    const spriteLayer = socketClientIsActive()
      ? IconSpriteLayer.GREEN
      : IconSpriteLayer.BLUE;
    const position = getRacingPlusIconPosition();
    ICON_SPRITE.RenderLayer(spriteLayer, position);
  }

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReorderedFalse(): void {
    disableAchievements();
  }
}

export function getRacingPlusIconPosition(): Readonly<Vector> {
  const HUDOffsetVector = getHUDOffsetVector();
  const player = Isaac.GetPlayer();

  let position = SPRITE_POSITION.add(HUDOffsetVector);

  // On vanilla, being in a challenge shifts the "No Achievements" icon to the left.
  if (onAnyChallenge()) {
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
 *
 * We also want to disable achievements so that Eden's Blessing does not grant an extra item. (For
 * example, someone could give themselves 100 Eden's Blessings in the pre-race room and it would be
 * cumbersome to check for and remove additional items at the beginning of a race. Furthermore,
 * Eden's Blessing would increase the variance in a multi-character speedrun because you could get a
 * Mom's Knife and completely skip the resetting phase.)
 */
function disableAchievements() {
  const seeds = game.GetSeeds();
  seeds.AddSeedEffect(SeedEffect.PREVENT_CURSE_DARKNESS);
}
