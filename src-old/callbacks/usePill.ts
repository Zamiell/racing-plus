/*
// PillEffect.PILLEFFECT_TELEPILLS (19)
export function telepills(): void {
  const stage = g.l.GetStage();
  const rooms = g.l.GetRooms();

  // It is not possible to teleport to I AM ERROR rooms and Black Markets on The Chest / Dark Room
  let insertErrorRoom = false;
  let insertBlackMarket = false;
  if (stage !== 11) {
    insertErrorRoom = true;

    // There is a 2% chance have a Black Market inserted into the list of possibilities
    // (according to Blade)
    g.RNGCounter.Telepills = misc.incrementRNG(g.RNGCounter.Telepills);
    math.randomseed(g.RNGCounter.Telepills);
    const blackMarketRoll = math.random(1, 100);
    if (blackMarketRoll <= 2) {
      insertBlackMarket = true;
    }
  }

  // Find the indexes for all of the room possibilities
  const roomIndexes: int[] = [];
  for (let i = 0; i < rooms.Size; i++) {
    const room = rooms.Get(i); // This is 0 indexed
    if (room === null) {
      continue;
    }

    // We need to use SafeGridIndex instead of GridIndex because we will crash when teleporting to
    // L rooms otherwise
    roomIndexes.push(room.SafeGridIndex);
  }
  if (insertErrorRoom) {
    roomIndexes.push(GridRooms.ROOM_ERROR_IDX);
  }
  if (insertBlackMarket) {
    roomIndexes.push(GridRooms.ROOM_BLACK_MARKET_IDX);
  }

  // Get a random room index
  g.RNGCounter.Telepills = misc.incrementRNG(g.RNGCounter.Telepills);
  math.randomseed(g.RNGCounter.Telepills);
  const randomIndex = math.random(0, roomIndexes.length - 1);
  const gridIndex = roomIndexes[randomIndex];

  // You have to set LeaveDoor before every teleport or else it will send you to the wrong room
  g.l.LeaveDoor = -1;

  teleport(
    gridIndex,
    Direction.NO_DIRECTION,
    RoomTransition.TRANSITION_TELEPORT,
  );

  // We don't want to display the "use" animation, we just want to instantly teleport
  // Pills are hard coded to queue the "use" animation, so stop it on the next frame
  g.run.usedTelepills = true;
}

// PillEffect.PILLEFFECT_LARGER (32)
export function oneMakesYouLarger(): void {
  // Allow this pill to cancel collectible pickup animation
  g.p.AnimateSad();
}

// PillEffect.PILLEFFECT_SMALLER (33)
export function oneMakesYouSmaller(): void {
  // Allow this pill to cancel collectible pickup animation
  g.p.AnimateHappy();
}

// PillEffect.PILLEFFECT_INFESTED_EXCLAMATION (34)
export function infestedExclamation(): void {
  // Allow this pill to cancel collectible pickup animation
  g.p.AnimateHappy();
}

// PillEffect.PILLEFFECT_INFESTED_QUESTION (35)
export function infestedQuestion(): void {
  // Allow this pill to cancel collectible pickup animation
  g.p.AnimateHappy();
}

// PillEffect.PILLEFFECT_POWER (36)
export function powerPill(): void {
  // Allow this pill to cancel collectible pickup animation
  g.p.AnimateHappy();
}

// PillEffect.PILLEFFECT_RETRO_VISION (37)
export function retroVision(): void {
  // Allow this pill to cancel collectible pickup animation
  g.p.AnimateSad();
}

// PillEffect.PILLEFFECT_HORF (44)
export function horf(): void {
  // Allow this pill to cancel collectible pickup animation
  g.p.AnimateSad();
}
*/
