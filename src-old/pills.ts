import { ChallengeCustom } from "./challenges/enums";
import * as season8 from "./challenges/season8";
import { DEFAULT_KCOLOR } from "./constants";
import g from "./globals";
import * as misc from "./misc";

const PHD_PILL_CONVERSIONS = new Map([
  [PillEffect.PILLEFFECT_BAD_TRIP, PillEffect.PILLEFFECT_BALLS_OF_STEEL], // 1
  [PillEffect.PILLEFFECT_HEALTH_DOWN, PillEffect.PILLEFFECT_HEALTH_UP], // 6
  [PillEffect.PILLEFFECT_RANGE_DOWN, PillEffect.PILLEFFECT_RANGE_UP], // 11
  [PillEffect.PILLEFFECT_SPEED_DOWN, PillEffect.PILLEFFECT_SPEED_UP], // 13
  [PillEffect.PILLEFFECT_TEARS_DOWN, PillEffect.PILLEFFECT_TEARS_UP], // 15
  [PillEffect.PILLEFFECT_LUCK_DOWN, PillEffect.PILLEFFECT_LUCK_UP], // 17
  [PillEffect.PILLEFFECT_PARALYSIS, PillEffect.PILLEFFECT_PHEROMONES], // 22
  [PillEffect.PILLEFFECT_WIZARD, PillEffect.PILLEFFECT_POWER], // 27
  [PillEffect.PILLEFFECT_ADDICTED, PillEffect.PILLEFFECT_PERCS], // 29
  [PillEffect.PILLEFFECT_RETRO_VISION, PillEffect.PILLEFFECT_SEE_FOREVER], // 37
  [PillEffect.PILLEFFECT_X_LAX, PillEffect.PILLEFFECT_SOMETHINGS_WRONG], // 39
  [PillEffect.PILLEFFECT_IM_EXCITED, PillEffect.PILLEFFECT_IM_DROWSY], // 42
]);

export function postRender(): void {
  // This feature is disabled if the Single Player Co-op Babies mod is enabled
  // (the pills text will overlap with the baby descriptions)
  if (SinglePlayerCoopBabies !== null) {
    return;
  }

  // This feature is disabled in season 7 speedruns
  // (the pills text will overlap with the remaining goals)
  const challenge = Isaac.GetChallenge();
  if (challenge === ChallengeCustom.R7_SEASON_7) {
    return;
  }

  // Only show pill identification if the user is pressing tab
  if (!misc.isActionPressed(ButtonAction.ACTION_MAP)) {
    return;
  }

  // Don't do anything if we have not taken any pills yet
  if (g.run.pills.length === 0) {
    return;
  }

  const x = 80;
  let baseY = 97;
  for (let i = 9; i <= 12; i++) {
    // Avoid overflow on the bottom if we identify a lot of pills
    if (g.run.pills.length >= i) {
      baseY -= 20;
    }
  }

  let totalPillsInPool = 13;
  if (RacingPlusRebalancedVersion !== null) {
    totalPillsInPool = 4;
  }

  const text = `Pills identified: ${g.run.pills.length} / ${totalPillsInPool}`;
  g.font.DrawString(text, x - 10, baseY - 9 + 20, DEFAULT_KCOLOR, 0, true);

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
    g.font.DrawString(effectName, x + 15, y - 9, DEFAULT_KCOLOR, 0, true);
  }
}

export function checkPHD(): void {
  if (g.run.PHDPills) {
    // We have already converted bad pill effects this run
    return;
  }

  // Check for the PHD & Virgo
  if (
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_PHD) &&
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_VIRGO)
  ) {
    return;
  }

  g.run.PHDPills = true;
  Isaac.DebugString("Converting bad pill effects.");

  // Change the text for any identified pills
  for (const pillEntry of g.run.pills) {
    const newEffect = PHD_PILL_CONVERSIONS.get(pillEntry.effect);
    if (newEffect !== undefined) {
      pillEntry.effect = newEffect;
    }
  }

  season8.PHD();
}
