// This feature is not configurable because it changes pill pools and will cause a seed to be
// different

import g from "../../globals";
import { getRandom, initRNG } from "../../misc";

const REMOVED_PILL_EFFECTS: PillEffect[] = [
  PillEffect.PILLEFFECT_AMNESIA, // 25
  PillEffect.PILLEFFECT_QUESTIONMARK, // 31
];

const PILL_EFFECT_POOL: PillEffect[] = [];
for (let i = 0; i < PillEffect.NUM_PILL_EFFECTS; i++) {
  if (!REMOVED_PILL_EFFECTS.includes(i)) {
    PILL_EFFECT_POOL.push(i);
  }
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  generateNewEffects();
}

// There are 13 pills in the pool for Repentance
// In order to remove some pill effects, we have to custom-assign all the pills
// Generate 13 new effects for this run
function generateNewEffects() {
  const startSeed = g.seeds.GetStartSeed();
  const rng = initRNG(startSeed);

  for (let i = 1; i <= 13; i++) {
    let pillEffect: PillEffect;
    do {
      rng.Next();
      pillEffect = getRandom(0, PILL_EFFECT_POOL.length - 1, rng.GetSeed());
    } while (g.run.pillEffects.includes(pillEffect));
    g.run.pillEffects.push(pillEffect);
  }
}

// ModCallbacks.MC_GET_PILL_EFFECT (65)
export function getPillEffect(
  _pillEffect: PillEffect,
  pillColor: PillColor,
): PillEffect {
  // The first pill color is PillColor.PILL_BLUE_BLUE (1)
  // The effect for it is the first element in the array, at index 0
  // Thus, we have to subtract one to convert the pill color to the array index
  const arrayIndex = pillColor - 1;
  const newPillEffect = g.run.pillEffects[arrayIndex];
  if (newPillEffect === undefined) {
    error(`Failed to get the pill effect for a pill color of: ${pillColor}`);
  }

  return newPillEffect;
}
