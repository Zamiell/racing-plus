import { ModFeature } from "isaacscript-common";
import { DisableCurses } from "./classes/features/major/DisableCurses";
import { FreeDevilItem } from "./classes/features/major/FreeDevilItem";
import { StartWithD6 } from "./classes/features/major/StartWithD6";
import { CheckErrors } from "./classes/features/mandatory/CheckErrors";
import { DisableMultiplayer } from "./classes/features/mandatory/DisableMultiplayer";
import { DoubleAngelNerf } from "./classes/features/mandatory/DoubleAngelNerf";
import { DrawControls } from "./classes/features/mandatory/DrawControls";
import { ForceFadedConsoleDisplay } from "./classes/features/mandatory/ForceFadedConsoleDisplay";
import { LogConsoleCommands } from "./classes/features/mandatory/LogConsoleCommands";
import { RacingPlusIcon } from "./classes/features/mandatory/RacingPlusIcon";
import { RemoveBannedPillEffects } from "./classes/features/mandatory/RemoveBannedPillEffects";
import { RestartOnNextFrame } from "./classes/features/mandatory/RestartOnNextFrame";
import { TimeConsoleUsed } from "./classes/features/mandatory/TimeConsoleUsed";
import { FastHush } from "./classes/features/optional/bosses/FastHush";
import { FastMegaSatan } from "./classes/features/optional/bosses/FastMegaSatan";
import { PreventEndMegaSatan } from "./classes/features/optional/bosses/PreventEndMegaSatan";
import { AppearHands } from "./classes/features/optional/enemies/AppearHands";
import { DummyDPS } from "./classes/features/optional/enemies/DummyDPS";
import { FastDusts } from "./classes/features/optional/enemies/FastDusts";
import { FastPolties } from "./classes/features/optional/enemies/FastPolties";
import { GlobinSoftlock } from "./classes/features/optional/enemies/GlobinSoftlock";
import { VulnerableGhosts } from "./classes/features/optional/enemies/VulnerableGhosts";
import { HolidayHats } from "./classes/features/optional/graphics/HolidayHats";
import { FastReset } from "./classes/features/optional/major/FastReset";
import { SpeedUpFadeIn } from "./classes/features/optional/quality/SpeedUpFadeIn";
import { SilenceMomDad } from "./classes/features/optional/sounds/SilenceMomDad";
import { RandomCharacterOrder } from "./classes/features/speedrun/RandomCharacterOrder";
import { Season1 } from "./classes/features/speedrun/Season1";
import { Season2 } from "./classes/features/speedrun/Season2";
import { Season3 } from "./classes/features/speedrun/Season3";
import { Season4 } from "./classes/features/speedrun/Season4";
import { PreventEndBeast } from "./features/mandatory/PreventEndBeast";

/** TODO: Search for all `config` to ensure that no functions have early return with it. */
const FEATURE_CLASSES = [
  // Mandatory
  CheckErrors,
  DisableMultiplayer,
  DoubleAngelNerf,
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
  StartWithD6,
  DisableCurses,
  // - BetterDevilAngelRooms,
  FreeDevilItem,
  FastReset,
  // - FastClear,
  // - FastTravel,

  // Hotkeys
  // TODO

  // Characters
  // TODO

  // Bosses
  FastMegaSatan, // 274, 275
  PreventEndMegaSatan, // 275
  FastHush, // 407
  PreventEndBeast, // 951

  // Enemies
  GlobinSoftlock, // 24
  AppearHands, // 213, 287
  VulnerableGhosts, // 219, 260, 285
  FastPolties, // 816
  FastDusts, // 882
  DummyDPS, // 964

  // Quality of Life
  SpeedUpFadeIn,

  // Gameplay
  // TODO

  // Removals
  // TODO

  // Cutscenes
  // TODO

  // Bug Fixes
  // TODO

  // Graphics
  DrawControls,
  HolidayHats,

  // Sounds
  SilenceMomDad,

  // Other
  // TODO
] as const satisfies ReadonlyArray<typeof ModFeature>;

export function initFeatureClasses(): void {
  for (const constructor of FEATURE_CLASSES) {
    const instantiatedClass = new constructor();
    instantiatedClass.init();
  }
}
