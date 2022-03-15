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
  killExtraEnemies = true; // 45, 78
  fastPin = true; // 62
  preventDeathSlow = true; // 66
  fastKrampus = true; // 81
  fastSatan = true; // 84
  fastHaunt = true; // 260
  fastAngels = true; // 271, 272
  consistentAngels = true; // 271, 272
  removeLambBody = true; // 273
  preventVictoryLapPopup = true; // 273
  openHushDoor = true; // 407
  fastBigHorn = true; // 411
  fastColostomia = true; // 917
  fastDogma = true; // 950

  // Enemies
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

  // QoL
  speedUpFadeIn = true;
  easyFirstFloorItems = true;
  changeCreepColor = true;
  subvertTeleport = true;
  deleteVoidPortals = true;
  showNumSacrifices = true;
  leadPencilChargeBar = true; // 444
  combinedDualityDoors = true; // 498
  removeFortuneCookieBanners = true; // 557
  showDreamCatcherItem = true; // 566
  fastLuna = true; // 589
  fadeVasculitisTears = true; // 657
  azazelsRageChargeBar = true; // 669
  fastVanishingTwin = true; // 697
  flipCustom = true; // 711
  removePerfectionVelocity = true; // 145
  removePerfectionOnEndFloors = true; // 145
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
  keeperHeal = true;
  battery9VoltSynergy = true;
  reverseJusticeFix = true;
  preventUltraSecretRoomSoftlock = true;
  batteryBumFix = true;
  teleportInvalidEntrance = true;
  removeInvalidPitfalls = true;

  // GFX
  flyItemSprites = true; // 57, 128, 364 (CollectibleType)
  twentyTwenty = true; // 245 (CollectibleType)
  starOfBethlehem = true; // 651 (CollectibleType)
  paschalCandle = true; // 221 (FamiliarVariant)
  scaredHeart = true; // 10.9 (PickupVariant, HeartSubType)
  stickyNickel = true; // 20.6 (PickupVariant, CoinSubType)
  uniqueCardBacks = true; // 300 (PickupVariant)
  hudOffsetFix = true;
  holidayHats = true;

  // Sounds
  silenceMomDad = true;

  // Other
  customConsole = true;
  shadows = false;
  chat = true;
  roll = false;
}
