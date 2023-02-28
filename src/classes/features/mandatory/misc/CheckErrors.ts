import {
  CollectibleType,
  ItemPoolType,
  ModCallback,
} from "isaac-typescript-definitions";
import { CallbackPriority } from "isaac-typescript-definitions/dist/src/enums/CallbackPriority";
import {
  asCollectibleType,
  asNumber,
  Callback,
  getCollectibleName,
  getEnumLength,
  getRoomVisitedCount,
  inStartingRoom,
  isCharacter,
  isRepentance,
  LAST_VANILLA_COLLECTIBLE_TYPE,
  log,
  ModCallbackCustom,
  onFirstFloor,
  PriorityCallbackCustom,
  removeAllDoors,
  TIME_GAME_OPENED,
} from "isaacscript-common";
import { CollectibleTypeCustom } from "../../../../enums/CollectibleTypeCustom";
import { PlayerTypeCustom } from "../../../../enums/PlayerTypeCustom";
import {
  checkValidCharOrder,
  inSpeedrun,
  onSeason,
} from "../../../../features/speedrun/speedrun";
import { mod } from "../../../../mod";
import { hotkeys } from "../../../../modConfigMenu";
import { MandatoryModFeature } from "../../../MandatoryModFeature";
import {
  getBuildBansTime,
  isSpeedrunWithRandomCharacterOrder,
  RANDOM_CHARACTER_LOCK_MILLISECONDS,
  RANDOM_CHARACTER_LOCK_SECONDS,
} from "../../speedrun/RandomCharacterOrder";
import { SEASON_2_NUM_BANS } from "../../speedrun/season2/constants";
import { hasErrors, v } from "./checkErrors/v";
import { getTimeConsoleUsed } from "./TimeConsoleUsed";

const NUM_RACING_PLUS_ITEMS = getEnumLength(CollectibleTypeCustom);
const NUM_BABIES_MOD_ITEMS = 17;
const INCOMPLETE_SAVE_COLLECTIBLE_TO_CHECK = CollectibleType.DEATH_CERTIFICATE;
const INCOMPLETE_SAVE_ITEM_POOL_TO_CHECK = ItemPoolType.SECRET;

const STARTING_X = 115;
const STARTING_Y = 70;
const MAX_CHARACTERS_PER_LINE = 50;

