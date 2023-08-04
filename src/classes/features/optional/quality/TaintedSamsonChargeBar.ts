import {
  CallbackCustom,
  MAX_TAINTED_SAMSON_BERSERK_CHARGE,
  ModCallbackCustom,
} from "isaacscript-common";
import {
  NUM_FRAMES_IN_CHARGING_ANIMATION,
  drawCustomChargeBar,
  shouldDrawCustomChargeBar,
} from "../../../../customChargeBar";
import { CustomChargeBarType } from "../../../../enums/CustomChargeBarType";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const chargeBarSprite = Sprite();
chargeBarSprite.Load("gfx/chargebar_tainted_samson.anm2", true);

export class TaintedSamsonChargeBar extends ConfigurableModFeature {
  configKey: keyof Config = "TaintedSamsonChargeBar";

  @CallbackCustom(ModCallbackCustom.POST_PLAYER_RENDER_REORDERED)
  postPlayerRenderReordered(player: EntityPlayer): void {
    if (
      !shouldDrawCustomChargeBar(player, CustomChargeBarType.TAINTED_SAMSON)
    ) {
      return;
    }

    const frameAmountPerCharge =
      NUM_FRAMES_IN_CHARGING_ANIMATION / MAX_TAINTED_SAMSON_BERSERK_CHARGE;
    const frame = Math.round(player.SamsonBerserkCharge * frameAmountPerCharge);
    drawCustomChargeBar(
      player,
      chargeBarSprite,
      frame,
      CustomChargeBarType.TAINTED_SAMSON,
    );
  }
}
