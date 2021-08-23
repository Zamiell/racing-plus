/*

export default class GlobalsRun {
  // Tracking per run
  items: CollectibleType[] = [];
  roomIDs: int[] = [];
  edenStartingItems: CollectibleType[] = [];
  metKrampus = false;
  movingBoxOpen = true;
  PHDPills = false; // Used to determine when to change the pill text
  haveWishbone = false;
  haveWalnut = false;

  // Temporary tracking
  currentRoomClearState = true;
  lastDamageFrame = 0;
  giveExtraCharge = false; // Used to fix The Battery + 9 Volt synergy
  // Used to delete the trapdoor and heaven door after It Lives! and Hush
  rechargeItemFrame = 0; // Used to recharge a D6 or a Void after a failed attempt
  // Used to remove health after taking Crown of Light from a fart-reroll
  removedCrownHearts = false;
  passiveItems: CollectibleType[] = []; // Used to keep track of the currently collected passive items
  pickingUpItem = CollectibleType.COLLECTIBLE_NULL; // Equal to the ID of the currently queued item
  pickingUpItemRoom = 0; // Equal to the room that we picked up the currently queued item
  pickingUpItemType = ItemType.ITEM_NULL;
  directions = [] as boolean[][]; // A 2-dimensional array that stores the directions held on past frames
  // Used to manually switch the player between The Forgotten and The Soul
  currentCharacter = 0;
  fadeForgottenFrame = 0; // Used to fix a bug with seeded death
  showVersionFrame = 0;
  bombKeyPressed = false;
  spawningAngel = false; // Used to prevent unavoidable damage on the Isaac fight
  gettingCollectible = false;
  dealingExtraDamage = false; // Used for Hush
  firingExtraTear = false; // Used for Hush
  customBossRoomIndex = -1000; // Used in Season 7
  pencilCounter = 0; // Used for tracking the number of tears fired (for Lead Pencil)
  spamButtons = false; // Used to spam Blood Rights
  spawnedUltraGreed = false; // Used in Season 7
  threeDollarBillItem = 0;
  disableControls = false;
  autofire = false;
  autofireChangeFrame = 0;
  soulJarSouls = 0;
  reseedNextFloor = false;
  lostHealthSprite: Sprite | null = null;
  holyMantleSprite: Sprite | null = null;
  pencilSprite: Sprite | null = null;

  familiarVars = new Map<FamiliarVariant, FamiliarVars>();
}

*/
