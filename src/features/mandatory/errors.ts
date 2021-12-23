import {
  anyPlayerHasCollectible,
  anyPlayerIs,
  getCollectibleSet,
  getEffectiveStage,
  getMaxCollectibleID,
  getPlayerIndex,
  getPlayers,
  getRoomVisitedCount,
  inStartingRoom,
  log,
  MAX_VANILLA_COLLECTIBLE_TYPE,
  PlayerIndex,
  saveDataManager,
} from "isaacscript-common";
import g from "../../globals";
import { checkValidCharOrder, inSpeedrun } from "../speedrun/speedrun";

const NUM_RACING_PLUS_ITEMS = 31;
const NUM_BABIES_MOD_ITEMS = 17;
const COLLECTIBLE_TO_CHECK_FOR = CollectibleType.COLLECTIBLE_DEATH_CERTIFICATE;
const ITEM_POOL_TO_CHECK = ItemPoolType.POOL_SECRET;
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

// If Racing+ is turned on from the mod menu and then the user immediately tries to play,
// it won't work properly; some things like boss cutscenes will still be enabled
// In order to fix this, the game needs to be completely restarted
// One way to detect this corrupted state is to get how many frames there are in the currently
// loaded boss cutscene animation file (located at "gfx/ui/boss/versusscreen.anm2")
// Racing+ removes boss cutscenes, so this value should be 0
// This function returns true if the PostGameStarted callback should halt
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

// Check to see if Death Certificate is unlocked
function isIncompleteSave() {
  // If Eden is holding Death Certificate, then it is obviously unlocked
  // (and it will also be removed from pools so the below check won't work)
  if (anyPlayerHasCollectible(COLLECTIBLE_TO_CHECK_FOR)) {
    return false;
  }

  // Consider the save file complete if the any player is Tainted Lost
  // (since Tainted Lost cannot get Death Certificate in item pools)
  if (anyPlayerIs(PlayerType.PLAYER_THELOST_B)) {
    return false;
  }

  // Before checking item pools, we must remove Chaos, TMTRAINER, and the No! trinket
  const removedItemsMap: Map<PlayerIndex, CollectibleType[]> = new Map();
  const removedTrinketsMap: Map<PlayerIndex, TrinketType[]> = new Map();
  for (const player of getPlayers()) {
    const playerIndex = getPlayerIndex(player);

    const removedItems: CollectibleType[] = [];
    for (const itemToRemove of [
      CollectibleType.COLLECTIBLE_CHAOS,
      CollectibleType.COLLECTIBLE_TMTRAINER,
    ]) {
      if (player.HasCollectible(itemToRemove)) {
        const numCollectibles = player.GetCollectibleNum(itemToRemove);
        for (let i = 0; i < numCollectibles; i++) {
          player.RemoveCollectible(itemToRemove);
          removedItems.push(itemToRemove);
        }
      }
    }

    removedItemsMap.set(playerIndex, removedItems);

    const removedTrinkets: TrinketType[] = [];
    const trinketToRemove = TrinketType.TRINKET_NO;
    if (player.HasTrinket(trinketToRemove)) {
      player.TryRemoveTrinket(trinketToRemove);
      removedTrinkets.push(trinketToRemove);
    }

    removedTrinketsMap.set(playerIndex, removedTrinkets);
  }

  // Add every item in the game to the blacklist
  const collectibleSet = getCollectibleSet();
  for (const collectibleType of collectibleSet.values()) {
    if (collectibleType !== COLLECTIBLE_TO_CHECK_FOR) {
      g.itemPool.AddRoomBlacklist(collectibleType);
    }
  }

  // Get an item from the pool and see if it is the intended item
  const itemPoolCollectible = g.itemPool.GetCollectible(
    ITEM_POOL_TO_CHECK,
    false,
    1,
  );
  if (itemPoolCollectible !== COLLECTIBLE_TO_CHECK_FOR) {
    log(
      `Error: Incomplete save file detected. (Failed to get item ${COLLECTIBLE_TO_CHECK_FOR} from pool ${ITEM_POOL_TO_CHECK}; got item ${itemPoolCollectible} instead.)`,
    );
    v.run.incompleteSave = true;
  }

  // Reset the blacklist
  g.itemPool.ResetRoomBlacklist();

  // Give back items/trinkets, if necessary
  for (const player of getPlayers()) {
    const playerIndex = getPlayerIndex(player);

    const removedItems = removedItemsMap.get(playerIndex);
    if (removedItems !== undefined) {
      for (const collectibleType of removedItems) {
        player.AddCollectible(collectibleType, 0, false); // Prevent Chaos from spawning pickups
      }
    }

    const removedTrinkets = removedTrinketsMap.get(playerIndex);
    if (removedTrinkets !== undefined) {
      for (const trinketType of removedTrinkets) {
        player.AddTrinket(trinketType, false);
      }
    }
  }

  return v.run.incompleteSave;
}

