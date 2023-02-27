/* eslint-disable isaacscript/complete-sentences-line-comments */

import { ModFeature } from "isaacscript-common";
import { DisableCurses } from "./classes/features/major/DisableCurses";
import { FreeDevilItem } from "./classes/features/major/FreeDevilItem";
import { StartWithD6 } from "./classes/features/major/StartWithD6";
import { NerfCardReading } from "./classes/features/mandatory/gameplay/NerfCardReading";
import { DebugItem } from "./classes/features/mandatory/items/DebugItem";
import { Magic8BallSeeded } from "./classes/features/mandatory/items/Magic8BallSeeded";
import { NLuck } from "./classes/features/mandatory/items/NLuck";
import { Sawblade } from "./classes/features/mandatory/items/Sawblade";
import { SolCustom } from "./classes/features/mandatory/items/SolCustom";
import { DrawVersion } from "./classes/features/mandatory/other/DrawVersion";
import { ForceFadedConsoleDisplay } from "./classes/features/mandatory/other/ForceFadedConsoleDisplay";
import { CenterStart } from "./classes/features/mandatory/quality/CenterStart";
import { CheckErrors } from "./classes/features/mandatory/unsorted/CheckErrors";
import { DisableMultiplayer } from "./classes/features/mandatory/unsorted/DisableMultiplayer";
import { DoubleAngelNerf } from "./classes/features/mandatory/unsorted/DoubleAngelNerf";
import { DrawControls } from "./classes/features/mandatory/unsorted/DrawControls";
import { LogConsoleCommands } from "./classes/features/mandatory/unsorted/LogConsoleCommands";
import { PreserveCheckpoint } from "./classes/features/mandatory/unsorted/PreserveCheckpoint";
import { RacingPlusIcon } from "./classes/features/mandatory/unsorted/RacingPlusIcon";
import { RemoveBannedPillEffects } from "./classes/features/mandatory/unsorted/RemoveBannedPillEffects";
import { RemoveGlitchedItems } from "./classes/features/mandatory/unsorted/RemoveGlitchedItems";
import { RemoveGloballyBannedItems } from "./classes/features/mandatory/unsorted/RemoveGloballyBannedItems";
import { RestartOnNextFrame } from "./classes/features/mandatory/unsorted/RestartOnNextFrame";
import { TimeConsoleUsed } from "./classes/features/mandatory/unsorted/TimeConsoleUsed";
import { Trophy } from "./classes/features/mandatory/unsorted/Trophy";
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
import { Battery9VoltSynergy } from "./classes/features/optional/bugfix/Battery9VoltSynergy";
import { BatteryBumFix } from "./classes/features/optional/bugfix/BatteryBumFix";
import { PreventUltraSecretRoomSoftlock } from "./classes/features/optional/bugfix/PreventUltraSecretRoomSoftlock";
import { RemoveInvalidPitfalls } from "./classes/features/optional/bugfix/RemoveInvalidPitfalls";
import { TaintedIsaacCollectibleDelay } from "./classes/features/optional/bugfix/TaintedIsaacCollectibleDelay";
import { TeleportInvalidEntrance } from "./classes/features/optional/bugfix/TeleportInvalidEntrance";
import { JudasAddBomb } from "./classes/features/optional/characters/JudasAddBomb";
import { LostUseHolyCard } from "./classes/features/optional/characters/LostUseHolyCard";
import { SamsonDropHeart } from "./classes/features/optional/characters/SamsonDropHeart";
import { ShowEdenStartingItems } from "./classes/features/optional/characters/ShowEdenStartingItems";
import { TaintedKeeperExtraMoney } from "./classes/features/optional/characters/TaintedKeeperExtraMoney";
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
import { ConsistentTrollBombs } from "./classes/features/optional/gameplay/ConsistentTrollBombs";
import { ExtraStartingItems } from "./classes/features/optional/gameplay/ExtraStartingItems";
import { PillsCancelAnimations } from "./classes/features/optional/gameplay/PillsCancelAnimations";
import { HolidayHats } from "./classes/features/optional/graphics/HolidayHats";
import { HUDOffsetFix } from "./classes/features/optional/graphics/HUDOffsetFix";
import { PaschalCandle } from "./classes/features/optional/graphics/PaschalCandle";
import { ScaredHeart } from "./classes/features/optional/graphics/ScaredHeart";
import { StickyNickel } from "./classes/features/optional/graphics/StickyNickel";
import { UniqueCardBacks } from "./classes/features/optional/graphics/UniqueCardBacks";
import { FastReset } from "./classes/features/optional/major/FastReset";
import { AzazelsRageChargeBar } from "./classes/features/optional/quality/AzazelsRageChargeBar";
import { FastLuna } from "./classes/features/optional/quality/FastLuna";
import { FlipCustom } from "./classes/features/optional/quality/FlipCustom";
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
 * - Search for: "import *"
 * - Sort files in "mandatory" directory into subdirectories and ensure that everything is
 *   documented in "changes.md".
 * - Audit "changes.md" to see that it conforms to the ordering in this file.
 * - Search for: "postNewLevel("
 * - Search for: "postNewRoom("
 * - Search for: "postGameStarted("
 * - Search for: "postGameStartedReordered(" (should have false suffix)
 * - Make SolCustom part of FastClear directory.
 * - Alphabetize "Removals" section + Config.ts.
 */
