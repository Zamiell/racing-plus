import { MAX_TAINTED_SAMSON_BERSERK_CHARGE } from "isaacscript-common";
import {
  drawCustomChargeBar,
  NUM_FRAMES_IN_CHARGING_ANIMATION,
  shouldDrawCustomChargeBar,
} from "../../../customChargeBar";
import { CustomChargeBarType } from "../../../enums/CustomChargeBarType";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";

const sprite = Sprite();
sprite.Load("gfx/chargebar_tainted_samson.anm2", true);

// ModCallbacks.MC_POST_PLAYER_RENDER (32)
export function postPlayerRender(player: EntityPlayer): void {
  if (!config.taintedSamsonChargeBar) {
    return;
  }

  const hud = g.g.GetHUD();
  if (!hud.IsVisible()) {
    return;
  }

  if (!shouldDrawCustomChargeBar(player, CustomChargeBarType.TAINTED_SAMSON)) {
    return;
  }

  const frameAmountPerCharge =
    NUM_FRAMES_IN_CHARGING_ANIMATION / MAX_TAINTED_SAMSON_BERSERK_CHARGE;
  const frame = Math.round(player.SamsonBerserkCharge * frameAmountPerCharge);
  drawCustomChargeBar(
    player,
    sprite,
    frame,
    CustomChargeBarType.TAINTED_SAMSON,
  );
}