/*
// Per-run variables
export default class GlobalsRun {
  // Tracking per run
  startedTime = 0;
  erasedFadeIn = false;
  roomsEntered = 0;
  items: CollectibleType[] = [];
  roomIDs: int[] = [];
  edenStartingItems: CollectibleType[] = [];
  metKrampus = false;
  movingBoxOpen = true;
  killedLamb = false; // Used for the "Everything" race goal
  removeMoreOptions = false; // Used to give only one double item Treasure Room
  PHDPills = false; // Used to determine when to change the pill text
  haveWishbone = false;
  haveWalnut = false;
  debugDamage = false;
  debugTears = false;
  debugSpeed = false;
  debugChaosCard = false;

  // Temporary tracking
  restart = false; // If set, we restart the run on the next frame
  currentRoomClearState = true;
  lastDamageFrame = 0;
  diversity = false; // Whether or not this is a diversity race
  reseededFloor = false;
  goingToDebugRoom = false;
  forgetMeNow = false;
  usedD6Frame = 0; // Set when the D6 is used; used to prevent bugs with The Void + D6
  usedVoidFrame = 0; // Set when Void is used; used to prevent bugs with The Void + D6
  usedTelepills = false; // Used to replace the "use" animation
  usedBlankCard = false; // Used to replace the "use" animation
  giveExtraCharge = false; // Used to fix The Battery + 9 Volt synergy
  droppedButterItem = 0; // Needed to fix a bug with the Schoolbag and the Butter! trinket
  fastResetFrame = 0; // Set when the user presses the reset button on the keyboard
  dualityCheckFrame = 0;
  momDied = false; // Used to fix bugs with fast-clear and killing Mom
  vanillaPhotosSpawning = false; // Used when replacing The Polaroid and The Negative
  playerGeneratedPedestalSeeds = [] as int[]; // Used so that we properly seed player-generated pedestals (1/2)
  playerGeneratedPedestalFrame = 0; // Used so that we properly seed player-generated pedestals (2/2)
  // Used to delete the trapdoor and heaven door after It Lives! and Hush
  itLivesKillFrame = 0;
  speedLilHauntsFrame = 0; // Used to speed up The Haunt fight (1/2)
  speedLilHauntsBlack = false; // Used to speed up The Haunt fight (2/2)
  rechargeItemFrame = 0; // Used to recharge a D6 or a Void after a failed attempt
  killAttackFly = false; // Used to prevent a bug with trapdoors/crawlspaces and Corny Poop
  extraIncubus = false; // Used in Racing+ Season 4
  // Used to remove health after taking Crown of Light from a fart-reroll
  removedCrownHearts = false;
  passiveItems: CollectibleType[] = []; // Used to keep track of the currently collected passive items
  pickingUpItem = CollectibleType.COLLECTIBLE_NULL; // Equal to the ID of the currently queued item
  pickingUpItemRoom = 0; // Equal to the room that we picked up the currently queued item
  pickingUpItemType = ItemType.ITEM_NULL;
  directions = [] as boolean[][]; // A 2-dimensional array that stores the directions held on past frames
  lastDDLevel = 0; // Used by the Soul Jar
  // Used to manually switch the player between The Forgotten and The Soul
  switchForgotten = false;
  currentCharacter = 0;
  fadeForgottenFrame = 0; // Used to fix a bug with seeded death
  showVersionFrame = 0;
  bombKeyPressed = false;
  spawningAngel = false; // Used to prevent unavoidable damage on the Isaac fight
  bossCommand = false; // Used in Racing+ Rebalanced
  questionMarkCard = 0; // Equal to the last game frame that one was used
  gettingCollectible = false;
  dealingExtraDamage = false; // Used for Hush
  firingExtraTear = false; // Used for Hush
  customBossRoomIndex = -1000; // Used in Season 7
  pencilCounter = 0; // Used for tracking the number of tears fired (for Lead Pencil)
  spamButtons = false; // Used to spam Blood Rights
  startingRoomGraphics = false; // Used to toggle off the controls graphic in some race types
  // Used to reposition the player (if they appear at a non-existent entrance)
  usedTeleport = false;
  spawnedUltraGreed = false; // Used in Season 7
  frameOfLastDD = -1000;
  threeDollarBillItem = 0;
  disableControls = false;
  autofire = false;
  autofireChangeFrame = 0;
  endOfRunText = false;
  soulJarSouls = 0;
  reseedNextFloor = false;
  lostHealthSprite: Sprite | null = null;
  holyMantleSprite: Sprite | null = null;
  pencilSprite: Sprite | null = null;

  transformations = new Map<PlayerForm, boolean>();
  familiarVars = new Map<FamiliarVariant, FamiliarVars>();

  // Trophy
  trophy = {
    spawned: false, // Used to know when to respawn the trophy
    stage: 0,
    roomIndex: 0,
    position: Vector.Zero,
  };

  trapdoor = {
    state: FastTravelState.DISABLED,
    upwards: false,
    floor: 0,
    frame: 0,
    scale: new Map<int, Vector>(), // Key is player index
    voidPortal: false,
    megaSatan: false,
    reseeding: false, // True if we will reseed the floor after getting there
  };

  crawlspace = {
    prevRoom: 0,
    direction: -1, // Used to fix nested room softlocks
    blackMarket: false,
  };

  // Keeper + Greed's Gullet tracking
  keeper = {
    baseHearts: 4, // Either 4 (for base), 2, 0, -2, -4, -6, etc.
    healthUpItems: new Map<CollectibleType, int>(),
    coins: 50,
    usedHealthUpPill: false,
  };

  schoolbag = {
    hasSchoolbagCollectible: false,

    item: 0,
    charge: 0,
    chargeBattery: 0,

    switchButtonHeld: false,

    // 0 is not used, 1 is just used, 2 is entered the next room
    usedGlowingHourGlass: 0,

    // Used for handling the Glowing Hour Glass
    last: {
      active: {
        item: 0,
        charge: 0,
        chargeBattery: 0,
      },
      schoolbag: {
        item: 0,
        charge: 0,
        chargeBattery: 0,
      },
    },
  };

  // Special death handling for seeded races
  seededDeath = {
    state: SeededDeathState.DISABLED, // See the "SeededDeath.state" enum
    stage: 0,
    reviveFrame: 0,
    guppysCollar: false,
    position: Vector.Zero,
    debuffEndTime: 0,
    items: [] as CollectibleType[],
    charge: 0,
    spriteScale: Vector.Zero,
    goldenBomb: false,
    goldenKey: false,
    sbItem: 0,
    sbCharge: 0,
    sbChargeBattery: 0,
  };

  // Custom Boss Rush tracking
  bossRush = {
    started: false,
    finished: false,
    bosses: [] as Array<[int, int]>,
    currentWave: 0,
    spawnWaveFrame: 0,
  };

  // Special room seeding
  seededSwap = {
    swapping: false,
    devilVisited: false,
    bookTouched: false,
    coins: 0,
    keys: 0,
    health: {
      soulHeartTypes: [] as HeartSubType[],
      maxHearts: 0,
      hearts: 0,
      soulHearts: 0,
      boneHearts: 0,
      goldenHearts: 0,
    },
  };
}
*/
