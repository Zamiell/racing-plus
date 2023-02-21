import { ModFeature } from "isaacscript-common";
import { CheckErrors } from "./classes/features/mandatory/CheckErrors";
import { DisableMultiplayer } from "./classes/features/mandatory/DisableMultiplayer";
import { DrawControls } from "./classes/features/mandatory/DrawControls";
import { ForceFadedConsoleDisplay } from "./classes/features/mandatory/ForceFadedConsoleDisplay";
import { LogConsoleCommands } from "./classes/features/mandatory/LogConsoleCommands";
import { RacingPlusIcon } from "./classes/features/mandatory/RacingPlusIcon";
import { RemoveBannedPillEffects } from "./classes/features/mandatory/RemoveBannedPillEffects";
import { RestartOnNextFrame } from "./classes/features/mandatory/RestartOnNextFrame";
import { TimeConsoleUsed } from "./classes/features/mandatory/TimeConsoleUsed";
import { FastHush } from "./classes/features/optional/bosses/FastHush";
import { DummyDPS } from "./classes/features/optional/enemies/DummyDPS";
import { HolidayHats } from "./classes/features/optional/graphics/HolidayHats";
import { FastReset } from "./classes/features/optional/major/FastReset";
import { SpeedUpFadeIn } from "./classes/features/optional/quality/SpeedUpFadeIn";
import { RandomCharacterOrder } from "./classes/features/speedrun/RandomCharacterOrder";
import { Season1 } from "./classes/features/speedrun/Season1";
import { Season2 } from "./classes/features/speedrun/Season2";
import { Season3 } from "./classes/features/speedrun/Season3";
import { Season4 } from "./classes/features/speedrun/Season4";

const FEATURE_CLASSES = [
  // Mandatory
  CheckErrors,
  DisableMultiplayer,
  ForceFadedConsoleDisplay,
  LogConsoleCommands,
  RacingPlusIcon,
  RemoveBannedPillEffects,
  RestartOnNextFrame,
  TimeConsoleUsed,

  // Speedrun
  RandomCharacterOrder,
  Season1,
  Season2,
  Season3,
  Season4,

  // Major
  FastReset,

  // Bosses
  FastHush, // 407

  // Enemies
  DummyDPS, // 964

  // QoL
  SpeedUpFadeIn,

  // GFX
  DrawControls,
  HolidayHats,
] as const satisfies ReadonlyArray<typeof ModFeature>;

export function initFeatureClasses(): void {
  for (const constructor of FEATURE_CLASSES) {
    const instantiatedClass = new constructor();
    instantiatedClass.init();
  }
}
