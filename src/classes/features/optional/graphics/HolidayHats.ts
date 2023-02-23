import {
  CallbackCustom,
  isJacobOrEsau,
  ModCallbackCustom,
} from "isaacscript-common";
import { Holiday } from "../../../../enums/Holiday";
import { HOLIDAY_TO_NULL_ITEM_ID } from "../../../../objects/holidayToNullItemID";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const CURRENT_HOLIDAY = Holiday.NONE as Holiday;

/** Conditionally show a festive hat. (It is disabled if it is not currently a holiday.) */
export class HolidayHats extends ConfigurableModFeature {
  configKey: keyof Config = "HolidayHats";

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReorderedFalse(): void {
    this.addHolidayHat();
  }

  addHolidayHat(): void {
    const nullItemID = HOLIDAY_TO_NULL_ITEM_ID[CURRENT_HOLIDAY];
    if (nullItemID === undefined) {
      return;
    }

    const player = Isaac.GetPlayer();
    player.AddNullCostume(nullItemID);

    if (isJacobOrEsau(player)) {
      const esau = player.GetOtherTwin();
      if (esau !== undefined) {
        esau.AddNullCostume(nullItemID);
      }
    }
  }
}
