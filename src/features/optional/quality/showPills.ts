import { KCOLOR_DEFAULT } from "../../../constants";
import g from "../../../globals";
import { initSprite, isActionPressedOnAnyInput, log } from "../../../misc";

const NUM_PILLS_IN_POOL = 13;

const PHD_PILL_CONVERSIONS = new Map([
  [PillEffect.PILLEFFECT_BAD_TRIP, PillEffect.PILLEFFECT_BALLS_OF_STEEL], // 1
  [PillEffect.PILLEFFECT_HEALTH_DOWN, PillEffect.PILLEFFECT_HEALTH_UP], // 6
  [PillEffect.PILLEFFECT_RANGE_DOWN, PillEffect.PILLEFFECT_RANGE_UP], // 11
  [PillEffect.PILLEFFECT_SPEED_DOWN, PillEffect.PILLEFFECT_SPEED_UP], // 13
  [PillEffect.PILLEFFECT_TEARS_DOWN, PillEffect.PILLEFFECT_TEARS_UP], // 15
  [PillEffect.PILLEFFECT_LUCK_DOWN, PillEffect.PILLEFFECT_LUCK_UP], // 17
  [PillEffect.PILLEFFECT_PARALYSIS, PillEffect.PILLEFFECT_PHEROMONES], // 22
  [PillEffect.PILLEFFECT_AMNESIA, PillEffect.PILLEFFECT_SEE_FOREVER], // 25
  [PillEffect.PILLEFFECT_WIZARD, PillEffect.PILLEFFECT_POWER], // 27
  [PillEffect.PILLEFFECT_ADDICTED, PillEffect.PILLEFFECT_PERCS], // 29
  [PillEffect.PILLEFFECT_QUESTIONMARK, PillEffect.PILLEFFECT_TELEPILLS], // 31
  [PillEffect.PILLEFFECT_RETRO_VISION, PillEffect.PILLEFFECT_SEE_FOREVER], // 37
  [PillEffect.PILLEFFECT_X_LAX, PillEffect.PILLEFFECT_SOMETHINGS_WRONG], // 39
  [PillEffect.PILLEFFECT_IM_EXCITED, PillEffect.PILLEFFECT_IM_DROWSY], // 42
  [PillEffect.PILLEFFECT_HORF, PillEffect.PILLEFFECT_GULP], // 44
  [PillEffect.PILLEFFECT_SHOT_SPEED_DOWN, PillEffect.PILLEFFECT_SHOT_SPEED_UP], // 47
]);

const FALSE_PHD_PILL_CONVERSIONS = new Map([
  [PillEffect.PILLEFFECT_BAD_GAS, PillEffect.PILLEFFECT_HEALTH_DOWN], // 0
  [PillEffect.PILLEFFECT_BALLS_OF_STEEL, PillEffect.PILLEFFECT_BAD_TRIP], // 2
  [PillEffect.PILLEFFECT_BOMBS_ARE_KEYS, PillEffect.PILLEFFECT_TEARS_DOWN], // 3
  [PillEffect.PILLEFFECT_EXPLOSIVE_DIARRHEA, PillEffect.PILLEFFECT_RANGE_DOWN], // 4
  [PillEffect.PILLEFFECT_FULL_HEALTH, PillEffect.PILLEFFECT_BAD_TRIP], // 5
  [PillEffect.PILLEFFECT_HEALTH_UP, PillEffect.PILLEFFECT_HEALTH_DOWN], // 7
  [PillEffect.PILLEFFECT_PRETTY_FLY, PillEffect.PILLEFFECT_LUCK_DOWN], // 10
  [PillEffect.PILLEFFECT_RANGE_UP, PillEffect.PILLEFFECT_RANGE_DOWN], // 12
  [PillEffect.PILLEFFECT_SPEED_UP, PillEffect.PILLEFFECT_SPEED_DOWN], // 14
  [PillEffect.PILLEFFECT_TEARS_UP, PillEffect.PILLEFFECT_TEARS_DOWN], // 16
  [PillEffect.PILLEFFECT_LUCK_UP, PillEffect.PILLEFFECT_LUCK_DOWN], // 18
  // In vanilla, this converts to ???, but in Racing+ we manually convert it to I'm Excited!!!
  [PillEffect.PILLEFFECT_TELEPILLS, PillEffect.PILLEFFECT_IM_EXCITED], // 19
  [PillEffect.PILLEFFECT_48HOUR_ENERGY, PillEffect.PILLEFFECT_SPEED_DOWN], // 20
  [PillEffect.PILLEFFECT_HEMATEMESIS, PillEffect.PILLEFFECT_BAD_TRIP], // 21
  // In vanilla, this converts to Amnesia, but in Racing+ we manually convert it to Retro Vision
  [PillEffect.PILLEFFECT_SEE_FOREVER, PillEffect.PILLEFFECT_RETRO_VISION], // 23
  [PillEffect.PILLEFFECT_PHEROMONES, PillEffect.PILLEFFECT_PARALYSIS], // 24
  // In vanilla, this converts to Amnesia, but in Racing+ we manually convert it to Horf!
  [PillEffect.PILLEFFECT_LEMON_PARTY, PillEffect.PILLEFFECT_HORF], // 26
  [PillEffect.PILLEFFECT_PERCS, PillEffect.PILLEFFECT_ADDICTED], // 28
  [PillEffect.PILLEFFECT_LARGER, PillEffect.PILLEFFECT_RANGE_DOWN], // 32
  [PillEffect.PILLEFFECT_SMALLER, PillEffect.PILLEFFECT_SPEED_DOWN], // 33
  [
    PillEffect.PILLEFFECT_INFESTED_EXCLAMATION,
    PillEffect.PILLEFFECT_TEARS_DOWN,
  ], // 34
  [PillEffect.PILLEFFECT_INFESTED_QUESTION, PillEffect.PILLEFFECT_LUCK_DOWN], // 35
  [PillEffect.PILLEFFECT_POWER, PillEffect.PILLEFFECT_WIZARD], // 36
  [
    PillEffect.PILLEFFECT_FRIENDS_TILL_THE_END,
    PillEffect.PILLEFFECT_HEALTH_DOWN,
  ], // 38
  [PillEffect.PILLEFFECT_SOMETHINGS_WRONG, PillEffect.PILLEFFECT_X_LAX], // 40
  [PillEffect.PILLEFFECT_IM_DROWSY, PillEffect.PILLEFFECT_IM_EXCITED], // 41
  [PillEffect.PILLEFFECT_GULP, PillEffect.PILLEFFECT_HORF], // 43
  [PillEffect.PILLEFFECT_SUNSHINE, PillEffect.PILLEFFECT_RETRO_VISION], // 45
  [PillEffect.PILLEFFECT_VURP, PillEffect.PILLEFFECT_HORF], // 46
  [PillEffect.PILLEFFECT_SHOT_SPEED_UP, PillEffect.PILLEFFECT_SHOT_SPEED_DOWN], // 48
]);

