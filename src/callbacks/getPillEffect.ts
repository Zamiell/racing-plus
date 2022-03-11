import * as removeBannedPillEffects from "../features/mandatory/removeBannedPillEffects";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallbacks.MC_GET_PILL_EFFECT, main);
}

function main(
  pillEffect: PillEffect,
  _pillColor: PillColor,
): PillEffect | void {
  return removeBannedPillEffects.getPillEffect(pillEffect);
}
