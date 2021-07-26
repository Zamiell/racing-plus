import g from "../../globals";
import log from "../../log";

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

function isIncompleteSave() {
  // Check to see if Death Certificate is unlocked
  const collectibleType = g.itemPool.GetCollectible(
    ItemPoolType.POOL_24,
    false,
    0,
  );
  if (collectibleType !== CollectibleType.COLLECTIBLE_DEATH_CERTIFICATE) {
    log(
      `Error: Incomplete save file detected. (Failed to get Death Certificate from Pool 24; got ${collectibleType} instead.)`,
    );
    g.run.errors.incompleteSave = true;
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
