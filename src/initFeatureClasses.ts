import { CheckErrors } from "./classes/features/mandatory/CheckErrors";
import { DisableMultiplayer } from "./classes/features/mandatory/DisableMultiplayer";
import { HolidayHats } from "./classes/features/optional/graphics/HolidayHats";
import { FastReset } from "./classes/features/optional/major/FastReset";
import { SpeedUpFadeIn } from "./classes/features/optional/quality/SpeedUpFadeIn";
import { RandomCharacterOrder } from "./classes/features/speedrun/RandomCharacterOrder";
import { Season1 } from "./classes/features/speedrun/Season1";
import { Season3 } from "./classes/features/speedrun/Season3";
import { Season4 } from "./classes/features/speedrun/Season4";

const FEATURE_CLASSES = [
  // Mandatory
  CheckErrors,
  DisableMultiplayer,

  // Speedrun
  RandomCharacterOrder,
  Season1,
  Season3,
  Season4,

  // Major
  FastReset,

  // QoL
  SpeedUpFadeIn,

  // GFX
  HolidayHats,
] as const;

export function initFeatureClasses(): void {
  for (const constructor of FEATURE_CLASSES) {
    const instantiatedClass = new constructor();
    instantiatedClass.init();
  }
}
