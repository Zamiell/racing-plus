import * as fastTravelPostEffectInit from "../features/optional/major/fastTravel/callbacks/postEffectInit";
import g from "../globals";

// EffectVariant.POOF01 (15)
export function poof01(effect: EntityEffect): void {
  // If players start the run with familiars, they will leave behind stray poofs when they get moved
  if (g.g.GetFrameCount() === 0) {
    effect.Remove();

    // Even though we have removed it, it will still appear for a frame unless we make it invisible
    effect.Visible = false;
  }
}

// EffectVariant.HEAVEN_LIGHT_DOOR (39)
export function heavenLightDoor(effect: EntityEffect): void {
  fastTravelPostEffectInit.heavenLightDoor(effect);
}
