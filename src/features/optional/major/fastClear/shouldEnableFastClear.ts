import { isGreedMode } from "isaacscript-common";
import g from "../../../../globals";
import { config } from "../../../../modConfigMenu";

export function shouldEnableFastClear(): boolean {
  return (
    config.fastClear &&
    !isGreedMode() &&
    // Fast-clear does not work with the "PAC1F1CM" seed / Easter Egg
    !g.seeds.HasSeedEffect(SeedEffect.SEED_PACIFIST)
  );
}
