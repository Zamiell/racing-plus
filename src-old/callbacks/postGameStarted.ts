import { ChallengeCustom } from "../challenges/enums";
import * as speedrunPostGameStarted from "../challenges/postGameStarted";
import { SAVE_FILE_ITEMS, SAVE_FILE_SEED, Vector.Zero } from "../constants";
import * as fastClear from "../features/fastClear";
import { FastTravelState } from "../features/fastTravel/constants";
import g from "../globals";
import * as schoolbag from "../items/schoolbag";
import * as soulJar from "../items/soulJar";
import * as misc from "../misc";
import * as sprites from "../sprites";
import * as timer from "../timer";
import {
  CollectibleTypeCustom,
  PlayerTypeCustom,
  SaveFileState,
} from "../types/enums";
import GlobalsRun from "../types/GlobalsRun";

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function main(isContinued: boolean): void {
  // Local variables
  const roomIndex = misc.getRoomIndex();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const centerPos = g.r.GetCenterPos();
  const startSeed = g.seeds.GetStartSeed();
  const startSeedString = g.seeds.GetStartSeedString();
  const customRun = g.seeds.IsCustomRun();
  const challenge = Isaac.GetChallenge();
  const isaacFrameCount = Isaac.GetFrameCount();

  Isaac.DebugString(
    `MC_POST_GAME_STARTED - Seed: ${startSeedString} - IsaacFrame: ${isaacFrameCount}`,
  );

  // Cache the total number of collectibles
  // (this has to be done after all of the mods are finished loading)
  if (g.numTotalCollectibles === 0) {
    g.numTotalCollectibles = misc.getNumTotalCollectibles();
  }

  if (isContinued) {
    // Unlike vanilla, Racing+ does not support continuing runs that were played prior to opening
    // the game (since it would need to write all state variables to the "save#.dat" file)
    // Detect for this and show an error message if so
    if (g.saveFile.state === SaveFileState.NOT_CHECKED) {
      g.errors.resumedOldRun = true;
      return;
    }

    // Fix the bug where the mod won't know what floor they are on if they exit the game and
    // continue
    g.run.level.stage = stage;
    g.run.level.stageType = stageType;
    Isaac.DebugString(
      `New floor: ${g.run.level.stage}-${g.run.level.stageType} (from S+Q)`,
    );

    // Fix the bug where the Gaping Maws will not respawn in the "Race Room"
    if (
      roomIndex === GridRooms.ROOM_DEBUG_IDX &&
      (g.race.status === "open" || g.race.status === "starting")
    ) {
      // Spawn two Gaping Maws (235.0)
      Isaac.Spawn(
        EntityType.ENTITY_GAPING_MAW,
        0,
        0,
        misc.gridToPos(5, 5),
        Vector.Zero,
        null,
      );
      Isaac.Spawn(
        EntityType.ENTITY_GAPING_MAW,
        0,
        0,
        misc.gridToPos(7, 5),
        Vector.Zero,
        null,
      );
    }

    // Cancel fast-travel if we save & quit in the middle of the jumping animation
    if (g.run.trapdoor.state === FastTravelState.PLAYER_ANIMATION) {
      g.run.trapdoor.state = FastTravelState.DISABLED;
    }

    // We don't need to do the long series of checks if they quit and continued in the middle of a
    // run
    return;
  }
  g.errors.resumedOldRun = false;

  // Make sure that the MinimapAPI is enabled (we may have disabled it in a previous run)
  if (MinimapAPI !== undefined) {
    MinimapAPI.Config.Disable = false;
  }

  // Log the run beginning
  Isaac.DebugString(`A new run has begun on seed: ${startSeedString}`);

  // Initialize run-based variables
  g.run = new GlobalsRun();

  // Reset some RNG counters for familiars
  fastClear.postGameStarted();

  // Reset some race variables that we keep track of per run
  // (loadOnNextFrame does not need to be reset because it should be already set to false)
  // (difficulty and challenge are set in the "racePostGameStarted.main()" function)
  // (character is set in the "characterInit()" function)
  // (started and startedTime are handled independently of runs)
  g.raceVars.finished = false;
  g.raceVars.finishedTime = 0;
  g.raceVars.fireworks = 0;
  g.raceVars.victoryLaps = 0;
  if (RacingPlusData !== null) {
    let shadowEnabled = RacingPlusData.Get("shadowEnabled") as
      | boolean
      | undefined;
    if (shadowEnabled === undefined) {
      shadowEnabled = false;
      RacingPlusData.Set("shadowEnabled", false);
    }
    g.raceVars.shadowEnabled = shadowEnabled;
  }

  // Reset some RNG counters to the start RNG of the seed
  // (future drops will be based on the RNG from this initial random value)
  g.run.playerGeneratedPedestalSeeds = [startSeed];
  g.RNGCounter.bookOfSin = startSeed;
  g.RNGCounter.deadSeaScrolls = startSeed;
  g.RNGCounter.guppysHead = startSeed;
  g.RNGCounter.guppysCollar = startSeed;
  g.RNGCounter.butterBean = startSeed;
  g.RNGCounter.devilRoomKrampus = startSeed;
  g.RNGCounter.devilRoomChoice = startSeed;
  g.RNGCounter.devilRoomItem = startSeed;
  g.RNGCounter.devilRoomBeggar = startSeed;
  g.RNGCounter.angelRoomChoice = startSeed;
  g.RNGCounter.angelRoomItem = startSeed;
  g.RNGCounter.angelRoomMisc = startSeed;
  // Skip resetting Teleport, Undefined, and Telepills, because those are seeded per floor

  // Reset all graphics
  // (this is needed to prevent a bug where the "Race Start" room graphics
  // will flash on the screen before the room is actually entered)
  // (it also prevents the bug where if you reset during the stage animation,
  // it will permanently stay on the screen)
  sprites.sprites.clear();
  schoolbag.resetSprites();
  soulJar.resetSprites();
  g.speedrun.sprites = [];
  timer.spriteSetMap.clear();

  // We may have had the Curse of the Unknown seed enabled in a previous run,
  // so ensure that it is removed
  g.seeds.RemoveSeedEffect(SeedEffect.SEED_PERMANENT_CURSE_UNKNOWN);

  // We need to disable achievements so that the R+ sprite shows above the stats on the left side of
  // the screen
  // We want the R+ sprite to display on all runs so that the "1st" sprite has somewhere to go
  // The easiest way to disable achievements without affecting gameplay is to enable the easter egg
  // that disables Curse of Darkness
  // (this has no effect since all curses are removed in the "PostCurseEval" callback anyway)
  g.seeds.AddSeedEffect(SeedEffect.SEED_PREVENT_CURSE_DARKNESS);

  if (
    checkCorruptMod() ||
    checkNotFullyUnlockedSave() ||
    checkInvalidItemsXML()
  ) {
    return;
  }

  // Racing+ replaces some vanilla items; remove them from all the pools
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_DADS_LOST_COIN);
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG);

  // Racing+ removes the Karma trinket from the game
  g.itemPool.RemoveTrinket(TrinketType.TRINKET_KARMA);

  if (challenge === Challenge.CHALLENGE_NULL && customRun) {
    // Racing+ also removes certain trinkets that mess up floor generation when playing on a set
    // seed
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_SILVER_DOLLAR); // 110
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_BLOODY_CROWN); // 111

    // Racing+ also removes certain items and trinkets that change room drop calculation when
    // playing on a set seed
    g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_LUCKY_FOOT); // 46
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_DAEMONS_TAIL); // 22
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_CHILDS_HEART); // 34
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_RUSTED_KEY); // 36
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_MATCH_STICK); // 41
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_LUCKY_TOE); // 42
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_SAFETY_CAP); // 44
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_ACE_SPADES); // 45
    g.itemPool.RemoveTrinket(TrinketType.TRINKET_WATCH_BATTERY); // 72
  }

  // By default, the player starts near the bottom door
  // Instead, put the player in the middle of the room
  if (
    g.g.Difficulty === Difficulty.DIFFICULTY_NORMAL ||
    g.g.Difficulty === Difficulty.DIFFICULTY_HARD
  ) {
    // Don't do this in Greed Mode, since if the player starts at the center of the room,
    // they they will immediately touch the trigger button
    g.p.Position = centerPos;
  }

  // Also, put familiars in the middle of the room, if any
  const familiars = Isaac.FindByType(
    EntityType.ENTITY_FAMILIAR,
    -1,
    -1,
    false,
    false,
  );
  for (const familiar of familiars) {
    familiar.Position = centerPos;
  }

  // Give us custom racing items, depending on the character (mostly just the D6)
  if (characterInit()) {
    return;
  }

  // Do more run initialization things specifically pertaining to speedruns
  speedrunPostGameStarted.main();

  // Do more run initialization things specifically pertaining to races
  if (racePostGameStarted.main()) {
    return;
  }

  // Remove the 3 placeholder items if this is not a diversity race
  if (!g.run.diversity && challenge !== ChallengeCustom.R7_SEASON_7) {
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_1,
    );
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_2,
    );
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_DIVERSITY_PLACEHOLDER_3,
    );
  }

  // Make sure that the festive hat shows
  // (this is commented out if it is not currently a holiday)
  // g.p.AddNullCostume(NullItemID.ID_CHRISTMAS)
  // (this corresponds to "n016_Christmas.anm2" in the "costumes2.xml" file)

  // Call PostNewLevel manually (they get naturally called out of order)
  postNewLevel.newLevel();
}

