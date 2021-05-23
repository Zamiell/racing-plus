import g from "../../../../../globals";
import { initRNG } from "../../../../../misc";

export function postGameStarted(): void {
  if (!g.config.fastClear) {
    return;
  }

  initVariables();
}

function initVariables() {
  const startSeed = g.seeds.GetStartSeed();

  g.run.fastClear.roomClearAwardSeed = startSeed;

  // We want to insure that the second RNG counter does not overlap with the first one
  // (around 175 rooms are cleared in an average speedrun, so 500 is a reasonable upper limit)
  const rng = initRNG(startSeed);
  for (let i = 0; i < 500; i++) {
    rng.Next();
  }
  g.run.fastClear.roomClearAwardSeedDevilAngel = rng.GetSeed();
}
