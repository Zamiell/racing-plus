import * as removeBannedPillEffects from "../features/mandatory/removeBannedPillEffects";

export function main(
  pillEffect: PillEffect,
  _pillColor: PillColor,
): PillEffect | void {
  return removeBannedPillEffects.getPillEffect(pillEffect);
}
