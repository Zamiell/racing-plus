/** Config values should match the ordering in "configDescription.ts". */
export class Config {
  // Major
  ClientCommunication = true;
  StartWithD6 = true;
  DisableCurses = true;
  BetterDevilAngelRooms = true;
  FreeDevilItem = true;
  FastReset = true;
  FastClear = true;
  FastTravel = true;

  // Chars
  JudasAddBomb = true; // 3
  SamsonDropHeart = true; // 6
  ShowEdenStartingItems = true; // 9, 30
  LostUseHolyCard = true; // 31
  TaintedKeeperMoney = true; // 33

  // Boss
  FadeBosses = true;
  RemoveArmor = true;
  FastBossRush = true;
  KillExtraEnemies = true; // 45, 78
  FastPin = true; // 62
  PreventDeathSlow = true; // 66
  FastBlastocyst = true; // 74
  FastKrampus = true; // 81
  FastSatan = true; // 84
  FastHaunt = true; // 260
  FastAngels = true; // 271, 272
  ConsistentAngels = true; // 271, 272
  RemoveLambBody = true; // 273
  PreventVictoryLapPopup = true; // 273
  FastMegaSatan = true; // 274, 275
  PreventEndMegaSatan = true; // 275
  OpenHushDoor = true; // 407
  FastHush = true; // 407
  FastBigHorn = true; // 411
  FastHeretic = true; // 905
  FastColostomia = true; // 917
  FastDogma = true; // 950
  PreventEndBeast = true; // 951

  // Enemies
  ClearerShadowAttacks = true;
  FadeFriendlyEnemies = true;
  RemoveTreasureRoomEnemies = true;
  GlobinSoftlock = true; // 24
  AppearHands = true; // 213, 287
  FastHands = true; // 213, 287
  VulnerableGhosts = true; // 219, 260, 285
  FastGhosts = true; // 219, 285
  ReplaceCodWorms = true; // 221
  RemoveStrayPitfalls = true; // 291
  FastPolties = true; // 816
  FastNeedles = true; // 881
  FastDusts = true; // 882
  DummyDPS = true; // 964

  // QoL
  AutomaticItemInsertion = true;
  ChangeCreepColor = true;
  ChargePocketItemFirst = true;
  DeleteVoidPortals = true;
  EasyFirstFloorItems = true;
  FadeDevilStatue = true;
  RunTimer = true;
  ShowMaxFamiliars = true;
  ShowNumSacrifices = true;
  ShowPills = true;
  SpeedUpFadeIn = true;
  SubvertTeleport = true;
  TaintedSamsonChargeBar = true; // 27 (charge bar)
  BloodyLustChargeBar = true; // 157 (charge bar)
  LeadPencilChargeBar = true; // 444 (charge bar)
  AzazelsRageChargeBar = true; // 669 (charge bar)
  CombinedDualityDoors = true; // 498 (collectible)
  RemoveFortuneCookieBanners = true; // 557 (collectible)
  ShowDreamCatcherItem = true; // 566 (collectible)
  FastLuna = true; // 589 (collectible)
  FadeVasculitisTears = true; // 657 (collectible)
  FastVanishingTwin = true; // 697 (collectible)
  FlipCustom = true; // 711 (collectible)
  RemovePerfectionVelocity = true; // 145 (trinket)
  RemovePerfectionOnEndFloors = true; // 145 (trinket)
  DisplayExpansionPack = true; // 181 (trinket)

  // Gameplay
  ExtraStartingItems = true;
  ConsistentTrollBombs = true;
  PillsCancelAnimations = true;

  // Cutscenes
  FastTeleports = true;

  // Bug fixes
  TaintedIsaacCollectibleDelay = true;
  Battery9VoltSynergy = true;
  ReverseJusticeFix = true;
  PreventUltraSecretRoomSoftlock = true;
  BatteryBumFix = true;
  TeleportInvalidEntrance = true;
  RemoveInvalidPitfalls = true;

  // GFX
  HUDOffsetFix = true;
  DrawControls = true;
  PaschalCandle = true; // 3.221
  ScaredHeart = true; // 5.10.9
  StickyNickel = true; // 5.20.6
  UniqueCardBacks = true; // 5.300
  HolidayHats = true;

  // Sounds
  SilenceMomDad = true;

  // Other
  Shadows = false;
  Chat = true;
  CharacterTimer = true;
}
