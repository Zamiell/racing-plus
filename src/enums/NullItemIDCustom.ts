import { validateCustomEnum } from "isaacscript-common";

const COSTUME_PATH_PREFIX = "gfx/characters";

/** These must have a corresponding entry in the "costumes2.xml" file. */
export const NullItemIDCustom = {
  /** January 1st */
  NEW_YEARS: Isaac.GetCostumeIdByPath(
    `${COSTUME_PATH_PREFIX}/n016_new_years.anm2`,
  ),

  /** March 17th */
  SAINT_PATRICKS_DAY: Isaac.GetCostumeIdByPath(
    `${COSTUME_PATH_PREFIX}/n016_saint_patricks_day.anm2`,
  ),

  /** October 31st */
  HALLOWEEN: Isaac.GetCostumeIdByPath(
    `${COSTUME_PATH_PREFIX}/n016_halloween.anm2`,
  ),

  /** November 24th */
  THANKSGIVING: Isaac.GetCostumeIdByPath(
    `${COSTUME_PATH_PREFIX}/n016_thanksgiving.anm2`,
  ),
} as const;

validateCustomEnum("NullItemIDCustom", NullItemIDCustom);
