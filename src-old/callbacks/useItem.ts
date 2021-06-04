/*
export function main(collectibleType: CollectibleType): void {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();
  const activeItem = g.p.GetActiveItem();
  const activeCharge = g.p.GetActiveCharge();
  const batteryCharge = g.p.GetBatteryCharge();
  const activeItemMaxCharges = misc.getItemMaxCharges(activeItem);

  // Fix The Battery + 9 Volt synergy (1/2)
  if (
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_BATTERY) &&
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_NINE_VOLT) &&
    activeItemMaxCharges >= 2 &&
    activeCharge === activeItemMaxCharges &&
    batteryCharge === activeItemMaxCharges
  ) {
    g.run.giveExtraCharge = true;
  }

  // Fix the Schoolbag + Butter! bug
  if (g.p.HasTrinket(TrinketType.TRINKET_BUTTER)) {
    g.run.droppedButterItem = collectibleType; // (the pedestal will appear on the next game frame)
    Isaac.DebugString(
      `The Butter! trinket dropped item ${collectibleType} (on frame ${gameFrameCount}).`,
    );
    // We will check this variable later in the PostUpdate callback
    // (the "schoolbag.checkSecondItem()" function)
  }
}

// CollectibleType.COLLECTIBLE_TELEPORT (44)
// This callback is used naturally by Broken Remote
// This callback is manually called for Cursed Eye
export function teleport(): void {
  // Local variables
  const rooms = g.l.GetRooms();

  // Get a random room index
  // We could adjust this so that our current room is exempt from the list of available rooms,
  // but this would cause problems in seeded races,
  // so seeded races would have to be exempt from this exemption
  // Thus, don't bother with this in order to keep the behavior consistent through the different
  // types of races
  g.RNGCounter.teleport = misc.incrementRNG(g.RNGCounter.teleport);
  math.randomseed(g.RNGCounter.teleport);
  const roomNum = math.random(0, rooms.Size - 1);

  // We need to use SafeGridIndex instead of GridIndex because we will crash when teleporting to
  // L rooms otherwise
  const room = rooms.Get(roomNum);
  if (room === null) {
    error("Failed to get the room while teleporting.");
  }
  const gridIndexSafe = room.SafeGridIndex;

  // You have to set LeaveDoor before every teleport or else it will send you to the wrong room
  g.l.LeaveDoor = -1;

  teleport(
    gridIndexSafe,
    Direction.NO_DIRECTION,
    RoomTransition.TRANSITION_TELEPORT,
  );
  Isaac.DebugString(
    `Teleport! / Broken Remote / Cursed Eye to room: ${gridIndexSafe}`,
  );

  // This will override the existing Teleport! / Broken Remote effect because
  // we have already locked in a room transition
}

// CollectibleType.COLLECTIBLE_D6 (105)
export function d6(): void {
  // Used to prevent bugs with The Void + D6
  g.run.usedD6Frame = g.g.GetFrameCount();
}

// CollectibleType.COLLECTIBLE_FORGET_ME_NOW (127)
// Also called manually when we touch a 5-pip Dice Room
export function forgetMeNow(): void {
  // Local variables
  const stage = g.l.GetStage();
  const challenge = Isaac.GetChallenge();

  // Do nothing if we are are playing on a set seed
  if (playingOnSetSeed()) {
    return;
  }

  seededFloors.before(stage);
  g.run.forgetMeNow = true;
  Isaac.DebugString(
    "Forget Me Now / 5-pip Dice Room detected. Seeding the next floor.",
  );
  // We will call the "seededFloors.after()" function manually in the PostNewLevel callback
}

// CollectibleType.COLLECTIBLE_BLANK_CARD (286)
export function blankCard(): void {
  const card = g.p.GetCard(0);
  if (
    // Checking for "? Card" is not necessary
    card === Card.CARD_FOOL || // 1
    card === Card.CARD_EMPEROR || // 5
    card === Card.CARD_HERMIT || // 10
    card === Card.CARD_STARS || // 18
    card === Card.CARD_MOON || // 19
    card === Card.CARD_JOKER // 48
  ) {
    // We do not want to display the "use" animation
    // Blank Card is hard coded to queue the "use" animation, so stop it on the next frame
    g.run.usedBlankCard = true;
  }
}

// CollectibleType.COLLECTIBLE_UNDEFINED (324)
export function undefinedItem(): void {
  // Local variables
  const stage = g.l.GetStage();
  const rooms = g.l.GetRooms();

  // It is not possible to teleport to I AM ERROR rooms and Black Markets on
  // The Chest / Dark Room / The Void
  let insertErrorRoom = false;
  let insertBlackMarket = false;
  if (stage !== 11 && stage !== 12) {
    insertErrorRoom = true;

    // There is a 1% chance have a Black Market inserted into the list of possibilities
    // (according to Blade)
    g.RNGCounter.undefined = misc.incrementRNG(g.RNGCounter.undefined);
    math.randomseed(g.RNGCounter.undefined);
    const blackMarketRoll = math.random(1, 100);
    if (blackMarketRoll <= 1) {
      insertBlackMarket = true;
    }
  }

  // Find the indexes for all of the room possibilities
  const roomIndexes: int[] = [];
  for (let i = 0; i < rooms.Size; i++) {
    // We need to use SafeGridIndex instead of GridIndex because we will crash when teleporting to
    // L rooms otherwise
    const room = rooms.Get(i); // This is 0 indexed
    if (room === null) {
      continue;
    }

    const roomType = room.Data.Type;
    if (
      roomType === RoomType.ROOM_TREASURE && // 4
      !postNewRoom.checkBanB1TreasureRoom()
    ) {
      roomIndexes.push(room.SafeGridIndex);
    }
    if (
      roomType === RoomType.ROOM_SECRET || // 7
      roomType === RoomType.ROOM_SUPERSECRET // 8
    ) {
      roomIndexes.push(room.SafeGridIndex);
    }
  }
  if (insertErrorRoom) {
    roomIndexes.push(GridRooms.ROOM_ERROR_IDX);
  }
  if (insertBlackMarket) {
    roomIndexes.push(GridRooms.ROOM_BLACK_MARKET_IDX);
  }

  // Get a random index
  g.RNGCounter.Undefined = misc.incrementRNG(g.RNGCounter.Undefined);
  math.randomseed(g.RNGCounter.Undefined);
  const randomRoomIndexesIndex = math.random(0, roomIndexes.length - 1);
  const gridIndex = roomIndexes[randomRoomIndexesIndex];

  // You have to set LeaveDoor before every teleport or else it will send you to the wrong room
  g.l.LeaveDoor = -1;

  teleport(
    gridIndex,
    Direction.NO_DIRECTION,
    RoomTransition.TRANSITION_TELEPORT,
  );
  Isaac.DebugString(`Undefined to room: ${gridIndex}`);

  // This will override the existing Undefined effect because we have already locked in a room
  // transition
}

/*
// CollectibleType.COLLECTIBLE_VOID (477)
function UseItem.Void() {
  // Used to prevent bugs with The Void + D6
  g.run.usedVoidFrame = g.g.GetFrameCount()

  // Voided pedestal items should count as starting a Challenge Room or the Boss Rush
  const collectibles = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
  )
  if (collectibles.length > 0 ) {
    g.run.touchedPickup = true
  }
}

// CollectibleType.COLLECTIBLE_MOVING_BOX (523)
function UseItem.MovingBox() {
  Isaac.DebugString("Moving Box activated.")
  if ( g.run.movingBoxOpen ) {
    // Check to see if ( there are any pickups on the ground
    const pickupsPresent = false
    const pickups = Isaac.FindByType(EntityType.ENTITY_PICKUP)
    for (const pickup of pickups) {
      if ( (
        pickup.Variant !== PickupVariant.PICKUP_BIGCHEST // 340
        && pickup.Variant !== PickupVariant.PICKUP_TROPHY // 370
        && pickup.Variant !== PickupVariant.PICKUP_BED // 380
      ) ) {
        pickupsPresent = true
        break
      }
    }
    if ( pickupsPresent ) {
      g.run.movingBoxOpen = false
      Isaac.DebugString("Set the Moving Box graphic to the open state.")
    } else {
      Isaac.DebugString("No pickups found.")
    }
  } else {
    g.run.movingBoxOpen = true
    Isaac.DebugString("Set the Moving Box graphic to the closed state.")
  }
}

// Racing+ manually seeds all pedestal items based on the room seed
// This is a problem for player-created pedestals, since they will be able to be rerolled into
// different items depending on which room they are used in
function UseItem.PlayerGeneratedPedestal() {
  const gameFrameCount = g.g.GetFrameCount()
  g.run.playerGenPedFrame = gameFrameCount + 1
}

function debugItem() {
  debug.main()

  // Display the "use" animation
  return true
}

*/
