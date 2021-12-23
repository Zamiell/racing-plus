// Conditionally show a festive hat
// (disabled if it is not currently a holiday)

import { ensureAllCases, isJacobOrEsau } from "isaacscript-common";
import { config } from "../../../modConfigMenu";
import { NullItemIDCustom } from "../../../types/NullItemIDCustom";

enum Holiday {
  NONE,
  HALLOWEEN,
  THANKSGIVING,
  CHRISTMAS,
  NEW_YEARS,
}

const CURRENT_HOLIDAY = Holiday.CHRISTMAS;

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  if (!config.holidayHats) {
    return;
  }

  const holidayCostumeID = getHolidayCostumeID(CURRENT_HOLIDAY);
  if (holidayCostumeID === -1) {
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

function getHolidayCostumeID(holiday: Holiday) {
  switch (holiday) {
    case Holiday.NONE: {
      return -1;
    }

    case Holiday.HALLOWEEN: {
      return NullItemIDCustom.HALLOWEEN;
    }

    case Holiday.THANKSGIVING: {
      return NullItemIDCustom.THANKSGIVING;
    }

    case Holiday.CHRISTMAS: {
      return NullItemID.ID_CHRISTMAS;
    }

    case Holiday.NEW_YEARS: {
      return NullItemIDCustom.NEW_YEARS;
    }

    default: {
      ensureAllCases(holiday);
      return -1;
    }
  }
}
