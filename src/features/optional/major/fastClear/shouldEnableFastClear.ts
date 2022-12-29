import { SeedEffect } from "isaac-typescript-definitions";
import { game } from "isaacscript-common";
import { g } from "../../../../globals";
import { config } from "../../../../modConfigMenu";

export function shouldEnableFastClear(): boolean {
  return (
    config.fastClear &&
    !game.IsGreedMode() &&
    // Fast-clear does not work with the "PAC1F1CM" seed / Easter Egg.
    !g.seeds.HasSeedEffect(SeedEffect.PACIFIST)
  );
}
