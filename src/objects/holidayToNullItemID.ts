import { Holiday } from "./Holiday";
import { NullItemIDCustom } from "./NullItemIDCustom";

export const HOLIDAY_TO_NULL_ITEM_ID: {
  readonly [key in Holiday]: NullItemID | NullItemIDCustom | null;
} = {
  [Holiday.NONE]: null,
  [Holiday.NEW_YEARS]: NullItemIDCustom.NEW_YEARS,
  [Holiday.SAINT_PATRICKS_DAY]: NullItemIDCustom.SAINT_PATRICKS_DAY,
  [Holiday.HALLOWEEN]: NullItemIDCustom.HALLOWEEN,
  [Holiday.THANKSGIVING]: NullItemIDCustom.THANKSGIVING,
  [Holiday.CHRISTMAS]: NullItemID.ID_CHRISTMAS,
};
