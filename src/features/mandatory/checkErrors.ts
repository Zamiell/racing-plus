import {
  anyPlayerHasCollectible,
  anyPlayerIs,
  getPlayerIndex,
  getPlayers,
  log,
  PlayerIndex,
} from "isaacscript-common";
import g from "../../globals";

const MAX_VANILLA_COLLECTIBLE_ID = CollectibleType.COLLECTIBLE_DECAP_ATTACK;
const NUM_RACING_PLUS_ITEMS = 9;
const NUM_BABIES_MOD_ITEMS = 15;

export default function checkErrors(): boolean {
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
    g.run.errors.corrupted = true;
  }

  return g.run.errors.corrupted;
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
    g.run.errors.incompleteSave = true;
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

  return g.run.errors.incompleteSave;
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
    g.run.errors.otherModsEnabled = true;
  }

  return g.run.errors.otherModsEnabled;
}

function getMaxCollectibleID() {
  return g.itemConfig.GetCollectibles().Size - 1;
}