// Check to see if there are any mods enabled that have added custom items
// (it is difficult to detect other mods in other ways)
function areOtherModsEnabled() {
  const maxCollectibleID = getMaxCollectibleID();
  let correctMaxCollectibleID =
    MAX_VANILLA_COLLECTIBLE_TYPE + NUM_RACING_PLUS_ITEMS;
  if (BabiesModGlobals !== undefined) {
    correctMaxCollectibleID += NUM_BABIES_MOD_ITEMS;
  }

  if (maxCollectibleID !== correctMaxCollectibleID) {
    log(
      `Error: Other mods detected. (The highest collectible ID is ${maxCollectibleID}, but it should be ${correctMaxCollectibleID}.)`,
    );
    v.run.otherModsEnabled = true;
  }

  return v.run.otherModsEnabled;
}

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): boolean {
  if (REPENTANCE === undefined) {
    drawNoRepentance();
    return true;
  }

  if (v.run.corrupted) {
    drawText(
      "Error: You must completely close and re-open the game after enabling or disabling any mods.\n\nIf this error persists after re-opening the game, then your Racing+ mod is corrupted and needs to be redownloaded/reinstalled.",
    );
    return true;
  }

  if (v.run.incompleteSave) {
    drawText(
      "Error: You must use a fully unlocked save file to play the Racing+ mod. This is so that all players will have consistent items in races and speedruns.\n\nYou can download a fully unlocked save file from:\nhttps://www.speedrun.com/repentance/resources",
    );
    return true;
  }

  if (v.run.otherModsEnabled) {
    drawText(
      "Error: You have illegal mods enabled.\n\nMake sure that Racing+ is the only mod enabled in your mod list and then completely close and re-open the game.",
    );
    return true;
  }

  if (inSpeedrun() && !checkValidCharOrder()) {
    drawText(
      'Error: You must set a character order first by using the "Change Char Order" custom challenge.',
    );
    return true;
  }

  if (BabiesModGlobals !== undefined) {
    const player = Isaac.GetPlayer();
    const character = player.GetPlayerType();
    const randomBabyID = Isaac.GetPlayerTypeByName("Random Baby");
    const effectiveStage = getEffectiveStage();
    const roomVisitedCount = getRoomVisitedCount();

    if (
      effectiveStage === 1 &&
      inStartingRoom() &&
      roomVisitedCount === 1 &&
      character !== randomBabyID
    ) {
      drawText(
        "Error: You must turn off The Babies Mod when playing characters other than Random Baby.",
      );
      return true;
    }
  }

  return false;
}

function drawNoRepentance() {
  let x = STARTING_X;
  let y = STARTING_Y;
  Isaac.RenderText(
    "Error: You must have the Repentance DLC installed",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  x += 42;
  y += 10;
  Isaac.RenderText("in order to use Racing+.", x, y, 2, 2, 2, 2);
  y += 20;
  Isaac.RenderText(
    "If you want to use the Afterbirth+ version",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  y += 10;
  Isaac.RenderText("of the mod, then you must download it", x, y, 2, 2, 2, 2);
  y += 10;
  Isaac.RenderText("manually from GitHub.", x, y, 2, 2, 2, 2);
}

function drawText(text: string) {
  const x = STARTING_X;
  let y = STARTING_Y;

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
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (word.length + 1 > spaceLeft) {
      words[i] = `\n${word}`;
      spaceLeft = MAX_CHARACTERS - word.length;
    } else {
      spaceLeft -= word.length + 1;
    }
  }

  return words.join(" ").split("\n");
}
