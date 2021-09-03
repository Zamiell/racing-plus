import * as clearerShadowAttacks from "../features/optional/enemies/clearerShadowAttacks";
import * as fastTravelPostEffectUpdate from "../features/optional/major/fastTravel/callbacks/postEffectUpdate";
import * as fastMoonlight from "../features/optional/quality/fastMoonlight";

export function init(mod: Mod): void {
  mod.AddCallback(
    ModCallbacks.MC_POST_EFFECT_UPDATE,
    target,
    EffectVariant.TARGET, // 30
  );

  mod.AddCallback(
    ModCallbacks.MC_POST_EFFECT_UPDATE,
    heavenLightDoor,
    EffectVariant.HEAVEN_LIGHT_DOOR, // 39
  );
}

// EffectVariant.TARGET (30)
function target(effect: EntityEffect) {
  clearerShadowAttacks.postEffectUpdateTarget(effect);
}

// EffectVariant.HEAVEN_LIGHT_DOOR (39)
function heavenLightDoor(effect: EntityEffect) {
  fastTravelPostEffectUpdate.heavenLightDoor(effect);
  fastMoonlight.postEffectUpdateHeavenLightDoor(effect);
}
