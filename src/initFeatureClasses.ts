import { ModFeature } from "isaacscript-common";
import { DebugItem } from "./classes/features/items/DebugItem";
import { FlipCustom } from "./classes/features/items/FlipCustom";
import { Magic8BallSeeded } from "./classes/features/items/Magic8BallSeeded";
import { NLuck } from "./classes/features/items/NLuck";
import { Sawblade } from "./classes/features/items/Sawblade";
import { SolCustom } from "./classes/features/items/SolCustom";
import { DisableCurses } from "./classes/features/major/DisableCurses";
import { FreeDevilItem } from "./classes/features/major/FreeDevilItem";
import { StartWithD6 } from "./classes/features/major/StartWithD6";
import { CheckErrors } from "./classes/features/mandatory/CheckErrors";
import { DisableMultiplayer } from "./classes/features/mandatory/DisableMultiplayer";
import { DoubleAngelNerf } from "./classes/features/mandatory/DoubleAngelNerf";
import { DrawControls } from "./classes/features/mandatory/DrawControls";
import { DrawVersion } from "./classes/features/mandatory/DrawVersion";
import { ForceFadedConsoleDisplay } from "./classes/features/mandatory/ForceFadedConsoleDisplay";
import { LogConsoleCommands } from "./classes/features/mandatory/LogConsoleCommands";
import { PreserveCheckpoint } from "./classes/features/mandatory/PreserveCheckpoint";
import { RacingPlusIcon } from "./classes/features/mandatory/RacingPlusIcon";
import { RemoveBannedPillEffects } from "./classes/features/mandatory/RemoveBannedPillEffects";
import { RemoveGlitchedItems } from "./classes/features/mandatory/RemoveGlitchedItems";
import { RestartOnNextFrame } from "./classes/features/mandatory/RestartOnNextFrame";
import { TimeConsoleUsed } from "./classes/features/mandatory/TimeConsoleUsed";
import { Trophy } from "./classes/features/mandatory/Trophy";
import { ConsistentAngels } from "./classes/features/optional/bosses/ConsistentAngels";
import { FadeBosses } from "./classes/features/optional/bosses/FadeBosses";
import { FastAngels } from "./classes/features/optional/bosses/FastAngels";
import { FastBigHorn } from "./classes/features/optional/bosses/FastBigHorn";
import { FastBlastocyst } from "./classes/features/optional/bosses/FastBlastocyst";
import { FastBossRush } from "./classes/features/optional/bosses/FastBossRush";
import { FastColostomia } from "./classes/features/optional/bosses/FastColostomia";
import { FastDogma } from "./classes/features/optional/bosses/FastDogma";
import { FastHaunt } from "./classes/features/optional/bosses/FastHaunt";
import { FastHeretic } from "./classes/features/optional/bosses/FastHeretic";
import { FastHush } from "./classes/features/optional/bosses/FastHush";
import { FastKrampus } from "./classes/features/optional/bosses/FastKrampus";
import { FastMegaSatan } from "./classes/features/optional/bosses/FastMegaSatan";
import { FastMom } from "./classes/features/optional/bosses/FastMom";
import { FastPin } from "./classes/features/optional/bosses/FastPin";
import { FastSatan } from "./classes/features/optional/bosses/FastSatan";
import { OpenHushDoor } from "./classes/features/optional/bosses/OpenHushDoor";
import { PreventDeathSlow } from "./classes/features/optional/bosses/PreventDeathSlow";
import { PreventEndBeast } from "./classes/features/optional/bosses/PreventEndBeast";
import { PreventEndMegaSatan } from "./classes/features/optional/bosses/PreventEndMegaSatan";
import { PreventVictoryLapPopup } from "./classes/features/optional/bosses/PreventVictoryLapPopup";
import { RemoveArmor } from "./classes/features/optional/bosses/RemoveArmor";
import { RemoveLambBody } from "./classes/features/optional/bosses/RemoveLambBody";
import { BatteryBumFix } from "./classes/features/optional/bugfix/BatteryBumFix";
import { FastTeleport } from "./classes/features/optional/cutscenes/FastTeleport";
import { AppearHands } from "./classes/features/optional/enemies/AppearHands";
import { ClearerShadowAttacks } from "./classes/features/optional/enemies/ClearerShadowAttacks";
import { DummyDPS } from "./classes/features/optional/enemies/DummyDPS";
import { FadeFriendlyEnemies } from "./classes/features/optional/enemies/FadeFriendlyEnemies";
import { FastDusts } from "./classes/features/optional/enemies/FastDusts";
import { FastGhosts } from "./classes/features/optional/enemies/FastGhosts";
import { FastHands } from "./classes/features/optional/enemies/FastHands";
import { FastNeedles } from "./classes/features/optional/enemies/FastNeedles";
import { FastPolties } from "./classes/features/optional/enemies/FastPolties";
import { GlobinSoftlock } from "./classes/features/optional/enemies/GlobinSoftlock";
import { RemoveStrayPitfalls } from "./classes/features/optional/enemies/RemoveStrayPitfalls";
import { RemoveTreasureRoomEnemies } from "./classes/features/optional/enemies/RemoveTreasureRoomEnemies";
import { ReplaceCodWorms } from "./classes/features/optional/enemies/ReplaceCodWorms";
import { VulnerableGhosts } from "./classes/features/optional/enemies/VulnerableGhosts";
import { HolidayHats } from "./classes/features/optional/graphics/HolidayHats";
import { FastReset } from "./classes/features/optional/major/FastReset";
import { RemovePerfectionOnEndFloors } from "./classes/features/optional/quality/RemovePerfectionOnEndFloors";
import { RunTimer } from "./classes/features/optional/quality/RunTimer";
import { ShowMaxFamiliars } from "./classes/features/optional/quality/ShowMaxFamiliars";
import { SpeedUpFadeIn } from "./classes/features/optional/quality/SpeedUpFadeIn";
import { SilenceMomDad } from "./classes/features/optional/sounds/SilenceMomDad";
import { RandomCharacterOrder } from "./classes/features/speedrun/RandomCharacterOrder";
import { Season1 } from "./classes/features/speedrun/Season1";
import { Season2 } from "./classes/features/speedrun/Season2";
import { Season3 } from "./classes/features/speedrun/Season3";
import { Season4 } from "./classes/features/speedrun/Season4";

