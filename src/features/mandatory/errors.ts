import {
  anyPlayerHasCollectible,
  anyPlayerIs,
  getMaxCollectibleID,
  getPlayerIndex,
  getPlayers,
  log,
  PlayerIndex,
  saveDataManager,
} from "isaacscript-common";
import g from "../../globals";
import { checkValidCharOrder, inSpeedrun } from "../speedrun/speedrun";

const MAX_VANILLA_COLLECTIBLE_ID = CollectibleType.COLLECTIBLE_DECAP_ATTACK;
const NUM_RACING_PLUS_ITEMS = 19;
const NUM_BABIES_MOD_ITEMS = 15;
const STARTING_X = 115;
const STARTING_Y = 70;

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
  const itemToCheckFor = CollectibleType.COLLECTIBLE_DEATH_CERTIFICATE;
  const itemPoolToCheck = ItemPoolType.POOL_SECRET;

  // If Eden is holding Death Certificate, then it is obviously unlocked
  // (and it will also be removed from pools so the below check won't work)
  if (anyPlayerHasCollectible(itemToCheckFor)) {
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
  for (let i = 1; i < getMaxCollectibleID(); i++) {
    if (g.itemConfig.GetCollectible(i) !== null && i !== itemToCheckFor) {
      g.itemPool.AddRoomBlacklist(i);
    }
  }

  // Get an item from the pool and see if it is the intended item
  const itemPoolItem = g.itemPool.GetCollectible(itemPoolToCheck, false, 1);
  if (itemPoolItem !== itemToCheckFor) {
    log(
      `Error: Incomplete save file detected. (Failed to get item ${itemToCheckFor} from pool ${itemPoolToCheck}; got item ${itemPoolItem} instead.)`,
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
    MAX_VANILLA_COLLECTIBLE_ID + NUM_RACING_PLUS_ITEMS;
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
    drawCorrupted();
    return true;
  }

  if (v.run.incompleteSave) {
    drawSaveFileNotFullyUnlocked();
    return true;
  }

  if (v.run.otherModsEnabled) {
    drawOtherModsEnabled();
    return true;
  }

  if (inSpeedrun() && !checkValidCharOrder()) {
    drawSetCharOrder();
    return true;
  }

  if (BabiesModGlobals !== undefined) {
    const player = Isaac.GetPlayer();
    const character = player.GetPlayerType();
    const randomBabyID = Isaac.GetPlayerTypeByName("Random Baby");
    if (character !== randomBabyID) {
      drawTurnOffBabies();
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

function drawCorrupted() {
  let x = STARTING_X;
  let y = STARTING_Y;
  Isaac.RenderText(
    "Error: You must close and re-open the game after",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  x += 42;
  y += 10;
  Isaac.RenderText("enabling or disabling any mods.", x, y, 2, 2, 2, 2);
  y += 20;
  Isaac.RenderText(
    "If this error persists after re-opening the game,",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  y += 10;
  Isaac.RenderText(
    "then your Racing+ mod is corrupted and needs to be",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  y += 10;
  Isaac.RenderText("redownloaded/reinstalled.", x, y, 2, 2, 2, 2);
}

function drawSaveFileNotFullyUnlocked() {
  let x = STARTING_X;
  let y = STARTING_Y;
  Isaac.RenderText(
    "Error: You must use a fully unlocked save file to",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  x += 42;
  y += 10;
  Isaac.RenderText(
    "play the Racing+ mod. This is so that all",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  y += 10;
  Isaac.RenderText(
    "players will have consistent items in races",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  y += 10;
  Isaac.RenderText("and speedruns. You can download a fully", x, y, 2, 2, 2, 2);
  y += 10;
  Isaac.RenderText("unlocked save file at:", x, y, 2, 2, 2, 2);
  x -= 42;
  y += 20;
  Isaac.RenderText(
    "https://www.speedrun.com/repentance/resources",
    x,
    y,
    2,
    2,
    2,
    2,
  );
}

function drawOtherModsEnabled() {
  let x = STARTING_X;
  let y = STARTING_Y;
  Isaac.RenderText("Error: You have illegal mods enabled.", x, y, 2, 2, 2, 2);
  x += 42;
  y += 20;
  Isaac.RenderText(
    "Make sure that Racing+ is the only mod enabled",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  y += 10;
  Isaac.RenderText("in your mod list and try again.", x, y, 2, 2, 2, 2);
}

function drawSetCharOrder() {
  let x = STARTING_X;
  let y = STARTING_Y;
  Isaac.RenderText(
    "Error: You must set a character order first",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  x += 42;
  y += 10;
  Isaac.RenderText('by using the "Change Char Order" custom', x, y, 2, 2, 2, 2);
  y += 10;
  Isaac.RenderText("challenge.", x, y, 2, 2, 2, 2);
}

function drawTurnOffBabies() {
  let x = STARTING_X;
  let y = STARTING_Y;
  Isaac.RenderText(
    "Error: You must turn off The Babies Mod when playing",
    x,
    y,
    2,
    2,
    2,
    2,
  );
  x += 42;
  y += 10;
  Isaac.RenderText("characters other than Random Baby.", x, y, 2, 2, 2, 2);
}
