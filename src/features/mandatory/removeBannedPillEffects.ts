// Some pills are removed via specifying a bogus achievement in "pocketitems.xml". However, they can
// still appear if the player gets a False PHD and it converts a Telepills, I can see forever!, or
// Lemon Party. If this happens, convert them to specific other pills.

import { PillEffect } from "isaac-typescript-definitions";
import { ReadonlyMap } from "isaacscript-common";

const BANNED_PILLS = new ReadonlyMap<PillEffect, PillEffect>([
  [PillEffect.AMNESIA, PillEffect.HORF], // 25
  [PillEffect.QUESTION_MARKS, PillEffect.IM_EXCITED], // 31
]);

// ModCallback.GET_PILL_EFFECT (65)
export function getPillEffect(pillEffect: PillEffect): PillEffect | undefined {
  return BANNED_PILLS.get(pillEffect);
}
