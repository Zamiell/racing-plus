import {
  ButtonAction,
  CollectibleType,
  PillColor,
  PillEffect,
} from "isaac-typescript-definitions";
import {
  anyPlayerHasCollectible,
  fonts,
  game,
  getFalsePHDPillEffect,
  getNormalPillColors,
  getPHDPillEffect,
  getPillEffectName,
  getScreenBottomY,
  isActionPressedOnAnyInput,
  KColorDefault,
  log,
  NUM_PILLS_IN_POOL,
  ReadonlyMap,
} from "isaacscript-common";
import { mod } from "../../../mod";
import { config } from "../../../modConfigMenu";
import { newSprite } from "../../../sprite";
import { PillDescription } from "../../../types/PillDescription";
import { onSeason } from "../../speedrun/speedrun";

const FALSE_PHD_PILL_CONVERSIONS_RACING_PLUS = new ReadonlyMap<
  PillEffect,
  PillEffect
>([
  // In vanilla, this converts to ???, but in Racing+ we manually convert it to I'm Excited!!!
  [PillEffect.TELEPILLS, PillEffect.IM_EXCITED], // 19

  // In vanilla, this converts to Amnesia, but in Racing+ we manually convert it to Retro Vision.
  [PillEffect.I_CAN_SEE_FOREVER, PillEffect.RETRO_VISION], // 23

  // In vanilla, this converts to Amnesia, but in Racing+ we manually convert it to Horf!
  [PillEffect.LEMON_PARTY, PillEffect.HORF], // 26
]);

const LINE_HEIGHT = 20;

/** These are not meant to ever be reset. */
const pillSprites = new Map<PillColor, Sprite>();

const v = {
  run: {
    pillsIdentified: [] as PillDescription[],

    PHD: false,
    falsePHD: false,
  },
};

export function init(): void {
  mod.saveDataManager("showPills", v, featureEnabled);

  for (const pillColor of getNormalPillColors()) {
    const sprite = newSprite(
      "gfx/pills/pill.anm2",
      `gfx/pills/${pillColor}.png`,
    );
    pillSprites.set(pillColor, sprite);
  }
}

function featureEnabled() {
  return config.showPills;
}

// ModCallback.POST_UPDATE (1)
export function postUpdate(): void {
  if (!config.showPills) {
    return;
  }

  checkPHD();
  checkFalsePHD();
}

function checkPHD() {
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
  for (const pillEntry of v.run.pillsIdentified) {
    pillEntry.effect = getPHDPillEffect(pillEntry.effect);
  }
}

function checkFalsePHD() {
  if (v.run.falsePHD) {
    // We have already converted good pill effects this run.
    return;
  }

  if (!anyPlayerHasCollectible(CollectibleType.FALSE_PHD)) {
    return;
  }

  v.run.falsePHD = true;
  log("Converting good pill effects.");

  // Change the text for any identified pills.
  for (const pillEntry of v.run.pillsIdentified) {
    pillEntry.effect = getFalsePHDPillEffectRacingPlus(pillEntry.effect);
  }
}

/** Racing+ makes some modifications to the pill effects (since all curses are removed). */
function getFalsePHDPillEffectRacingPlus(pillEffect: PillEffect): PillEffect {
  const newPillEffect = getFalsePHDPillEffect(pillEffect);
  const racingPlusEffect =
    FALSE_PHD_PILL_CONVERSIONS_RACING_PLUS.get(newPillEffect);
  return racingPlusEffect === undefined ? newPillEffect : racingPlusEffect;
}

// ModCallback.POST_RENDER (2)
export function postRender(): void {
  if (!config.showPills) {
    return;
  }

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
  if (v.run.pillsIdentified.length === 0) {
    return;
  }

  // Only show pill identification if someone is pressing the map button.
  if (!isActionPressedOnAnyInput(ButtonAction.MAP)) {
    return;
  }

  drawTextAndSprite();
}

/**
 * We want to align the pill display with the bottom of the screen so that it displays properly on
 * different kinds of resolutions (and grows upward as the player identifies more pills). Thus, we
 * start by calculating the total height of the pill display.
 *
 * TODO
 */
function drawTextAndSprite() {
  const font = fonts.droid;

  // We add one because of the header.
  const totalHeight = LINE_HEIGHT * (1 + v.run.pillsIdentified.length);
  const bottomY = getScreenBottomY();

  const x = 80;
  const baseY = bottomY - totalHeight;

  const pillsIdentifiedText = `Pills identified: ${v.run.pillsIdentified.length} / ${NUM_PILLS_IN_POOL}`;
  font.DrawString(pillsIdentifiedText, x - 10, baseY - 9, KColorDefault);

  v.run.pillsIdentified.forEach((pillEntry, i) => {
    // Show the pill sprite.
    const y = baseY + 20 * (i + 1);
    const position = Vector(x, y);
    const sprite = pillSprites.get(pillEntry.color);
    if (sprite === undefined) {
      log(
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

// ModCallback.POST_USE_PILL (10)
export function usePill(_player: EntityPlayer, pillEffect: PillEffect): void {
  checkNewPillIdentified(pillEffect);
}

function checkNewPillIdentified(pillEffect: PillEffect) {
  const itemPool = game.GetItemPool();

  // This callback fires after the pill is consumed, so we must iterate through all of the pill
  // colors to see if any new ones are identified.
  for (const pillColor of getNormalPillColors()) {
    if (!itemPool.IsPillIdentified(pillColor)) {
      continue;
    }

    if (!isPillColorRecordedAlready(pillColor)) {
      newPill(pillColor, pillEffect);
    }
  }
}

function isPillColorRecordedAlready(pillColor: PillColor) {
  return v.run.pillsIdentified.some((pill) => pill.color === pillColor);
}

function newPill(pillColor: PillColor, pillEffect: PillEffect) {
  // This is the first time we have used this pill, so keep track of the pill color and effect.
  const pillDescription: PillDescription = {
    color: pillColor,
    effect: pillEffect,
  };
  v.run.pillsIdentified.push(pillDescription);
}

export function getNumIdentifiedPills(): int {
  return v.run.pillsIdentified.length;
}
