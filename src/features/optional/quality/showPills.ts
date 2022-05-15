import {
  ButtonAction,
  CollectibleType,
  PillColor,
  PillEffect,
} from "isaac-typescript-definitions";
import {
  anyPlayerHasCollectible,
  erange,
  getDefaultKColor,
  getNormalPillColorFromHorse,
  getPillEffectName,
  isActionPressedOnAnyInput,
  log,
  MAX_NORMAL_PILL_COLOR,
  saveDataManager,
} from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import { initSprite } from "../../../sprite";
import { PillDescription } from "../../../types/PillDescription";

const NUM_PILLS_IN_POOL = 13;

const PHD_PILL_CONVERSIONS: ReadonlyMap<PillEffect, PillEffect> = new Map([
  [PillEffect.BAD_TRIP, PillEffect.BALLS_OF_STEEL], // 1
  [PillEffect.HEALTH_DOWN, PillEffect.HEALTH_UP], // 6
  [PillEffect.RANGE_DOWN, PillEffect.RANGE_UP], // 11
  [PillEffect.SPEED_DOWN, PillEffect.SPEED_UP], // 13
  [PillEffect.TEARS_DOWN, PillEffect.TEARS_UP], // 15
  [PillEffect.LUCK_DOWN, PillEffect.LUCK_UP], // 17
  [PillEffect.PARALYSIS, PillEffect.PHEROMONES], // 22
  [PillEffect.AMNESIA, PillEffect.I_CAN_SEE_FOREVER], // 25
  [PillEffect.R_U_A_WIZARD, PillEffect.POWER], // 27
  [PillEffect.ADDICTED, PillEffect.PERCS], // 29
  [PillEffect.QUESTION_MARKS, PillEffect.TELEPILLS], // 31
  [PillEffect.RETRO_VISION, PillEffect.I_CAN_SEE_FOREVER], // 37
  [PillEffect.X_LAX, PillEffect.SOMETHINGS_WRONG], // 39
  [PillEffect.IM_EXCITED, PillEffect.IM_DROWSY], // 42
  [PillEffect.HORF, PillEffect.GULP], // 44
  [PillEffect.SHOT_SPEED_DOWN, PillEffect.SHOT_SPEED_UP], // 47
]);

const FALSE_PHD_PILL_CONVERSIONS: ReadonlyMap<PillEffect, PillEffect> = new Map(
  [
    [PillEffect.BAD_GAS, PillEffect.HEALTH_DOWN], // 0
    [PillEffect.BALLS_OF_STEEL, PillEffect.BAD_TRIP], // 2
    [PillEffect.BOMBS_ARE_KEYS, PillEffect.TEARS_DOWN], // 3
    [PillEffect.EXPLOSIVE_DIARRHEA, PillEffect.RANGE_DOWN], // 4
    [PillEffect.FULL_HEALTH, PillEffect.BAD_TRIP], // 5
    [PillEffect.HEALTH_UP, PillEffect.HEALTH_DOWN], // 7
    [PillEffect.PRETTY_FLY, PillEffect.LUCK_DOWN], // 10
    [PillEffect.RANGE_UP, PillEffect.RANGE_DOWN], // 12
    [PillEffect.SPEED_UP, PillEffect.SPEED_DOWN], // 14
    [PillEffect.TEARS_UP, PillEffect.TEARS_DOWN], // 16
    [PillEffect.LUCK_UP, PillEffect.LUCK_DOWN], // 18
    // In vanilla, this converts to ???, but in Racing+ we manually convert it to I'm Excited!!!
    [PillEffect.TELEPILLS, PillEffect.IM_EXCITED], // 19
    [PillEffect.FORTY_EIGHT_HOUR_ENERGY, PillEffect.SPEED_DOWN], // 20
    [PillEffect.HEMATEMESIS, PillEffect.BAD_TRIP], // 21
    // In vanilla, this converts to Amnesia, but in Racing+ we manually convert it to Retro Vision.
    [PillEffect.I_CAN_SEE_FOREVER, PillEffect.RETRO_VISION], // 23
    [PillEffect.PHEROMONES, PillEffect.PARALYSIS], // 24
    // In vanilla, this converts to Amnesia, but in Racing+ we manually convert it to Horf!
    [PillEffect.LEMON_PARTY, PillEffect.HORF], // 26
    [PillEffect.PERCS, PillEffect.ADDICTED], // 28
    [PillEffect.ONE_MAKES_YOU_LARGER, PillEffect.RANGE_DOWN], // 32
    [PillEffect.ONE_MAKES_YOU_SMALL, PillEffect.SPEED_DOWN], // 33
    [PillEffect.INFESTED_EXCLAMATION, PillEffect.TEARS_DOWN], // 34
    [PillEffect.INFESTED_QUESTION, PillEffect.LUCK_DOWN], // 35
    [PillEffect.POWER, PillEffect.R_U_A_WIZARD], // 36
    [PillEffect.FRIENDS_TILL_THE_END, PillEffect.HEALTH_DOWN], // 38
    [PillEffect.SOMETHINGS_WRONG, PillEffect.X_LAX], // 40
    [PillEffect.IM_DROWSY, PillEffect.IM_EXCITED], // 41
    [PillEffect.GULP, PillEffect.HORF], // 43
    [PillEffect.FEELS_LIKE_IM_WALKING_ON_SUNSHINE, PillEffect.RETRO_VISION], // 45
    [PillEffect.VURP, PillEffect.HORF], // 46
    [PillEffect.SHOT_SPEED_UP, PillEffect.SHOT_SPEED_DOWN], // 48
  ],
);

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

  for (const pillColor of erange(1, MAX_NORMAL_PILL_COLOR)) {
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
  log("Converting bad pill effects.");

  // Change the text for any identified pills.
  for (const pillEntry of v.run.pillsIdentified) {
    const newEffect = PHD_PILL_CONVERSIONS.get(pillEntry.effect);
    if (newEffect !== undefined) {
      pillEntry.effect = newEffect;
    }
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
    const newEffect = FALSE_PHD_PILL_CONVERSIONS.get(pillEntry.effect);
    if (newEffect !== undefined) {
      pillEntry.effect = newEffect;
    }
  }
}

// ModCallback.POST_RENDER (2)
export function postRender(): void {
  if (!config.showPills) {
    return;
  }

  // This feature is disabled if the Babies Mod mod is enabled.
  // (The pills text will overlap with the baby descriptions.)
  if (BabiesModGlobals !== undefined) {
    return;
  }

  const hud = g.g.GetHUD();
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
  const x = 80;
  let baseY = 97;
  for (let i = 9; i <= 12; i++) {
    // Avoid overflow on the bottom if we identify a lot of pills.
    if (v.run.pillsIdentified.length >= i) {
      baseY -= 20;
    }
  }

  const pillsIdentifiedText = `Pills identified: ${v.run.pillsIdentified.length} / ${NUM_PILLS_IN_POOL}`;
  g.fonts.droid.DrawString(
    pillsIdentifiedText,
    x - 10,
    baseY - 9 + 20,
    getDefaultKColor(),
  );

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
    g.fonts.droid.DrawString(pillEffectName, x + 15, y - 9, getDefaultKColor());
  });
}

// ModCallback.POST_USE_PILL (10)
export function usePill(player: EntityPlayer, pillEffect: PillEffect): void {
  checkNewPill(player, pillEffect);
}

function checkNewPill(player: EntityPlayer, pillEffect: PillEffect) {
  // This callback fires before the pill is consumed, so we can still get the color of the pill.
  const pillColor = player.GetPill(0);

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
