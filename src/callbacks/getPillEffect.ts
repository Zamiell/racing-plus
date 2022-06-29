import {
  ModCallback,
  PillColor,
  PillEffect,
} from "isaac-typescript-definitions";
import * as removeBannedPillEffects from "../features/mandatory/removeBannedPillEffects";

export function init(mod: Mod): void {
  mod.AddCallback(ModCallback.GET_PILL_EFFECT, main);
}

function main(
  pillEffect: PillEffect,
  _pillColor: PillColor,
): PillEffect | undefined {
  return removeBannedPillEffects.getPillEffect(pillEffect);
}