const FEATURE_CLASSES = [
  // Mandatory
  CheckErrors,
  DisableMultiplayer,
  DoubleAngelNerf,
  LogConsoleCommands,
  PreserveCheckpoint,
  RacingPlusIcon,
  RemoveBannedPillEffects,
  RemoveGlitchedItems,
  RemoveGloballyBannedItems,
  RestartOnNextFrame,
  TimeConsoleUsed,
  Trophy,

  // Items (mandatory)
  DebugItem,
  Magic8BallSeeded,
  NLuck,
  Sawblade,
  SolCustom,

  // Speedrun
  RandomCharacterOrder, // This must be before the seasons.
  Season1,
  Season2,
  Season3,
  Season4,

  // Major (not alphabetized)
  // - ClientCommunication,
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
  JudasAddBomb, // 3
  SamsonDropHeart, // 6
  ShowEdenStartingItems, // 9, 30
  LostUseHolyCard, // 31
  TaintedKeeperExtraMoney, // 33

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
  // - AutomaticItemInsertion,
  // - ChangeCreepColor,
  // - ChargePocketItemFirst,
  // - DeleteVoidPortals,
  // - EasyFirstFloorItems,
  // - FadeDevilStatue,
  RunTimer,
  ShowMaxFamiliars,
  // - ShowNumSacrifices,
  // - ShowPills,
  SpeedUpFadeIn,
  // - SubvertTeleport,
  // - TaintedSamsonChargeBar, // 27 (charge bar)
  // - BloodyLustChargeBar, // 157 (charge bar)
  // - LeadPencilChargeBar, // 444 (charge bar)
  AzazelsRageChargeBar, // 669 (charge bar)
  // - CombinedDualityDoors, // 498 (collectible)
  // - RemoveFortuneCookieBanners, // 557 (collectible)
  // - ShowDreamCatcherItem, // 566 (collectible)
  FastLuna, // 589 (collectible)
  // - FadeVasculitisTears, // 657 (collectible)
  // - FastVanishingTwin, // 697 (collectible)
  FlipCustom, // 711 (collectible)
  // - RemovePerfectionVelocity, // 145 (trinket)
  RemovePerfectionOnEndFloors, // 145 (trinket)
  // - DisplayExpansionPack, // 181 (trinket)

  // Quality of Life (mandatory)
  CenterStart,

  // Gameplay
  ConsistentTrollBombs,
  ExtraStartingItems,
  PillsCancelAnimations,

  // Gameplay (mandatory)
  NerfCardReading,

  // Removals (mandatory) (not alphabetized)
  // - RemoveGloballyBannedItems,
  // - RemoveGlitchedItems,
  // - RemoveBannedPillEffects,

  // Cutscenes
  FastTeleport,

  // Bug Fixes
  Battery9VoltSynergy,
  BatteryBumFix,
  PreventUltraSecretRoomSoftlock,
  RemoveInvalidPitfalls,
  TaintedIsaacCollectibleDelay,
  TeleportInvalidEntrance,

  // Bug Fixes (mandatory)
  // - SeededTeleports, // 44
  // - SeededGBBug, // 405
  // - SeededGlitterBombs, // 432

  // Graphics
  DrawControls,
  HolidayHats,
  HUDOffsetFix,
  PaschalCandle, // 3.221
  ScaredHeart, // 5.10.9
  StickyNickel, // 5.20.6
  UniqueCardBacks, // 5.300

  // Sounds
  SilenceMomDad,

  // Other
  // - CharacterTimer,
  // - Chat,
  // - Shadows,

  // Other (mandatory)
  DrawVersion,
  ForceFadedConsoleDisplay,
] as const satisfies ReadonlyArray<typeof ModFeature>;

export function initFeatureClasses(): void {
  for (const constructor of FEATURE_CLASSES) {
    const instantiatedClass = new constructor();
    instantiatedClass.init();
  }
}
