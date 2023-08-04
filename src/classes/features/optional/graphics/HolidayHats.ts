import { NullItemID } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  isJacobOrEsau,
  ModCallbackCustom,
} from "isaacscript-common";
import { NullItemIDCustom } from "../../../../enums/NullItemIDCustom";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

enum Holiday {
  NONE,

  /** January 1st */
  NEW_YEARS,

  /** March 17th */
  SAINT_PATRICKS_DAY,

  /** October 31st */
  HALLOWEEN,

  /** November 24th */
  THANKSGIVING,

  /** December 25th */
  CHRISTMAS,
}

const HOLIDAY_TO_NULL_ITEM_ID = {
  [Holiday.NONE]: undefined,
  [Holiday.NEW_YEARS]: NullItemIDCustom.NEW_YEARS,
  [Holiday.SAINT_PATRICKS_DAY]: NullItemIDCustom.SAINT_PATRICKS_DAY,
  [Holiday.HALLOWEEN]: NullItemIDCustom.HALLOWEEN,
  [Holiday.THANKSGIVING]: NullItemIDCustom.THANKSGIVING,
  [Holiday.CHRISTMAS]: NullItemID.CHRISTMAS,
} as const satisfies Record<Holiday, NullItemID | undefined>;

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
