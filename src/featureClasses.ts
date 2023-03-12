// We must put the feature classes in a separate file as a workaround for Lua having a limit of 200
// local variables.

export { SeededGBBug } from "./classes/features/mandatory/bugfix/SeededGBBug";
export { SeededGlitterBombs } from "./classes/features/mandatory/bugfix/SeededGlitterBombs";
export { SeededTeleports } from "./classes/features/mandatory/bugfix/SeededTeleports";
export { NerfCardReading } from "./classes/features/mandatory/gameplay/NerfCardReading";
export { DebugItem } from "./classes/features/mandatory/items/DebugItem";
export { Magic8BallSeeded } from "./classes/features/mandatory/items/Magic8BallSeeded";
export { NLuck } from "./classes/features/mandatory/items/NLuck";
export { Sawblade } from "./classes/features/mandatory/items/Sawblade";
export { SolCustom } from "./classes/features/mandatory/items/SolCustom";
export { CheckErrors } from "./classes/features/mandatory/misc/CheckErrors";
export { DisableMultiplayer } from "./classes/features/mandatory/misc/DisableMultiplayer";
export { DoubleAngelNerf } from "./classes/features/mandatory/misc/DoubleAngelNerf";
export { DrawControls } from "./classes/features/mandatory/misc/DrawControls";
export { InvisibleEntities } from "./classes/features/mandatory/misc/InvisibleEntities";
export { LogConsoleCommands } from "./classes/features/mandatory/misc/LogConsoleCommands";
export { ModConfigNotify } from "./classes/features/mandatory/misc/ModConfigNotify";
export { PreserveCheckpoint } from "./classes/features/mandatory/misc/PreserveCheckpoint";
export { PreserveCollectibles } from "./classes/features/mandatory/misc/PreserveCollectibles";
export { RacingPlusIcon } from "./classes/features/mandatory/misc/RacingPlusIcon";
export { RestartOnNextFrame } from "./classes/features/mandatory/misc/RestartOnNextFrame";
export { SeededDeath } from "./classes/features/mandatory/misc/SeededDeath";
export { TempMoreOptions } from "./classes/features/mandatory/misc/TempMoreOptions";
export { TimeConsoleUsed } from "./classes/features/mandatory/misc/TimeConsoleUsed";
export { TopLeftText } from "./classes/features/mandatory/misc/TopLeftText";
export { Trophy } from "./classes/features/mandatory/misc/Trophy";
export { DrawVersion } from "./classes/features/mandatory/other/DrawVersion";
export { ForceFadedConsoleDisplay } from "./classes/features/mandatory/other/ForceFadedConsoleDisplay";
export { CenterStart } from "./classes/features/mandatory/quality/CenterStart";
export { RemoveBannedPillEffects } from "./classes/features/mandatory/removals/RemoveBannedPillEffects";
export { RemoveGlitchedItems } from "./classes/features/mandatory/removals/RemoveGlitchedItems";
export { RemoveGloballyBannedItems } from "./classes/features/mandatory/removals/RemoveGloballyBannedItems";
export { ConsistentAngels } from "./classes/features/optional/bosses/ConsistentAngels";
export { FadeBosses } from "./classes/features/optional/bosses/FadeBosses";
export { FastAngels } from "./classes/features/optional/bosses/FastAngels";
export { FastBigHorn } from "./classes/features/optional/bosses/FastBigHorn";
export { FastBlastocyst } from "./classes/features/optional/bosses/FastBlastocyst";
export { FastBossRush } from "./classes/features/optional/bosses/FastBossRush";
export { FastColostomia } from "./classes/features/optional/bosses/FastColostomia";
export { FastDogma } from "./classes/features/optional/bosses/FastDogma";
export { FastHaunt } from "./classes/features/optional/bosses/FastHaunt";
export { FastHeretic } from "./classes/features/optional/bosses/FastHeretic";
export { FastHush } from "./classes/features/optional/bosses/FastHush";
export { FastKrampus } from "./classes/features/optional/bosses/FastKrampus";
export { FastMegaSatan } from "./classes/features/optional/bosses/FastMegaSatan";
export { FastMom } from "./classes/features/optional/bosses/FastMom";
export { FastPin } from "./classes/features/optional/bosses/FastPin";
export { FastSatan } from "./classes/features/optional/bosses/FastSatan";
export { OpenHushDoor } from "./classes/features/optional/bosses/OpenHushDoor";
export { PreventDeathSlow } from "./classes/features/optional/bosses/PreventDeathSlow";
export { PreventEndBeast } from "./classes/features/optional/bosses/PreventEndBeast";
export { PreventEndMegaSatan } from "./classes/features/optional/bosses/PreventEndMegaSatan";
export { PreventVictoryLapPopup } from "./classes/features/optional/bosses/PreventVictoryLapPopup";
export { RemoveArmor } from "./classes/features/optional/bosses/RemoveArmor";
export { RemoveLambBody } from "./classes/features/optional/bosses/RemoveLambBody";
export { Battery9VoltSynergy } from "./classes/features/optional/bugfix/Battery9VoltSynergy";
export { BatteryBumFix } from "./classes/features/optional/bugfix/BatteryBumFix";
export { GoatHeadInBossRoom } from "./classes/features/optional/bugfix/GoatHeadInBossRoom";
export { PreventUltraSecretRoomSoftlock } from "./classes/features/optional/bugfix/PreventUltraSecretRoomSoftlock";
export { RemoveInvalidPitfalls } from "./classes/features/optional/bugfix/RemoveInvalidPitfalls";
export { TaintedIsaacCollectibleDelay } from "./classes/features/optional/bugfix/TaintedIsaacCollectibleDelay";
export { TeleportInvalidEntrance } from "./classes/features/optional/bugfix/TeleportInvalidEntrance";
export { JudasAddBomb } from "./classes/features/optional/characters/JudasAddBomb";
export { LostUseHolyCard } from "./classes/features/optional/characters/LostUseHolyCard";
export { SamsonDropHeart } from "./classes/features/optional/characters/SamsonDropHeart";
export { ShowEdenStartingItems } from "./classes/features/optional/characters/ShowEdenStartingItems";
export { TaintedKeeperExtraMoney } from "./classes/features/optional/characters/TaintedKeeperExtraMoney";
export { FastTeleport } from "./classes/features/optional/cutscenes/FastTeleport";
export { AppearHands } from "./classes/features/optional/enemies/AppearHands";
export { ClearerShadowAttacks } from "./classes/features/optional/enemies/ClearerShadowAttacks";
export { DummyDPS } from "./classes/features/optional/enemies/DummyDPS";
export { FadeFriendlyEnemies } from "./classes/features/optional/enemies/FadeFriendlyEnemies";
export { FastDusts } from "./classes/features/optional/enemies/FastDusts";
export { FastGhosts } from "./classes/features/optional/enemies/FastGhosts";
export { FastHands } from "./classes/features/optional/enemies/FastHands";
export { FastNeedles } from "./classes/features/optional/enemies/FastNeedles";
export { FastPolties } from "./classes/features/optional/enemies/FastPolties";
export { GlobinSoftlock } from "./classes/features/optional/enemies/GlobinSoftlock";
export { RemoveStrayPitfalls } from "./classes/features/optional/enemies/RemoveStrayPitfalls";
export { RemoveTreasureRoomEnemies } from "./classes/features/optional/enemies/RemoveTreasureRoomEnemies";
export { ReplaceCodWorms } from "./classes/features/optional/enemies/ReplaceCodWorms";
export { VulnerableGhosts } from "./classes/features/optional/enemies/VulnerableGhosts";
export { ConsistentTrollBombs } from "./classes/features/optional/gameplay/ConsistentTrollBombs";
export { ExtraStartingItems } from "./classes/features/optional/gameplay/ExtraStartingItems";
export { PillsCancelAnimations } from "./classes/features/optional/gameplay/PillsCancelAnimations";
export { HolidayHats } from "./classes/features/optional/graphics/HolidayHats";
export { HUDOffsetFix } from "./classes/features/optional/graphics/HUDOffsetFix";
export { PaschalCandle } from "./classes/features/optional/graphics/PaschalCandle";
export { ScaredHeart } from "./classes/features/optional/graphics/ScaredHeart";
export { StickyNickel } from "./classes/features/optional/graphics/StickyNickel";
export { UniqueCardBacks } from "./classes/features/optional/graphics/UniqueCardBacks";
export { Autofire } from "./classes/features/optional/hotkeys/Autofire";
export { FastDrop } from "./classes/features/optional/hotkeys/FastDrop";
export { SchoolbagSwitch } from "./classes/features/optional/hotkeys/SchoolbagSwitch";
export { BetterDevilAngelRooms } from "./classes/features/optional/major/BetterDevilAngelRooms";
export { DisableCurses } from "./classes/features/optional/major/DisableCurses";
export { FastClear } from "./classes/features/optional/major/FastClear";
export { FastReset } from "./classes/features/optional/major/FastReset";
export { FastTravel } from "./classes/features/optional/major/FastTravel";
export { FreeDevilItem } from "./classes/features/optional/major/FreeDevilItem";
export { StartWithD6 } from "./classes/features/optional/major/StartWithD6";
export { Chat } from "./classes/features/optional/other/Chat";
export { Shadows } from "./classes/features/optional/other/Shadows";
export { AutomaticItemInsertion } from "./classes/features/optional/quality/AutomaticItemInsertion";
export { AzazelsRageChargeBar } from "./classes/features/optional/quality/AzazelsRageChargeBar";
export { BloodyLustChargeBar } from "./classes/features/optional/quality/BloodyLustChargeBar";
export { ChangeCreepColor } from "./classes/features/optional/quality/ChangeCreepColor";
export { ChargePocketItemFirst } from "./classes/features/optional/quality/ChargePocketItemFirst";
export { CombinedDualityDoors } from "./classes/features/optional/quality/CombinedDualityDoors";
export { DeleteVoidPortals } from "./classes/features/optional/quality/DeleteVoidPortals";
export { DisplayExpansionPack } from "./classes/features/optional/quality/DisplayExpansionPack";
export { EasyFirstFloorItems } from "./classes/features/optional/quality/EasyFirstFloorItems";
export { FadeDevilStatue } from "./classes/features/optional/quality/FadeDevilStatue";
export { FadeHungryTears } from "./classes/features/optional/quality/FadeHungryTears";
export { FadeVasculitisTears } from "./classes/features/optional/quality/FadeVasculitisTears";
export { FastLuna } from "./classes/features/optional/quality/FastLuna";
export { FastVanishingTwin } from "./classes/features/optional/quality/FastVanishingTwin";
export { FlipCustom } from "./classes/features/optional/quality/FlipCustom";
export { LeadPencilChargeBar } from "./classes/features/optional/quality/LeadPencilChargeBar";
export { RemoveFortuneCookieBanners } from "./classes/features/optional/quality/RemoveFortuneCookieBanners";
export { RemovePerfectionOnEndFloors } from "./classes/features/optional/quality/RemovePerfectionOnEndFloors";
export { RemovePerfectionVelocity } from "./classes/features/optional/quality/RemovePerfectionVelocity";
export { RunTimer } from "./classes/features/optional/quality/RunTimer";
export { ShowDreamCatcher } from "./classes/features/optional/quality/ShowDreamCatcher";
export { ShowMaxFamiliars } from "./classes/features/optional/quality/ShowMaxFamiliars";
export { ShowNumSacrifices } from "./classes/features/optional/quality/ShowNumSacrifices";
export { ShowPills } from "./classes/features/optional/quality/ShowPills";
export { SpeedUpFadeIn } from "./classes/features/optional/quality/SpeedUpFadeIn";
export { SubvertTeleport } from "./classes/features/optional/quality/SubvertTeleport";
export { TaintedSamsonChargeBar } from "./classes/features/optional/quality/TaintedSamsonChargeBar";
export { SilenceMomDad } from "./classes/features/optional/sounds/SilenceMomDad";
export { PreventConsole } from "./classes/features/race/PreventConsole";
export { AchievementItems } from "./classes/features/speedrun/AchievementItems";
export { ChangeCharOrder } from "./classes/features/speedrun/ChangeCharOrder";
export { CharacterProgress } from "./classes/features/speedrun/CharacterProgress";
export { DrawCharacterProgress } from "./classes/features/speedrun/DrawCharacterProgress";
export { EmulateVanillaWomb2IAmError } from "./classes/features/speedrun/EmulateVanillaWomb2IAmError";
export { PreventDevilRoomResets } from "./classes/features/speedrun/PreventDevilRoomResets";
export { RandomCharacterOrder } from "./classes/features/speedrun/RandomCharacterOrder";
export { Season1 } from "./classes/features/speedrun/Season1";
export { Season2 } from "./classes/features/speedrun/Season2";
export { Season3 } from "./classes/features/speedrun/Season3";
export { Season4 } from "./classes/features/speedrun/Season4";
export { SpawnRepentanceDoor } from "./classes/features/speedrun/SpawnRepentanceDoor";
export { SpeedrunTimer } from "./classes/features/speedrun/SpeedrunTimer";