export class CheckErrors extends MandatoryModFeature {
  v = v;

  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    if (v.run.afterbirthPlus) {
      this.drawErrorText(
        "You must have the Repentance DLC installed in order to use Racing+.\n\nIf you want to use the Afterbirth+ version of the mod, then you must download it manually from GitHub.",
      );
    } else if (v.run.corrupted) {
      this.drawErrorText(
        "You must completely close and re-open the game after enabling or disabling any mods.\n\nIf this error persists after re-opening the game, then your Racing+ mod is corrupted and needs to be redownloaded/reinstalled.",
      );
    } else if (v.run.incompleteSave) {
      this.drawErrorText(
        "You must use a fully unlocked save file to play the Racing+ mod. This is so that all players will have consistent items in races and speedruns.\n\nYou can download a fully unlocked save file from:\nhttps://www.speedrun.com/repentance/resources",
      );
    } else if (v.run.otherModsEnabled) {
      this.drawErrorText(
        "You have illegal mods enabled.\n\nMake sure that Racing+ is the only mod enabled in your mod list and then completely close and re-open the game.",
      );
    } else if (v.run.babiesModEnabled) {
      this.drawErrorText(
        "You must turn off The Babies Mod when playing characters other than Random Baby.",
      );
    } else if (v.run.invalidCharOrder) {
      const thingToSet = onSeason(2) ? "item bans" : "a character order";
      this.drawErrorText(
        `You must set ${thingToSet} first by using the "Change Char Order" custom challenge.`,
      );
    } else if (v.run.season4StorageHotkeyNotSet) {
      this.drawErrorText(
        "You must set a hotkey to store items using Mod Config Menu. (Restart the game after this is done.)",
      );
    } else if (v.run.seasonGameRecentlyOpened) {
      const text = this.getSeasonErrorMessage(
        "opening the game",
        TIME_GAME_OPENED,
      );
      this.drawErrorText(text);
    } else if (v.run.seasonConsoleRecentlyUsed) {
      const text = this.getSeasonErrorMessage(
        "using the console",
        getTimeConsoleUsed() ?? 0,
      );
      this.drawErrorText(text);
    } else if (v.run.seasonBansRecentlySet) {
      const text = this.getSeasonErrorMessage(
        `assigning your ${SEASON_2_NUM_BANS} build bans`,
        getBuildBansTime() ?? 0,
      );
      this.drawErrorText(text);
    }
  }

  drawErrorText(text: string): void {
    const x = STARTING_X;
    let y = STARTING_Y;

    text = `Error: ${text}`;

    for (const line of text.split("\n")) {
      const splitLines = this.getSplitLines(line);
      for (const splitLine of splitLines) {
        Isaac.RenderText(splitLine, x, y, 2, 2, 2, 2);
        y += 10;
      }
    }
  }

  getSplitLines(line: string): string[] {
    let spaceLeft = MAX_CHARACTERS_PER_LINE;
    const words = line.split(" ");
    words.forEach((word, i) => {
      if (word.length + 1 > spaceLeft) {
        words[i] = `\n${word}`;
        spaceLeft = MAX_CHARACTERS_PER_LINE - word.length;
      } else {
        spaceLeft -= word.length + 1;
      }
    });

    return words.join(" ").split("\n");
  }

  getSeasonErrorMessage(action: string, millisecondsStarted: int): string {
    const time = Isaac.GetTime();
    const endTime = millisecondsStarted + RANDOM_CHARACTER_LOCK_MILLISECONDS;
    const millisecondsRemaining = endTime - time;
    const secondsRemaining = Math.ceil(millisecondsRemaining / 1000);

    if (secondsRemaining > RANDOM_CHARACTER_LOCK_SECONDS) {
      return 'Please set your item vetos for Season 2 again in the "Change Char Order" custom challenge.';
    }

    const suffix = secondsRemaining > 1 ? "s" : "";
    const secondsRemainingText = `${secondsRemaining} second${suffix}`;
    const secondSentence =
      secondsRemaining > 0
        ? `Please wait ${secondsRemainingText} and then restart.`
        : "Please restart.";
    return `You are not allowed to start a new run so soon after ${action}. ${secondSentence}`;
  }

  @PriorityCallbackCustom(
    ModCallbackCustom.POST_GAME_STARTED_REORDERED,
    CallbackPriority.EARLY,
    false,
  )
  postGameStartedReorderedFalseEarly(): void {
    checkAfterbirthPlus();
    checkCorruptMod();
    checkIncompleteSave();
    checkOtherModsEnabled();
    checkBabiesModEnabled();
    checkInvalidCharOrder();
    checkStorageHotkey();
    checkGameRecentlyOpened();
    checkConsoleRecentlyUsed();
    checkBansRecentlySet();

    if (hasErrors()) {
      removeAllDoors();
    }
  }
}

function checkAfterbirthPlus() {
  if (!isRepentance()) {
    log("Error: Afterbirth+ detected.");
    v.run.afterbirthPlus = true;
  }
}

/**
 * If Racing+ is turned on from the mod menu and then the user immediately tries to play, it won't
 * work properly; some things like boss cutscenes will still be enabled. In order to fix this, the
 * game needs to be completely restarted. One way to detect this corrupted state is to get how many
 * frames there are in the currently loaded boss cutscene animation file (located at
 * "gfx/ui/boss/versusscreen.anm2"). Racing+ removes boss cutscenes, so this value should be 0. This
 * function returns true if the `POST_GAME_STARTED` callback should halt.
 */
function checkCorruptMod() {
  const sprite = Sprite();
  sprite.Load("gfx/ui/boss/versusscreen.anm2", true);
  sprite.SetFrame("Scene", 0);
  sprite.SetLastFrame();
  const lastFrame = sprite.GetFrame();

  if (lastFrame !== 0) {
    log(
      `Error: Corrupted Racing+ instantiation detected. (The last frame of the "Scene" animation is frame ${lastFrame}.)`,
    );
    v.run.corrupted = true;
  }
}

function checkIncompleteSave() {
  const isCollectibleUnlocked = mod.isCollectibleUnlocked(
    INCOMPLETE_SAVE_COLLECTIBLE_TO_CHECK,
    INCOMPLETE_SAVE_ITEM_POOL_TO_CHECK,
  );

  v.run.incompleteSave = !isCollectibleUnlocked;

  if (v.run.incompleteSave) {
    log(
      `Error: Incomplete save file detected. (Failed to get collectible ${getCollectibleName(
        INCOMPLETE_SAVE_COLLECTIBLE_TO_CHECK,
      )} from pool ${ItemPoolType[INCOMPLETE_SAVE_ITEM_POOL_TO_CHECK]}.)`,
    );
  }
}

