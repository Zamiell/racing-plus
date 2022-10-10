import {
  ModCallback,
  PillColor,
  PillEffect,
} from "isaac-typescript-definitions";
import * as removeBannedPillEffects from "../features/mandatory/removeBannedPillEffects";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(ModCallback.GET_PILL_EFFECT, main);
}

function main(
  pillEffect: PillEffect,
  _pillColor: PillColor,
): PillEffect | undefined {
  return removeBannedPillEffects.getPillEffect(pillEffect);
}