/**
 * TODO:
 * - Search for all `config` to ensure that no functions have early return with it.
 * - Search for: ^(?<![\s\S\r])//
 * - Search all files for "const v" && "v = v" (make lint rule)
 * - Search for all "import *"
 */
const FEATURE_CLASSES = [
  // Mandatory
  CheckErrors,
  DisableMultiplayer,
  DoubleAngelNerf,
  DrawVersion,
  ForceFadedConsoleDisplay,
  LogConsoleCommands,
  PreserveCheckpoint,
  RacingPlusIcon,
  RemoveBannedPillEffects,
  RemoveGlitchedItems,
  RestartOnNextFrame,
  TimeConsoleUsed,
  Trophy,

  // Speedrun
  RandomCharacterOrder, // This must be before the seasons.
  Season1,
  Season2,
  Season3,
  Season4,

  // Items
  DebugItem,
  FlipCustom,
  Magic8BallSeeded,
  NLuck,
  Sawblade,
  SolCustom,

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
  FadeBosses,
  FastBossRush,
  RemoveArmor,
  FastMom, // 45, 78
  FastPin, // 62
  PreventDeathSlow, // 66
  FastBlastocyst, // 74
  FastKrampus, // 81
  FastSatan, // 84
  FastHaunt, // 260
  FastAngels, // 271, 272
  ConsistentAngels, // 271, 272
  RemoveLambBody, // 273
  PreventVictoryLapPopup, // 273
  FastMegaSatan, // 274, 275
  PreventEndMegaSatan, // 275
  OpenHushDoor, // 407
  FastHush, // 407
  FastBigHorn, // 411
  FastHeretic, // 905
  FastColostomia, // 917
  FastDogma, // 950
  PreventEndBeast, // 951

  // Enemies
  ClearerShadowAttacks,
  FadeFriendlyEnemies,
  RemoveTreasureRoomEnemies,
  GlobinSoftlock, // 24
  AppearHands, // 213, 287
  FastHands, // 213, 287
  VulnerableGhosts, // 219, 260, 285
  FastGhosts, // 219, 285
  ReplaceCodWorms, // 221
  RemoveStrayPitfalls, // 291
  FastPolties, // 816
  FastNeedles, // 881
  FastDusts, // 882
  DummyDPS, // 964

  // Quality of Life
  RemovePerfectionOnEndFloors,
  RunTimer,
  ShowMaxFamiliars,
  SpeedUpFadeIn,

  // Gameplay
  // TODO

  // Removals
  // TODO

  // Cutscenes
  FastTeleport,

  // Bug Fixes
  BatteryBumFix,

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
