import {
  ButtonAction,
  CollectibleType,
  PillColor,
  PillEffect,
  PocketItemSlot,
} from "isaac-typescript-definitions";
import {
  anyPlayerHasCollectible,
  fonts,
  game,
  getFalsePHDPillEffect,
  getNormalPillColorFromHorse,
  getNormalPillColors,
  getPHDPillEffect,
  getPillEffectName,
  isActionPressedOnAnyInput,
  KColorDefault,
  log,
  NUM_PILLS_IN_POOL,
  saveDataManager,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../enums/ChallengeCustom";
import { config } from "../../../modConfigMenu";
import { initSprite } from "../../../sprite";
import { PillDescription } from "../../../types/PillDescription";

const FALSE_PHD_PILL_CONVERSIONS_RACING_PLUS: ReadonlyMap<
  PillEffect,
  PillEffect
> = new Map([
  // In vanilla, this converts to ???, but in Racing+ we manually convert it to I'm Excited!!!
  [PillEffect.TELEPILLS, PillEffect.IM_EXCITED], // 19

  // In vanilla, this converts to Amnesia, but in Racing+ we manually convert it to Retro Vision.
  [PillEffect.I_CAN_SEE_FOREVER, PillEffect.RETRO_VISION], // 23

  // In vanilla, this converts to Amnesia, but in Racing+ we manually convert it to Horf!
  [PillEffect.LEMON_PARTY, PillEffect.HORF], // 26
]);

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
  saveDataManager("showPills", v, featureEnabled);

  for (const pillColor of getNormalPillColors()) {
    const sprite = initSprite(
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
  const challenge = Isaac.GetChallenge();
  if (challenge === ChallengeCustom.SEASON_3) {
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

function drawTextAndSprite() {
  const font = fonts.droid;

  const x = 80;
  let baseY = 97;
  for (let i = 9; i <= 12; i++) {
    // Avoid overflow on the bottom if we identify a lot of pills.
    if (v.run.pillsIdentified.length >= i) {
      baseY -= 20;
    }
  }

  const pillsIdentifiedText = `Pills identified: ${v.run.pillsIdentified.length} / ${NUM_PILLS_IN_POOL}`;
  font.DrawString(pillsIdentifiedText, x - 10, baseY - 9 + 20, KColorDefault);

  baseY += 20;
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
    sprite.RenderLayer(0, position);

    // Show the pill effect as text.
    let pillEffectName = getPillEffectName(pillEntry.effect);
    if (pillEffectName === "Feels like I'm walking on sunshine!") {
      pillEffectName = "Walking on sunshine!";
    }
    font.DrawString(pillEffectName, x + 15, y - 9, KColorDefault);
  });
}

// ModCallback.POST_USE_PILL (10)
export function usePill(player: EntityPlayer, pillEffect: PillEffect): void {
  checkNewPill(player, pillEffect);
}

function checkNewPill(player: EntityPlayer, pillEffect: PillEffect) {
  // This callback fires before the pill is consumed, so we can still get the color of the pill.
  const pillColor = player.GetPill(PocketItemSlot.SLOT_1);

  // A mod may have manually used a pill with a null color.
  if (pillColor === PillColor.NULL) {
    return;
  }

  // Don't bother recording information about gold pills.
  if (pillColor === PillColor.GOLD) {
    return;
  }

  // Account for Horse Pills (i.e. giant pills).
  const normalPillColor = getNormalPillColorFromHorse(pillColor);

  // See if we have already used this particular pill color on this run.
  for (const pill of v.run.pillsIdentified) {
    if (pill.color === normalPillColor) {
      return;
    }
  }

  newPill(normalPillColor, pillEffect);
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