// If Racing+ is turned on from the mod menu and then the user immediately tries to play,
// it won't work properly; some things like boss cutscenes will still be enabled
// In order to fix this, the game needs to be completely restarted
// One way to detect this corrupted state is to get how many frames there are
// in the currently loaded boss cutscene animation file (located at "gfx/ui/boss/versusscreen.anm2")
// Racing+ removes boss cutscenes, so this value should be 0
// This function returns true if the PostGameStarted callback should halt
function checkCorruptMod() {
  const sprite = Sprite();
  sprite.Load("gfx/ui/boss/versusscreen.anm2", true);
  sprite.SetFrame("Scene", 0);
  sprite.SetLastFrame();
  const lastFrame = sprite.GetFrame();
  if (lastFrame !== 0) {
    Isaac.DebugString(
      `Error: Corrupted Racing+ instantiation detected. (The last frame of the "Scene" animation is frame ${lastFrame}.)`,
    );
    g.errors.corrupted = true;
  }

  return g.errors.corrupted;
}

// We can verify that the player is playing on a fully unlocked save by file by
// going to a specific seed on Eden and checking to see if the items are accurate
// This function returns true if the PostGameStarted callback should halt
function checkNotFullyUnlockedSave() {
  // Local variables
  const character = g.p.GetPlayerType();
  const activeItem = g.p.GetActiveItem();
  const startSeedString = g.seeds.GetStartSeedString();
  const customRun = g.seeds.IsCustomRun();
  const challenge = Isaac.GetChallenge();

  // Finished checking
  if (g.saveFile.state === SaveFileState.FINISHED) {
    return false;
  }

  // Not checked
  if (g.saveFile.state === SaveFileState.NOT_CHECKED) {
    // Store what the old run was like
    g.saveFile.old.challenge = challenge;
    g.saveFile.old.character = character;
    if (challenge === 0 && customRun) {
      g.saveFile.old.seededRun = true;
      g.saveFile.old.seed = startSeedString;
    }

    g.saveFile.state = SaveFileState.GOING_TO_EDEN;
  }

  // Going to the set seed with Eden
  if (g.saveFile.state === SaveFileState.GOING_TO_EDEN) {
    let valid = true;
    if (challenge !== Challenge.CHALLENGE_NULL) {
      valid = false;
    }
    if (character !== PlayerType.PLAYER_EDEN) {
      valid = false;
    }
    if (startSeedString !== SAVE_FILE_SEED) {
      valid = false;
    }
    if (!valid) {
      // Doing a "restart" command here does not work for some reason,
      // so mark to restart on the next frame
      g.run.restart = true;
      Isaac.DebugString("Going to Eden for the save file check.");
      return true;
    }

    // We are on the specific Eden seed, so check to see if our items are correct
    // The items will be different depending on whether or we have other mods enabled
    let neededActiveItem: CollectibleType;
    let neededPassiveItem: CollectibleType;
    if (SinglePlayerCoopBabies !== undefined) {
      neededActiveItem = SAVE_FILE_ITEMS.babiesMod.activeItem;
      neededPassiveItem = SAVE_FILE_ITEMS.babiesMod.passiveItem;
    } else if (RacingPlusRebalancedVersion !== undefined) {
      neededActiveItem = SAVE_FILE_ITEMS.racingPlusRebalanced.activeItem;
      neededPassiveItem = SAVE_FILE_ITEMS.racingPlusRebalanced.passiveItem;
    } else {
      neededActiveItem = SAVE_FILE_ITEMS.racingPlus.activeItem;
      neededPassiveItem = SAVE_FILE_ITEMS.racingPlus.passiveItem;
    }

    let text = `Error: On seed "${SAVE_FILE_SEED}", Eden needs `;
    if (activeItem !== neededActiveItem) {
      text += `an active item of ${neededActiveItem} (they have an active item of ${activeItem}).`;
      Isaac.DebugString(text);
    } else if (!g.p.HasCollectible(neededPassiveItem)) {
      text += `a passive item of ${neededPassiveItem}.`;
      Isaac.DebugString(text);
    } else {
      g.saveFile.fullyUnlocked = true;
    }

    g.saveFile.state = SaveFileState.GOING_BACK;
  }

  // Going back to the old challenge/character/seed
  if (g.saveFile.state === SaveFileState.GOING_BACK) {
    let valid = true;
    if (challenge !== g.saveFile.old.challenge) {
      valid = false;
    }
    if (character !== g.saveFile.old.character) {
      valid = false;
    }
    if (customRun !== g.saveFile.old.seededRun) {
      valid = false;
    }
    if (g.saveFile.old.seededRun && startSeedString !== g.saveFile.old.seed) {
      valid = false;
    }
    if (!valid) {
      // Doing a "restart" command here does not work for some reason,
      // so mark to restart on the next frame
      g.run.restart = true;
      Isaac.DebugString(
        "Save file check complete; going back to where we came from.",
      );
      return true;
    }

    g.saveFile.state = SaveFileState.FINISHED;
    Isaac.DebugString("Valid save file detected.");
  }

  return false;
}

