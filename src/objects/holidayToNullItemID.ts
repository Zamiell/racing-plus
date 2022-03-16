import { Holiday } from "../enums/Holiday";
import { NullItemIDCustom } from "../enums/NullItemIDCustom";

export const HOLIDAY_TO_NULL_ITEM_ID: {
  readonly [key in Holiday]: NullItemID | NullItemIDCustom | undefined;
} = {
  [Holiday.NONE]: undefined,
  [Holiday.NEW_YEARS]: NullItemIDCustom.NEW_YEARS,
  [Holiday.SAINT_PATRICKS_DAY]: NullItemIDCustom.SAINT_PATRICKS_DAY,
  [Holiday.HALLOWEEN]: NullItemIDCustom.HALLOWEEN,
  [Holiday.THANKSGIVING]: NullItemIDCustom.THANKSGIVING,
  [Holiday.CHRISTMAS]: NullItemID.ID_CHRISTMAS,
};
