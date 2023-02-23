import { SeedEffect } from "isaac-typescript-definitions";
import { game } from "isaacscript-common";
import { config } from "../../../../modConfigMenu";

export function shouldEnableFastClear(): boolean {
  const seeds = game.GetSeeds();

  return (
    config.FastClear &&
    !game.IsGreedMode() &&
    // Fast-clear does not work with the "PAC1F1CM" seed / Easter Egg.
    !seeds.HasSeedEffect(SeedEffect.PACIFIST)
  );
}