// We can verify that the "items.xml" is legit, because some other mods will write over it
function checkInvalidItemsXML() {
  const breakfastItemConfig = g.itemConfig.GetCollectible(
    CollectibleType.COLLECTIBLE_BREAKFAST,
  );
  const breakfastCacheFlags = breakfastItemConfig.CacheFlags;
  if (breakfastCacheFlags !== 8) {
    g.errors.invalidItemsXML = true;
  }

  return g.errors.invalidItemsXML;
}

// This is done when a run is started
function characterInit() {
  // Local variables
  const character = g.p.GetPlayerType();
  const activeItem = g.p.GetActiveItem();
  const activeCharge = g.p.GetActiveCharge();
  const pillColor = g.p.GetPill(0);
  const customRun = g.seeds.IsCustomRun();
  const challenge = Isaac.GetChallenge();

  // Since Eden starts with the Schoolbag in Racing+,
  // Eden will "miss out" on a passive item if they happen to start with the vanilla Schoolbag
  // Reset the game if this is the case
  if (
    character === PlayerType.PLAYER_EDEN &&
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG)
  ) {
    if (challenge === Challenge.CHALLENGE_NULL && customRun) {
      // In the unlikely event that they are playing on a specific seed with Eden,
      // the below code will cause the game to infinitely restart
      // Instead, just take away the vanilla Schoolbag and give them the Sad Onion as a replacement
      // for the passive item
      Isaac.DebugString(
        "Eden has started with the vanilla Schoolbag; removing it.",
      );
      g.p.RemoveCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG);
      misc.removeItemFromItemTracker(CollectibleType.COLLECTIBLE_SCHOOLBAG);
      g.p.AddCollectible(CollectibleType.COLLECTIBLE_SAD_ONION, 0, false);
    } else {
      g.run.restart = true;
      g.speedrun.fastReset = true;
      Isaac.DebugString(
        "Restarting because we started as Eden and got a vanilla Schoolbag.",
      );
      return true;
    }
  }

  // If they started with the Karma trinket, we need to delete it, since it is supposed to be
  // removed from the game
  // (this should be only possible on Eden)
  if (g.p.HasTrinket(TrinketType.TRINKET_KARMA)) {
    g.p.TryRemoveTrinket(TrinketType.TRINKET_KARMA);
  }

  // Give all characters the D6
  g.p.AddCollectible(CollectibleType.COLLECTIBLE_D6, 6, false);
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_D6);
  g.sfx.Stop(SoundEffect.SOUND_BATTERYCHARGE);

  // Do character-specific actions
  switch (character) {
    // 1
    case PlayerType.PLAYER_MAGDALENA: {
      // Identify the pill so that we will know what it is later on in the run
      // Racing+ Rebalanced has custom pill effects
      if (RacingPlusRebalancedVersion === null) {
        g.itemPool.IdentifyPill(pillColor);
        usePill.usedNewPill(pillColor, PillEffect.PILLEFFECT_SPEED_UP);
      }

      // Delete the starting pill
      g.p.SetPill(0, PillColor.PILL_NULL);

      // Update the speed cache so that we get the emulated speed bonus
      g.p.AddCacheFlags(CacheFlag.CACHE_SPEED);
      g.p.EvaluateItems();

      break;
    }

    // 2
    case PlayerType.PLAYER_CAIN: {
      // Make the D6 appear first on the item tracker
      Isaac.DebugString("Removing collectible 46 (Lucky Foot)");
      Isaac.DebugString("Adding collectible 46 (Lucky Foot)");
      break;
    }

    // 3
    case PlayerType.PLAYER_JUDAS: {
      // Judas needs to be at half of a red heart
      g.p.AddHearts(-1);
      break;
    }

    // 5
    case PlayerType.PLAYER_EVE: {
      misc.removeItemFromItemTracker(CollectibleType.COLLECTIBLE_RAZOR_BLADE);
      // (this is given via an achievement and not from the "players.xml file")

      // Make the D6 appear first on the item tracker
      Isaac.DebugString("Removing collectible 122 (Whore of Babylon)");
      Isaac.DebugString("Adding collectible 122 (Whore of Babylon)");
      Isaac.DebugString("Removing collectible 117 (Dead Bird)");
      Isaac.DebugString("Adding collectible 117 (Dead Bird)");

      break;
    }

    // 6
    case PlayerType.PLAYER_SAMSON: {
      // Make the D6 appear first on the item tracker
      Isaac.DebugString("Removing collectible 157 (Bloody Lust)");
      Isaac.DebugString("Adding collectible 157 (Bloody Lust)");

      // Remove the trinket as a quality of life fix
      // (since everyone just drops it anyway)
      g.p.TryRemoveTrinket(TrinketType.TRINKET_CHILDS_HEART);

      break;
    }

    // 7
    case PlayerType.PLAYER_AZAZEL: {
      // Give him an additional half soul heart
      g.p.AddSoulHearts(1);

      break;
    }

    // 8
    case PlayerType.PLAYER_LAZARUS: {
      // Make the D6 appear first on the item tracker
      Isaac.DebugString("Removing collectible 214 (Anemic)");
      Isaac.DebugString("Adding collectible 214 (Anemic)");

      break;
    }

    // 9
    case PlayerType.PLAYER_EDEN: {
      // Find out what the passive item is
      let passiveItem: CollectibleType | undefined;
      for (let i = 1; i <= g.numTotalCollectibles; i++) {
        if (
          g.p.HasCollectible(i) &&
          i !== activeItem &&
          i !== CollectibleType.COLLECTIBLE_D6
        ) {
          passiveItem = i;
          break;
        }
      }
      if (passiveItem === undefined) {
        error("Failed to find out what Eden's passive item was.");
      }

      // Update the cache (in case we had an active item that granted stats, like A Pony)
      g.p.AddCacheFlags(CacheFlag.CACHE_ALL);
      g.p.EvaluateItems();

      // Remove the costume, if any (some items give a costume, like A Pony)
      g.p.RemoveCostume(g.itemConfig.GetCollectible(activeItem));

      // Eden starts with the Schoolbag by default
      misc.giveItemAndRemoveFromPools(
        CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM,
      );
      schoolbag.put(activeItem, activeCharge);

      // Make the D6 appear first on the item tracker
      Isaac.DebugString(`Removing collectible ${activeItem}`);
      Isaac.DebugString(`Removing collectible ${passiveItem}`);
      Isaac.DebugString(`Adding collectible ${activeItem}`);
      Isaac.DebugString(`Adding collectible ${passiveItem}`);

      // Store Eden's natural starting items so that we can show them to the player
      g.run.edenStartingItems[1] = activeItem;
      g.run.edenStartingItems[2] = passiveItem;

      break;
    }

    // 10
    case PlayerType.PLAYER_THELOST: {
      // Make the D6 appear first on the item tracker
      Isaac.DebugString("Removing collectible 313 (Holy Mantle)");
      Isaac.DebugString("Adding collectible 313 (Holy Mantle)");

      break;
    }

    // 13
    case PlayerType.PLAYER_LILITH: {
      // Make the D6 appear first on the item tracker
      Isaac.DebugString("Removing collectible 412 (Cambion Conception)");
      Isaac.DebugString("Adding collectible 412 (Cambion Conception)");

      break;
    }

    // 14
    case PlayerType.PLAYER_KEEPER: {
      misc.removeItemFromItemTracker(CollectibleType.COLLECTIBLE_WOODEN_NICKEL);
      // (this is given via an achievement and not from the "players.xml file")

      break;
    }

    case PlayerTypeCustom.PLAYER_SAMAEL: {
      // Give him the Schoolbag with the Wraith Skull
      misc.giveItemAndRemoveFromPools(
        CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM,
      );
      schoolbag.put(CollectibleTypeCustom.COLLECTIBLE_WRAITH_SKULL, 0); // Start at 0 charge

      break;
    }

    default: {
      break;
    }
  }
}
