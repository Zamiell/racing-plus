import { ModCallback, PillEffect } from "isaac-typescript-definitions";
import { Callback, ReadonlyMap } from "isaacscript-common";
import { MandatoryModFeature } from "../../MandatoryModFeature";

const BANNED_PILLS = new ReadonlyMap<PillEffect, PillEffect>([
  [PillEffect.AMNESIA, PillEffect.HORF], // 25
  [PillEffect.QUESTION_MARKS, PillEffect.IM_EXCITED], // 31
]);

/**
 * Some pills are removed via specifying a bogus achievement in "pocketitems.xml". However, they can
 * still appear if the player gets a False PHD:
 *
 * - Telepills --> ???
 * - I can see forever! --> Amnesia
 * - Lemon Party --> Amnesia
 *
 * If this happens, convert them to specific other pills.
 */
export class RemoveBannedPillEffects extends MandatoryModFeature {
  // 65
  @Callback(ModCallback.GET_PILL_EFFECT)
  getPillEffect(pillEffect: PillEffect): PillEffect | undefined {
    return BANNED_PILLS.get(pillEffect);
  }
}
