// Conditionally show a festive hat. (It is disabled if it is not currently a holiday.)

import { isJacobOrEsau } from "isaacscript-common";
import { Holiday } from "../../../enums/Holiday";
import { config } from "../../../modConfigMenu";
import { HOLIDAY_TO_NULL_ITEM_ID } from "../../../objects/holidayToNullItemID";

const CURRENT_HOLIDAY = Holiday.NEW_YEARS;

// ModCallback.POST_GAME_STARTED (15)
export function postGameStarted(): void {
  if (!config.holidayHats) {
    return;
  }

  const holidayCostumeID = HOLIDAY_TO_NULL_ITEM_ID[CURRENT_HOLIDAY];
  if (holidayCostumeID === undefined) {
    return;
  }

  const player = Isaac.GetPlayer();
  player.AddNullCostume(holidayCostumeID);

  if (isJacobOrEsau(player)) {
    const esau = player.GetOtherTwin();
    if (esau !== undefined) {
      esau.AddNullCostume(holidayCostumeID);
    }
  }
}
