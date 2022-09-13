import { defaultMapGetPlayer, mapSetPlayer } from "isaacscript-common";
import {
  drawCustomChargeBar,
  NUM_FRAMES_IN_CHARGING_ANIMATION,
  shouldDrawCustomChargeBar,
} from "../../../../customChargeBar";
import { CustomChargeBarType } from "../../../../enums/CustomChargeBarType";
import { config } from "../../../../modConfigMenu";
import v, { MAX_BLOODY_LUST_CHARGES } from "./v";

const sprite = Sprite();
sprite.Load("gfx/chargebar_bloody_lust.anm2", true);

// ModCallback.ENTITY_TAKE_DMG (11)
// EntityType.PLAYER (1)
export function entityTakeDmgPlayer(player: EntityPlayer): void {
  if (!config.bloodyLustChargeBar) {
    return;
  }

  const numHits = defaultMapGetPlayer(v.level.playersNumHits, player);
  const newNumHits = numHits + 1;
  mapSetPlayer(v.level.playersNumHits, player, newNumHits);
}

// ModCallback.POST_PLAYER_RENDER (32)
export function postPlayerRender(player: EntityPlayer): void {
  if (!config.bloodyLustChargeBar) {
    return;
  }

  if (!shouldDrawCustomChargeBar(player, CustomChargeBarType.BLOODY_LUST)) {
    return;
  }

  const numHits = defaultMapGetPlayer(v.level.playersNumHits, player);

  const frameAmountPerCharge =
    NUM_FRAMES_IN_CHARGING_ANIMATION / MAX_BLOODY_LUST_CHARGES;
  const frame = Math.round(numHits * frameAmountPerCharge);
  drawCustomChargeBar(player, sprite, frame, CustomChargeBarType.BLOODY_LUST);
}
