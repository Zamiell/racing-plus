import * as removeUselessPills from "../features/mandatory/removeUselessPills";

export function main(
  pillEffect: PillEffect,
  pillColor: PillColor,
): PillEffect | null {
  const newPillEffect = removeUselessPills.getPillEffect(pillEffect, pillColor);
  if (newPillEffect !== null) {
    return pillEffect;
  }

  return null;
}
