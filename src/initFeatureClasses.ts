/* eslint-disable isaacscript/complete-sentences-line-comments */

import type { ModFeature } from "isaacscript-common";
import * as fc from "./featureClasses";

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
 * - Search for: "postPEffectUpdate("
 * - Make SolCustom part of FastClear directory.
 * - Alphabetize "Removals" section + Config.ts.
 * - Check refactor `DreamCatcherWarpState`.
 * - Check refactor fast-travel related enums & interfaces.
 * - Check refactor `ActiveCollectibleDescription` after seeded death.
 */
const FEATURE_CLASSES = [
  // Mandatory (TODO - sort in directories?)
  fc.BanFirstFloorRoomType,
  fc.CheckErrors,
  fc.DisableMultiplayer,
  fc.DoubleAngelNerf,
  fc.Fireworks,
  fc.IBSCheckpoint,
  fc.InvisibleEntities,
  fc.LogConsoleCommands,
  fc.ModConfigNotify,
  fc.PlanetariumFix,
  fc.PreserveCheckpoint,
  fc.PreserveCollectibles,
  fc.PreventSacrificeRoomTeleport,
  fc.RacingPlusIcon,
  fc.ReplacePhotos,
  fc.RestartOnNextFrame,
  fc.SeededDeath,
  fc.SeededDrops,
  fc.SeededFloors,
  fc.StreakText,
  fc.TempMoreOptions,
  fc.TimeConsoleUsed,
  fc.TopLeftText,
  fc.Trophy,

  // Items (mandatory)
  fc.DebugItem,
  fc.Magic8BallSeeded,
  fc.NLuck,
  fc.Sawblade,
  fc.SolCustom,

  // Race
  fc.EndOfRaceButtons,
  fc.PreventConsole,
  fc.RaceFormatSetup,
  fc.RaceHushGoal,

  // Speedrun (utils)
  fc.AchievementItems,
  fc.ChangeCharOrder,
  fc.CharacterProgress,
  fc.DrawCharacterProgress,
  fc.EmulateVanillaWomb2IAmError,
  fc.PreventDevilRoomResets,
  fc.RandomCharacterOrder, // This must be before the seasons.
  fc.RandomStartingBuild, // This must be before the seasons and after the character order.
  fc.SpawnRepentanceDoor,
  fc.SpeedrunTimer,

  // Speedrun (main)
  fc.Season1,
  fc.Season2,
  fc.Season3,
  fc.Season4,
  fc.Season5,

  // Major (not alphabetized)
  // - fc.ClientCommunication,
  fc.StartWithD6,
  fc.DisableCurses,
  fc.BetterDevilAngelRooms,
  fc.FreeDevilItem,
  fc.FastReset,
  fc.FastClear,
  fc.FastTravel,

  // Hotkeys
  fc.Autofire,
  fc.FastDrop,
  // fc.Roll,
  fc.SchoolbagSwitch,

  // Characters
  fc.JudasAddBomb, // 3
  fc.SamsonDropHeart, // 6
  fc.ShowEdenStartingItems, // 9, 30
  fc.LostUseHolyCard, // 31
  fc.TaintedKeeperExtraMoney, // 33

  // Bosses
  fc.FadeBosses,
  fc.FastBossRush,
  fc.RemoveArmor,
  fc.FastMom, // 45, 78
  fc.FastPin, // 62
  fc.PreventDeathSlow, // 66
  fc.FastBlastocyst, // 74
  fc.FastKrampus, // 81
  fc.FastSatan, // 84
  fc.FastHaunt, // 260
  fc.FastAngels, // 271, 272
  fc.ConsistentAngels, // 271, 272
  fc.RemoveLambBody, // 273
  fc.PreventVictoryLapPopup, // 273
  fc.FastMegaSatan, // 274, 275
  fc.PreventEndMegaSatan, // 275
  fc.OpenHushDoor, // 407
  fc.FastHush, // 407
  fc.FastBigHorn, // 411
  fc.FastHeretic, // 905
  fc.FastColostomia, // 917
  fc.FastDogma, // 950
  fc.PreventEndBeast, // 951

  // Enemies
  fc.ClearerShadowAttacks,
  fc.FadeFriendlyEnemies,
  fc.RemoveTreasureRoomEnemies,
  fc.GlobinSoftlock, // 24
  fc.AppearHands, // 213, 287
  fc.FastHands, // 213, 287
  fc.VulnerableGhosts, // 219, 260, 285
  fc.FastGhosts, // 219, 285
  fc.ReplaceCodWorms, // 221
  fc.PitfallImmobility, // 291
  fc.RemoveStrayPitfalls, // 291
  fc.FastPolties, // 816
  fc.FastNeedles, // 881
  fc.FastDusts, // 882
  fc.DummyDPS, // 964

  // Quality of Life
  fc.AutomaticItemInsertion,
  fc.ChangeCreepColor,
  fc.ChargePocketItemFirst,
  fc.RemoveVoidPortals,
  fc.EasyFirstFloorItems,
  fc.FadeDevilStatue,
  fc.RunTimer,
  fc.ShowMaxFamiliars,
  fc.ShowNumSacrifices,
  fc.ShowPillsOnHUD,
  fc.SpeedUpFadeIn,
  fc.SubvertTeleport,
  fc.TaintedSamsonChargeBar, // 27 (charge bar)
  fc.BloodyLustChargeBar, // 157 (charge bar)
  fc.LeadPencilChargeBar, // 444 (charge bar)
  fc.AzazelsRageChargeBar, // 669 (charge bar)
  fc.FastForgetMeNow, // 127 (collectible)
  fc.CombinedDualityDoors, // 498 (collectible)
  fc.FadeHungryTears, // 532 (collectible)
  fc.RemoveFortuneCookieBanners, // 557 (collectible)
  fc.ShowDreamCatcher, // 566 (collectible)
  fc.FastLuna, // 589 (collectible)
  fc.FadeVasculitisTears, // 657 (collectible)
  fc.FastVanishingTwin, // 697 (collectible)
  fc.FlipCustom, // 711 (collectible)
  fc.RemovePerfectionVelocity, // 145 (trinket)
  fc.RemovePerfectionOnEndFloors, // 145 (trinket)
  fc.DisplayExpansionPack, // 181 (trinket)

  // Quality of Life (mandatory)
  fc.CenterStart,

  // Gameplay
  fc.ConsistentTrollBombs,
  fc.ExtraStartingItems,
  fc.PillsCancelAnimations,

  // Gameplay (mandatory)
  fc.NerfCardReading,

  // Removals (mandatory) (not alphabetized)
  fc.RemoveGloballyBannedItems,
  fc.RemoveGlitchedCollectibles,
  fc.RemoveBannedPillEffects,

  // Cutscenes
  fc.FastTeleport,

  // Bug Fixes
  fc.Battery9VoltSynergy, // 63+116
  fc.WhoreOfBabylonFix, // 122
  fc.GoatHeadInBossRoom, // 215
  fc.BatteryBumFix,
  fc.PreventUltraSecretRoomSoftlock,
  fc.RemoveInvalidPitfalls,
  fc.TaintedIsaacCollectibleDelay,
  fc.TeleportInvalidEntrance,

  // Bug Fixes (mandatory)
  fc.SeededTeleports, // 44
  fc.SeededGBBug, // 405
  fc.SeededGlitterBombs, // 432

  // Graphics
  fc.DrawControls,
  fc.HolidayHats,
  fc.HUDOffsetFix,
  fc.PaschalCandle, // 3.221
  fc.ScaredHeart, // 5.10.9
  fc.StickyNickel, // 5.20.6
  fc.UniqueCardBacks, // 5.300

  // Sounds
  fc.SilenceMomDad,

  // Other
  fc.Chat,
  fc.Shadows,

  // Other (mandatory)
  fc.DrawVersion,
  fc.ForceFadedConsoleDisplay,
] as const satisfies ReadonlyArray<typeof ModFeature>;

export function initFeatureClasses(): void {
  for (const constructor of FEATURE_CLASSES) {
    const instantiatedClass = new constructor();
    instantiatedClass.init();
  }
}
