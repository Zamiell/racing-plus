import * as season8 from "../challenges/season8";

export function main(
  pillEffect: PillEffect,
  pillColor: PillColor,
): PillEffect | null {
  return season8.getPillEffect(pillEffect, pillColor);
}
