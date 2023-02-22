/** Config values should match the ordering in "configDescription.ts". */
export class Config {
  // Major
  clientCommunication = true;
  startWithD6 = true;
  disableCurses = true;
  betterDevilAngelRooms = true;
  freeDevilItem = true;
  fastReset = true;
  fastClear = true;
  fastTravel = true;

  // Chars
  judasAddBomb = true; // 3
  samsonDropHeart = true; // 6
  showEdenStartingItems = true; // 9, 30
  lostUseHolyCard = true; // 31
  taintedKeeperMoney = true; // 33

  // Boss
  fadeBosses = true;
  removeArmor = true;
  fastBossRush = true;
  killExtraEnemies = true; // 45, 78
  fastPin = true; // 62
  preventDeathSlow = true; // 66
  fastBlastocyst = true; // 74
  fastKrampus = true; // 81
  fastSatan = true; // 84
  fastHaunt = true; // 260
  fastAngels = true; // 271, 272
  consistentAngels = true; // 271, 272
  removeLambBody = true; // 273
  preventVictoryLapPopup = true; // 273
  fastMegaSatan = true; // 274, 275
  preventEndMegaSatan = true; // 275
  openHushDoor = true; // 407
  fastHush = true; // 407
  fastBigHorn = true; // 411
  fastHeretic = true; // 905
  fastColostomia = true; // 917
  fastDogma = true; // 950
  preventEndBeast = true; // 951

  // Enemies
  fadeFriendlyEnemies = true;
  removeTreasureRoomEnemies = true;
  clearerShadowAttacks = true;
  globinSoftlock = true; // 24
  fastHands = true; // 213, 287
  appearHands = true; // 213, 287
  disableInvulnerability = true; // 219, 260, 285
  fastGhosts = true; // 219, 285
  replaceCodWorms = true; // 221
  removeStrayPitfalls = true; // 291
  fastPolties = true; // 816
  fastNeedles = true; // 881
  fastDusts = true; // 882
  dummyDPS = true; // 964

  // QoL
  speedUpFadeIn = true;
  easyFirstFloorItems = true;
  changeCreepColor = true;
  subvertTeleport = true;
  deleteVoidPortals = true;
  showNumSacrifices = true;
  taintedSamsonChargeBar = true;
  bloodyLustChargeBar = true; // 157 (charge bar)
  leadPencilChargeBar = true; // 444 (charge bar)
  azazelsRageChargeBar = true; // 669 (charge bar)
  combinedDualityDoors = true; // 498 (collectible)
  removeFortuneCookieBanners = true; // 557 (collectible)
  showDreamCatcherItem = true; // 566 (collectible)
  fastLuna = true; // 589 (collectible)
  fadeVasculitisTears = true; // 657 (collectible)
  fastVanishingTwin = true; // 697 (collectible)
  flipCustom = true; // 711 (collectible)
  removePerfectionVelocity = true; // 145 (trinket)
  removePerfectionOnEndFloors = true; // 145 (trinket)
  displayExpansionPack = true; // 181 (trinket)
  automaticItemInsertion = true;
  chargePocketItemFirst = true;
  showMaxFamiliars = true;
  showPills = true;
  fadeDevilStatue = true;

  // Gameplay
  extraStartingItems = true;
  consistentTrollBombs = true;
  pillsCancelAnimations = true;

  // Cutscenes
  fastTeleports = true;

  // Bug fixes
  taintedIsaacCollectibleDelay = true;
  battery9VoltSynergy = true;
  reverseJusticeFix = true;
  preventUltraSecretRoomSoftlock = true;
  batteryBumFix = true;
  teleportInvalidEntrance = true;
  removeInvalidPitfalls = true;

  // GFX
  hudOffsetFix = true;
  drawControls = true;
  paschalCandle = true; // 3.221
  scaredHeart = true; // 5.10.9
  stickyNickel = true; // 5.20.6
  uniqueCardBacks = true; // 5.300
  holidayHats = true;

  // Sounds
  silenceMomDad = true;

  // Other
  shadows = false;
  chat = true;
  characterTimer = true;
}
