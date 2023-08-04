import {
  CallbackCustom,
  defaultMapGetPlayer,
  mapSetPlayer,
  ModCallbackCustom,
} from "isaacscript-common";
import {
  drawCustomChargeBar,
  NUM_FRAMES_IN_CHARGING_ANIMATION,
  shouldDrawCustomChargeBar,
} from "../../../../customChargeBar";
import { CustomChargeBarType } from "../../../../enums/CustomChargeBarType";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";
import { MAX_BLOODY_LUST_CHARGES, v } from "./bloodyLustChargeBar/v";

const sprite = Sprite();
sprite.Load("gfx/chargebar_bloody_lust.anm2", true);

export class BloodyLustChargeBar extends ConfigurableModFeature {
  configKey: keyof Config = "BloodyLustChargeBar";
  v = v;

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const numHits = defaultMapGetPlayer(v.level.playersNumHits, player);
    const newNumHits = numHits + 1;
    mapSetPlayer(v.level.playersNumHits, player, newNumHits);

    return undefined;
  }

  @CallbackCustom(ModCallbackCustom.POST_PLAYER_RENDER_REORDERED)
  postPlayerRenderReordered(player: EntityPlayer): void {
    if (!shouldDrawCustomChargeBar(player, CustomChargeBarType.BLOODY_LUST)) {
      return;
    }

    const numHits = defaultMapGetPlayer(v.level.playersNumHits, player);

    const frameAmountPerCharge =
      NUM_FRAMES_IN_CHARGING_ANIMATION / MAX_BLOODY_LUST_CHARGES;
    const frame = Math.round(numHits * frameAmountPerCharge);
    drawCustomChargeBar(player, sprite, frame, CustomChargeBarType.BLOODY_LUST);
  }
}