/**
 * Check to see if there are any mods enabled that have added custom items. (It is difficult to
 * detect other mods in other ways.)
 *
 * We hardcode a check for External Item Descriptions, since it is a popular mod.
 */
function checkOtherModsEnabled() {
  const correctLastCollectibleTypeRacingPlus = asCollectibleType(
    asNumber(LAST_VANILLA_COLLECTIBLE_TYPE) + NUM_RACING_PLUS_ITEMS,
  );
  const correctLastCollectibleTypeRacingPlusBabiesMod = asCollectibleType(
    asNumber(LAST_VANILLA_COLLECTIBLE_TYPE) +
      NUM_RACING_PLUS_ITEMS +
      NUM_BABIES_MOD_ITEMS,
  );
  const correctLastCollectibleType =
    BabiesModGlobals === undefined
      ? correctLastCollectibleTypeRacingPlus
      : correctLastCollectibleTypeRacingPlusBabiesMod;

  const lastCollectibleType = mod.getLastCollectibleType();
  if (lastCollectibleType !== correctLastCollectibleType) {
    log(
      `Error: Other mods detected. (The highest collectible ID is ${lastCollectibleType}, but it should be ${correctLastCollectibleType}.)`,
    );
    v.run.otherModsEnabled = true;
  }

  if (EID !== undefined) {
    log("Error: External Item Descriptions detected.");
    v.run.otherModsEnabled = true;
  }

  if (StageAPI !== undefined) {
    log("Error: StageAPI detected.");
    v.run.otherModsEnabled = true;
  }
}

function checkBabiesModEnabled() {
  if (BabiesModGlobals === undefined) {
    return;
  }

  const player = Isaac.GetPlayer();
  const isRandomBaby = isCharacter(player, PlayerTypeCustom.RANDOM_BABY);
  const roomVisitedCount = getRoomVisitedCount();

  if (
    onFirstFloor() &&
    inStartingRoom() &&
    roomVisitedCount === 1 &&
    !isRandomBaby
  ) {
    v.run.babiesModEnabled = true;
    log("Error: Babies Mod detected.");
  }
}

function checkInvalidCharOrder() {
  if (inSpeedrun() && !checkValidCharOrder()) {
    v.run.invalidCharOrder = true;
    log("Error: Invalid character order detected.");
  }
}

function checkStorageHotkey() {
  if (onSeason(4) && hotkeys.storage === -1) {
    v.run.season4StorageHotkeyNotSet = true;
    log("Error: Storage hotkey not set.");
  }
}

function checkGameRecentlyOpened() {
  if (!isSpeedrunWithRandomCharacterOrder()) {
    return;
  }

  const time = Isaac.GetTime();
  const gameUnlockTime = TIME_GAME_OPENED + RANDOM_CHARACTER_LOCK_MILLISECONDS;
  if (time <= gameUnlockTime) {
    v.run.seasonGameRecentlyOpened = true;
    log("Error: Game recently opened.");
  }
}

function checkConsoleRecentlyUsed() {
  if (!isSpeedrunWithRandomCharacterOrder()) {
    return;
  }

  const timeConsoleUsed = getTimeConsoleUsed();
  if (timeConsoleUsed === undefined) {
    return;
  }

  const time = Isaac.GetTime();
  const consoleUnlockTime =
    timeConsoleUsed + RANDOM_CHARACTER_LOCK_MILLISECONDS;
  if (time <= consoleUnlockTime) {
    v.run.seasonConsoleRecentlyUsed = true;
    log("Error: Console recently opened.");
  }
}

function checkBansRecentlySet() {
  if (!isSpeedrunWithRandomCharacterOrder()) {
    return;
  }

  const buildBansTime = getBuildBansTime();
  if (buildBansTime === undefined) {
    return;
  }

  const time = Isaac.GetTime();
  const bansUnlockTime = buildBansTime + RANDOM_CHARACTER_LOCK_MILLISECONDS;
  if (time <= bansUnlockTime) {
    v.run.seasonBansRecentlySet = true;
    log("Error: Build bans recently set.");
  }
}
