import {
  ButtonAction,
  CollectibleType,
  ModCallback,
  PillColor,
  PillEffect,
} from "isaac-typescript-definitions";
import {
  anyPlayerHasCollectible,
  Callback,
  CallbackCustom,
  fonts,
  game,
  getFalsePHDPillEffect,
  getNormalPillColors,
  getPHDPillEffect,
  getPillEffectName,
  getScreenBottomY,
  isActionPressedOnAnyInput,
  KColorDefault,
  logError,
  ModCallbackCustom,
  NUM_PILLS_IN_POOL,
  ReadonlyMap,
} from "isaacscript-common";
import { onSeason } from "../../../../speedrun/utilsSpeedrun";
import { newSprite } from "../../../../sprite";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

interface PillDescription {
  color: PillColor;
  effect: PillEffect;
}

const FALSE_PHD_PILL_CONVERSIONS_RACING_PLUS = new ReadonlyMap<
  PillEffect,
  PillEffect
>([
  // In vanilla, this converts to "???", but in Racing+ we manually convert it to "I'm Excited!!!".
  [PillEffect.TELEPILLS, PillEffect.IM_EXCITED], // 19

  // In vanilla, this converts to "Amnesia", but in Racing+ we manually convert it to "Retro
  // Vision".
  [PillEffect.I_CAN_SEE_FOREVER, PillEffect.RETRO_VISION], // 23

  // In vanilla, this converts to "Amnesia", but in Racing+ we manually convert it to "Horf!".
  [PillEffect.LEMON_PARTY, PillEffect.HORF], // 26
]);

const LINE_HEIGHT = 20;

/** These are not meant to ever be reset. */
const pillSprites = new Map<PillColor, Sprite>();

const v = {
  run: {
    /**
     * This is not technically the same as the pills that are currently "identified" because using
     * PHD or False PHD will automatically identify every pill in the pool.
     */
    pillsUsed: [] as PillDescription[],

    PHD: false,
    falsePHD: false,
  },
};

export class ShowPills extends ConfigurableModFeature {
  configKey: keyof Config = "ShowPills";
  v = v;

  constructor() {
    super();

    for (const pillColor of getNormalPillColors()) {
      const sprite = newSprite(
        "gfx/pills/pill.anm2",
        `gfx/pills/${pillColor}.png`,
      );
      pillSprites.set(pillColor, sprite);
    }
  }

  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    this.checkPHD();
    this.checkFalsePHD();
  }

  checkPHD(): void {
    if (v.run.PHD) {
      // We have already converted bad pill effects this run.
      return;
    }

    if (
      !anyPlayerHasCollectible(CollectibleType.PHD) &&
      !anyPlayerHasCollectible(CollectibleType.VIRGO)
    ) {
      return;
    }

    v.run.PHD = true;

    // Change the text for any identified pills.
    for (const pillEntry of v.run.pillsUsed) {
      pillEntry.effect = getPHDPillEffect(pillEntry.effect);
    }
  }

  checkFalsePHD(): void {
    if (v.run.falsePHD) {
      // We have already converted good pill effects this run.
      return;
    }

    if (!anyPlayerHasCollectible(CollectibleType.FALSE_PHD)) {
      return;
    }

    v.run.falsePHD = true;

    // Change the text for any identified pills.
    for (const pillEntry of v.run.pillsUsed) {
      pillEntry.effect = this.getFalsePHDPillEffectRacingPlus(pillEntry.effect);
    }
  }

  /** Racing+ makes some modifications to the pill effects (since all curses are removed). */
  getFalsePHDPillEffectRacingPlus(pillEffect: PillEffect): PillEffect {
    const newPillEffect = getFalsePHDPillEffect(pillEffect);
    const racingPlusEffect =
      FALSE_PHD_PILL_CONVERSIONS_RACING_PLUS.get(newPillEffect);
    return racingPlusEffect === undefined ? newPillEffect : racingPlusEffect;
  }

  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    // This feature is disabled if the Babies Mod mod is enabled. (The pills text will overlap with
    // the baby descriptions.)
    if (BabiesModGlobals !== undefined) {
      return;
    }

    // This feature is disabled in season 3. (The pills text will overlap with the goals.)
    if (onSeason(3)) {
      return;
    }

    const hud = game.GetHUD();
    if (!hud.IsVisible()) {
      return;
    }

    // Don't do anything if we have not taken any pills yet.
    if (v.run.pillsUsed.length === 0) {
      return;
    }

    // Only show pill identification if someone is pressing the map button.
    if (!isActionPressedOnAnyInput(ButtonAction.MAP)) {
      return;
    }

    this.drawTextAndSprite();
  }

  /**
   * We want to align the pill display with the bottom of the screen so that it displays properly on
   * different kinds of resolutions (and grows upward as the player identifies more pills). Thus, we
   * start by calculating the total height of the pill display.
   */
  drawTextAndSprite(): void {
    const font = fonts.droid;

    // We add one because of the header.
    const totalHeight = LINE_HEIGHT * (1 + v.run.pillsUsed.length);
    const bottomY = getScreenBottomY();

    const x = 80;
    const baseY = bottomY - totalHeight;

    const pillsIdentifiedText = `Pills identified: ${v.run.pillsUsed.length} / ${NUM_PILLS_IN_POOL}`;
    font.DrawString(pillsIdentifiedText, x - 10, baseY - 9, KColorDefault);

    v.run.pillsUsed.forEach((pillEntry, i) => {
      // Show the pill sprite.
      const y = baseY + 20 * (i + 1);
      const position = Vector(x, y);
      const sprite = pillSprites.get(pillEntry.color);
      if (sprite === undefined) {
        logError(
          `Error: Failed to find the sprite for pill color: ${pillEntry.color}, effect: ${pillEntry.effect}, i: ${i}`,
        );
        return;
      }
      sprite.Render(position);

      // Show the pill effect as text.
      let pillEffectName = getPillEffectName(pillEntry.effect);
      if (pillEffectName === "Feels like I'm walking on sunshine!") {
        pillEffectName = "Walking on sunshine!";
      }
      font.DrawString(pillEffectName, x + 15, y - 9, KColorDefault);
    });
  }

  // 10
  @CallbackCustom(ModCallbackCustom.POST_USE_PILL_FILTER)
  postUsePillFilter(pillEffect: PillEffect, pillColor: PillColor): void {
    this.checkNewUsedPill(pillEffect, pillColor);
  }

  checkNewUsedPill(pillEffect: PillEffect, pillColor: PillColor): void {
    if (this.isPillColorRecordedAlready(pillColor)) {
      return;
    }

    // This is the first time we have used this pill, so keep track of the pill color and effect.
    const pillDescription: PillDescription = {
      color: pillColor,
      effect: pillEffect,
    };
    v.run.pillsUsed.push(pillDescription);
  }

  isPillColorRecordedAlready(pillColor: PillColor): boolean {
    return v.run.pillsUsed.some((pill) => pill.color === pillColor);
  }
}

export function getNumIdentifiedPills(): int {
  return v.run.pillsUsed.length;
}