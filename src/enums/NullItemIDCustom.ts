const COSTUME_PATH_PREFIX = "gfx/characters/n016_";

/** These must have a corresponding entry in the "costumes2.xml" file. */
export enum NullItemIDCustom {
  /** January 1st */
  NEW_YEARS = Isaac.GetCostumeIdByPath(`${COSTUME_PATH_PREFIX}new_years.anm2`),

  /** March 17th */
  SAINT_PATRICKS_DAY = Isaac.GetCostumeIdByPath(
    `${COSTUME_PATH_PREFIX}saint_patricks_day.anm2`,
  ),

  /** October 31st */
  HALLOWEEN = Isaac.GetCostumeIdByPath(`${COSTUME_PATH_PREFIX}halloween.anm2`),

  /** November 24th */
  THANKSGIVING = Isaac.GetCostumeIdByPath(
    `${COSTUME_PATH_PREFIX}thanksgiving.anm2`,
  ),
}