const sprites: Sprite[] = [];
initSprites();

export function getSprite(pillColor: PillColor): Sprite {
  return sprites[pillColor];
}

function initSprites() {
  sprites.push(Sprite()); // For convenience, make a null sprite on index 0
  for (let i = 1; i < PillColor.NUM_STANDARD_PILLS; i++) {
    const sprite = initSprite("gfx/pills/pill.anm2", `gfx/pills/${i}.png`);
    sprites.push(sprite);
  }
}

export function postRender(): void {
  if (!g.config.showPills) {
    return;
  }

  // This feature is disabled if the Single Player Co-op Babies mod is enabled
  // (the pills text will overlap with the baby descriptions)
  if (BabiesMod !== null) {
    return;
  }

  // Only show pill identification if someone is pressing the map button
  if (!isActionPressedOnAnyInput(ButtonAction.ACTION_MAP)) {
    return;
  }

  // Don't do anything if we have not taken any pills yet
  if (g.run.pills.length === 0) {
    return;
  }

  drawTextAndSprite();
}

function drawTextAndSprite() {
  const x = 80;
  let baseY = 97;
  for (let i = 9; i <= 12; i++) {
    // Avoid overflow on the bottom if we identify a lot of pills
    if (g.run.pills.length >= i) {
      baseY -= 20;
    }
  }

  const text = `Pills identified: ${g.run.pills.length} / ${NUM_PILLS_IN_POOL}`;
  g.font.DrawString(text, x - 10, baseY - 9 + 20, KCOLOR_DEFAULT, 0, true);

  baseY += 20;
  for (let i = 0; i < g.run.pills.length; i++) {
    const pillEntry = g.run.pills[i];

    // Show the pill sprite
    const y = baseY + 20 * (i + 1);
    const pos = Vector(x, y);
    pillEntry.sprite.RenderLayer(0, pos);

    // Show the pill effect as text
    let effectName = g.itemConfig.GetPillEffect(pillEntry.effect).Name;
    if (text === "Feels like I'm walking on sunshine!") {
      effectName = "Walking on sunshine!";
    }
    g.font.DrawString(effectName, x + 15, y - 9, KCOLOR_DEFAULT, 0, true);
  }
}

export function postUpdate(): void {
  if (!g.config.showPills) {
    return;
  }

  checkPHD();
  checkFalsePHD();
}

function checkPHD() {
  if (g.run.pillsPHD) {
    // We have already converted bad pill effects this run
    return;
  }

  if (
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_PHD) &&
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_VIRGO)
  ) {
    return;
  }

  g.run.pillsPHD = true;
  log("Converting bad pill effects.");

  // Change the text for any identified pills
  for (const pillEntry of g.run.pills) {
    const newEffect = PHD_PILL_CONVERSIONS.get(pillEntry.effect);
    if (newEffect !== undefined) {
      pillEntry.effect = newEffect;
    }
  }
}

function checkFalsePHD() {
  if (g.run.pillsFalsePHD) {
    // We have already converted good pill effects this run
    return;
  }

  if (!g.p.HasCollectible(CollectibleType.COLLECTIBLE_FALSE_PHD)) {
    return;
  }

  g.run.pillsFalsePHD = true;
  log("Converting good pill effects.");

  // Change the text for any identified pills
  for (const pillEntry of g.run.pills) {
    const newEffect = FALSE_PHD_PILL_CONVERSIONS.get(pillEntry.effect);
    if (newEffect !== undefined) {
      pillEntry.effect = newEffect;
    }
  }
}
