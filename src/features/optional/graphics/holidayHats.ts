// Conditionally show a festive hat. (It is disabled if it is not currently a holiday.)

import { NullItemID } from "isaac-typescript-definitions";
import { isJacobOrEsau } from "isaacscript-common";
import { Holiday } from "../../../enums/Holiday";
import { config } from "../../../modConfigMenu";
import { HOLIDAY_TO_NULL_ITEM_ID } from "../../../objects/holidayToNullItemID";

const CURRENT_HOLIDAY = Holiday.NONE as Holiday;

// ModCallback.POST_GAME_STARTED (15)
export function postGameStarted(): void {
  if (!config.holidayHats) {
    return;
  }

  const nullItemID = HOLIDAY_TO_NULL_ITEM_ID[CURRENT_HOLIDAY];
  if (nullItemID === undefined) {
    return;
  }

  addHolidayHat(nullItemID);
}

function addHolidayHat(nullItemID: NullItemID) {
  const player = Isaac.GetPlayer();
  player.AddNullCostume(nullItemID);

  if (isJacobOrEsau(player)) {
    const esau = player.GetOtherTwin();
    if (esau !== undefined) {
      esau.AddNullCostume(nullItemID);
    }
  }
}
