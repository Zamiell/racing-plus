// Should match the ordering in "configDescription.ts"
export default class Config {
  // Major Changes
  startWithD6 = true;
  disableCurses = true;
  freeDevilItem = true;
  fastReset = true;
  fastClear = true;

  // Custom Hotkeys
  fastDropAllKeyboard = -1;
  fastDropAllController = -1;
  fastDropTrinketsKeyboard = -1;
  fastDropTrinketsController = -1;
  fastDropPocketKeyboard = -1;
  fastDropPocketController = -1;

  // Gameplay & Quality of Life Changes
  judasAddBomb = true;
  samsonDropHeart = true;
  showEdenStartingItems = true;
  showDreamCatcherItem = true;
  speedUpFadeIn = true;
  subvertTeleport = true;
  fadeVasculitisTears = true;
  customConsole = true;

  // Bug Fixes
  fixTeleportInvalidEntrance = true;
}
