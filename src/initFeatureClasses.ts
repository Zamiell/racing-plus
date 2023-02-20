import { HolidayHats } from "./classes/features/optional/graphics/HolidayHats";
import { Season4 } from "./classes/features/speedrun/Season4";

const FEATURE_CLASSES = [
  // Speedrun
  Season4,

  // Graphics
  HolidayHats,
] as const;

export function initFeatureClasses(): void {
  for (const constructor of FEATURE_CLASSES) {
    const instantiatedClass = new constructor();
    instantiatedClass.init();
  }
}
