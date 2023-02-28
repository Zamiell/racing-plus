import { EffectVariant, ModCallback } from "isaac-typescript-definitions";
import * as fastTravelPostEffectUpdate from "../features/optional/major/fastTravel/callbacks/postEffectUpdate";
import * as fadeDevilStatue from "../features/optional/quality/fadeDevilStatue";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(
    ModCallback.POST_EFFECT_UPDATE,
    devil,
    EffectVariant.DEVIL, // 6
  );

  mod.AddCallback(
    ModCallback.POST_EFFECT_UPDATE,
    heavenLightDoor,
    EffectVariant.HEAVEN_LIGHT_DOOR, // 39
  );
}

// EffectVariant.DEVIL (6)
function devil(effect: EntityEffect) {
  fadeDevilStatue.postEffectUpdateDevil(effect);
}

// EffectVariant.HEAVEN_LIGHT_DOOR (39)
function heavenLightDoor(effect: EntityEffect) {
  fastTravelPostEffectUpdate.heavenLightDoor(effect);
}
