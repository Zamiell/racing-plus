import { HolidayHats } from "./classes/features/optional/graphics/HolidayHats";
import { Season4 } from "./classes/features/speedrun/Season4";
import { ChallengeCustom } from "./enums/ChallengeCustom";

export function initFeatureClasses(): void {
  // Speedrun
  new Season4(ChallengeCustom.SEASON_4);

  // Graphics
  new HolidayHats("holidayHats");
}
