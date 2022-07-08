import { CollectibleType, ItemPoolType } from "isaac-typescript-definitions";
import {
  getCollectibleName,
  getEffectiveStage,
  getEnumLength,
  getRoomVisitedCount,
  inStartingRoom,
  isCharacter,
  isCollectibleUnlocked,
  LAST_COLLECTIBLE_TYPE,
  LAST_VANILLA_COLLECTIBLE_TYPE,
  log,
  saveDataManager,
} from "isaacscript-common";
import { CollectibleTypeCustom } from "../../enums/CollectibleTypeCustom";
import { PlayerTypeCustom } from "../../enums/PlayerTypeCustom";
import { checkValidCharOrder, inSpeedrun } from "../speedrun/speedrun";

const NUM_RACING_PLUS_ITEMS = getEnumLength(CollectibleTypeCustom);
const NUM_BABIES_MOD_ITEMS = 17;
const COLLECTIBLE_TO_CHECK = CollectibleType.DEATH_CERTIFICATE;
const ITEM_POOL_TO_CHECK = ItemPoolType.SECRET;
const STARTING_X = 115;
const STARTING_Y = 70;
const MAX_CHARACTERS = 50;

const v = {
  run: {
    corrupted: false,
    incompleteSave: false,
    otherModsEnabled: false,
  },
};

export function init(): void {
  saveDataManager("errors", v);
}

export function check(): boolean {
  return isCorruptMod() || isIncompleteSave() || areOtherModsEnabled();
}

/**
 * If Racing+ is turned on from the mod menu and then the user immediately tries to play, it won't
 * work properly; some things like boss cutscenes will still be enabled. In order to fix this, the
 * game needs to be completely restarted. One way to detect this corrupted state is to get how many
 * frames there are in the currently loaded boss cutscene animation file (located at
 * "gfx/ui/boss/versusscreen.anm2"). Racing+ removes boss cutscenes, so this value should be 0. This
 * function returns true if the PostGameStarted callback should halt.
 */
function isCorruptMod() {
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

  return v.run.corrupted;
}

/** Check to see if Death Certificate is unlocked. */
function isIncompleteSave() {
  const isDeathCertificateUnlocked = isCollectibleUnlocked(
    COLLECTIBLE_TO_CHECK,
    ITEM_POOL_TO_CHECK,
  );

  v.run.incompleteSave = !isDeathCertificateUnlocked;

  if (v.run.incompleteSave) {
    log(
      `Error: Incomplete save file detected. (Failed to get collectible ${getCollectibleName(
        COLLECTIBLE_TO_CHECK,
      )} from pool ${ItemPoolType[ITEM_POOL_TO_CHECK]}.)`,
    );
  }

  return v.run.incompleteSave;
}

/**
 * Check to see if there are any mods enabled that have added custom items. (It is difficult to
 * detect other mods in other ways.)
 *
 * We hardcode a check for External Item Descriptions, since it is a popular mod.
 */
function areOtherModsEnabled() {
  const correctLastCollectibleTypeRacingPlus =
    ((LAST_VANILLA_COLLECTIBLE_TYPE as int) +
      NUM_RACING_PLUS_ITEMS) as CollectibleType;
  const correctLastCollectibleTypeRacingPlusBabiesMod =
    ((LAST_VANILLA_COLLECTIBLE_TYPE as int) +
      NUM_RACING_PLUS_ITEMS +
      NUM_BABIES_MOD_ITEMS) as CollectibleType;
  const correctLastCollectibleType =
    BabiesModGlobals === undefined
      ? correctLastCollectibleTypeRacingPlus
      : correctLastCollectibleTypeRacingPlusBabiesMod;

  if (LAST_COLLECTIBLE_TYPE !== correctLastCollectibleType) {
    log(
      `Error: Other mods detected. (The highest collectible ID is ${LAST_COLLECTIBLE_TYPE}, but it should be ${correctLastCollectibleType}.)`,
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

  return v.run.otherModsEnabled;
}

// ModCallback.POST_RENDER (2)
export function postRender(): boolean {
  if (REPENTANCE === undefined) {
    drawErrorText(
      "You must have the Repentance DLC installed in order to use Racing+.\n\nIf you want to use the Afterbirth+ version of the mod, then you must download it manually from GitHub.",
    );
    return true;
  }

  if (v.run.corrupted) {
    drawErrorText(
      "You must completely close and re-open the game after enabling or disabling any mods.\n\nIf this error persists after re-opening the game, then your Racing+ mod is corrupted and needs to be redownloaded/reinstalled.",
    );
    return true;
  }

  if (v.run.incompleteSave) {
    drawErrorText(
      "You must use a fully unlocked save file to play the Racing+ mod. This is so that all players will have consistent items in races and speedruns.\n\nYou can download a fully unlocked save file from:\nhttps://www.speedrun.com/repentance/resources",
    );
    return true;
  }

  if (v.run.otherModsEnabled) {
    drawErrorText(
      "You have illegal mods enabled.\n\nMake sure that Racing+ is the only mod enabled in your mod list and then completely close and re-open the game.",
    );
    return true;
  }

  if (inSpeedrun() && !checkValidCharOrder()) {
    drawErrorText(
      'You must set a character order first by using the "Change Char Order" custom challenge.',
    );
    return true;
  }

  if (BabiesModGlobals !== undefined) {
    const player = Isaac.GetPlayer();
    const isRandomBaby = isCharacter(player, PlayerTypeCustom.RANDOM_BABY);
    const effectiveStage = getEffectiveStage();
    const roomVisitedCount = getRoomVisitedCount();

    if (
      effectiveStage === 1 &&
      inStartingRoom() &&
      roomVisitedCount === 1 &&
      !isRandomBaby
    ) {
      drawErrorText(
        "You must turn off The Babies Mod when playing characters other than Random Baby.",
      );
      return true;
    }
  }

  return false;
}

export function drawErrorText(text: string): void {
  const x = STARTING_X;
  let y = STARTING_Y;

  text = `Error: ${text}`;

  for (const line of text.split("\n")) {
    const splitLines = getSplitLines(line);
    for (const splitLine of splitLines) {
      Isaac.RenderText(splitLine, x, y, 2, 2, 2, 2);
      y += 10;
    }
  }
}

function getSplitLines(line: string): string[] {
  let spaceLeft = MAX_CHARACTERS;
  const words = line.split(" ");
  words.forEach((word, i) => {
    if (word.length + 1 > spaceLeft) {
      words[i] = `\n${word}`;
      spaceLeft = MAX_CHARACTERS - word.length;
    } else {
      spaceLeft -= word.length + 1;
    }
  });

  return words.join(" ").split("\n");
}
