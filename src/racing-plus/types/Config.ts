// Should match the ordering in "configDescription.ts"
export default class Config {
  // Major Changes
  clientCommunication = true;
  startWithD6 = true;
  disableCurses = true;
  betterDevilAngelRooms = true;
  freeDevilItem = true;
  fastReset = true;
  fastClear = true;
  fastTravel = true;

  // Character Changes
  judasAddBomb = true; // 3
  samsonDropHeart = true; // 6
  showEdenStartingItems = true; // 9, 30
  lostUseHolyCard = true; // 31
  taintedKeeperMoney = true; // 33

  // Boss Changes
  fadeBosses = true;
  stopDeathSlow = true; // 66
  fastSatan = true; // 84
  fastHaunt = true; // 260
  removeLambBody = true; // 273
  stopVictoryLapPopup = true; // 273
  openHushDoor = true; // 407
  fastBigHorn = true; // 411
  fastColostomia = true; // 917
  fastDogma = true; // 950

  // Enemy Changes
  removeTreasureRoomEnemies = true;
  clearerShadowAttacks = true;
  globinSoftlock = true; // 24
  fastHands = true; // 213, 287
  appearHands = true; // 213, 287
  disableInvulnerability = true; // 219, 260, 285
  fastGhosts = true; // 219, 285
  replaceCodWorms = true; // 221

  // Quality of Life Changes
  speedUpFadeIn = true;
  easyFirstFloorItems = true;
  changeCreepColor = true;
  subvertTeleport = true;
  deleteVoidPortals = true;
  showNumSacrifices = true;
  combinedDualityDoors = true; // 498
  removeFortuneCookieBanners = true; // 557
  showDreamCatcherItem = true; // 566
  fastMoonlight = true; // 589
  fadeVasculitisTears = true; // 657
  removePerfectionVelocity = true; // 145
  removePerfectionOnEndFloors = true; // 145
  automaticItemInsertion = true;
  chargePocketItemFirst = true;
  showMaxFamiliars = true;
  showPills = true;

  // Gameplay changes
  extraStartingItems = true;
  consistentTrollBombs = true;
  pillsCancelAnimations = true;

  // Cutscenes & Animations
  fastTeleports = true;

  // Bug Fixes
  teleportInvalidEntrance = true;

  // Graphics
  flyItemSprites = true;
  twentyTwenty = true;
  starOfBethlehem = true;
  paschalCandle = true;

  // Sounds
  silenceMomDad = true;

  // Other
  customConsole = true;
}
