import { CollectibleType } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import {
  NUM_FRAMES_IN_CHARGING_ANIMATION,
  NUM_ROOMS_TO_CHARGE_AZAZELS_RAGE,
  drawCustomChargeBar,
  shouldDrawCustomChargeBar,
} from "../../../../customChargeBar";
import { CustomChargeBarType } from "../../../../enums/CustomChargeBarType";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const chargeBarSprite = Sprite();
chargeBarSprite.Load("gfx/chargebar_azazels_rage.anm2", true);

export class AzazelsRageChargeBar extends ConfigurableModFeature {
  configKey: keyof Config = "AzazelsRageChargeBar";

  @CallbackCustom(ModCallbackCustom.POST_PLAYER_RENDER_REORDERED)
  postPlayerRenderReordered(player: EntityPlayer): void {
    if (!shouldDrawCustomChargeBar(player, CustomChargeBarType.AZAZELS_RAGE)) {
      return;
    }

    const effects = player.GetEffects();
    let numCharges = effects.GetCollectibleEffectNum(
      CollectibleType.AZAZELS_RAGE,
    );

    // The number of effects goes to 6 when the blast is firing.
    if (numCharges > 4) {
      numCharges = 0;
    }

    const frameAmountPerCharge =
      NUM_FRAMES_IN_CHARGING_ANIMATION / NUM_ROOMS_TO_CHARGE_AZAZELS_RAGE;
    const frame = Math.round(numCharges * frameAmountPerCharge);
    drawCustomChargeBar(
      player,
      chargeBarSprite,
      frame,
      CustomChargeBarType.AZAZELS_RAGE,
    );
  }
}
