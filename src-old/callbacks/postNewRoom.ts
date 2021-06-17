/*
export function newRoom(): void {
  checkSatanRoom(); // Check for the Satan room
  checkMegaSatanRoom(); // Check for Mega Satan on "Everything" races
  checkScolexRoom(); // Check for all of the Scolex boss rooms
  checkDepthsPuzzle(); // Check for the unavoidable puzzle room in the Dank Depths
  checkEntities(); // Check for various NPCs
  // Check to see if we need to respawn an end-of-race or end-of-speedrun trophy
  checkRespawnTrophy();
  banB1TreasureRoom(); // Certain formats ban the Treasure Room in Basement 1
  banB1CurseRoom(); // Certain formats ban the Curse Room in Basement 1

  changeCharOrder.postNewRoom(); // The "Change Char Order" custom challenge
  changeKeybindings.postNewRoom(); // The "Change Keybindings" custom challenge
  racePostNewRoom.main(); // Do race related stuff
  speedrunPostNewRoom.main(); // Do speedrun related stuff
}

// Check to see if we are entering the Mega Satan room so we can update the floor tracker and
// prevent cheating on the "Everything" race goal
function checkMegaSatanRoom() {
  const roomIndex = misc.getRoomIndex();

  // Check to see if we are entering the Mega Satan room
  if (roomIndex !== GridRooms.ROOM_MEGA_SATAN_IDX) {
    return;
  }

  // Emulate reaching a new floor, using a custom floor number of 13 (The Void is 12)
  Isaac.DebugString("Entered the Mega Satan room.");
}

function checkScolexRoom() {
  const roomDesc = g.l.GetCurrentRoomDesc();
  const roomData = roomDesc.Data;
  const roomStageID = roomData.StageID;
  const roomVariant = roomData.Variant;
  const roomClear = g.r.IsClear();
  const roomSeed = g.r.GetSpawnSeed();
  const challenge = Isaac.GetChallenge();

  // We don't need to modify Scolex if the room is already cleared
  if (roomClear) {
    return;
  }

  // We only need to check for rooms from the "Special Rooms" STB
  if (roomStageID !== 0) {
    return;
  }

  // Don't do anything if we are not in one of the Scolex boss rooms
  // (there are no Double Trouble rooms with any Scolex)
  if (
    roomVariant !== 1070 &&
    roomVariant !== 1071 &&
    roomVariant !== 1072 &&
    roomVariant !== 1073 &&
    roomVariant !== 1074 &&
    roomVariant !== 1075
  ) {
    return;
  }

  if (
    g.race.format === "seeded" ||
    challenge === ChallengeCustom.R7_SEASON_6
  ) {
    // Since Scolex (62.1) attack patterns ruin seeded races, delete it and replace it with two Frails
    // (there are 10 Scolex entities)
    const scolexes = Isaac.FindByType(
      EntityType.ENTITY_PIN,
      1,
    );
    for (const scolex of scolexes) {
      scolex.Remove(); // This takes a game frame to actually get removed
    }

    let seed = roomSeed;
    for (let i = 0; i < 2; i++) {
      // We don't want to spawn both of them on top of each other since that would make them behave
      // a little glitchy
      const pos = g.r.GetCenterPos();
      if (i === 1) {
        pos.X -= 150;
      } else if (i === 2) {
        pos.X += 150;
      }
      // Note that pos.X += 200 causes the hitbox to appear too close to the left/right side,
      // causing damage if the player moves into the room too quickly
      seed = misc.incrementRNG(seed);
      const frail = g.g.Spawn(
        EntityType.ENTITY_PIN,
        2,
        pos,
        Vector.Zero,
        null,
        0,
        seed,
      );
      // It will show the head on the first frame after spawning unless we hide it
      frail.Visible = false;
      // The game will automatically make the entity visible later on
    }
    Isaac.DebugString("Spawned 2 replacement Frails for Scolex.");
  }
}

// Check for various NPCs all at once
// (we want to loop through all of the entities in the room only for performance reasons)
function checkEntities() {
  const gameFrameCount = g.g.GetFrameCount();
  const roomClear = g.r.IsClear();
  const roomShape = g.r.GetRoomShape();
  const roomSeed = g.r.GetSpawnSeed();
  const character = g.p.GetPlayerType();

  let pinFound = false;
  for (const entity of Isaac.GetRoomEntities()) {
    } else if (
      entity.Type === EntityType.ENTITY_SLOTH || // Sloth (46.0) and Super Sloth (46.1)
      entity.Type === EntityType.ENTITY_PRIDE // Pride (52.0) and Super Pride (52.1)
    ) {
      // Replace all Sloths / Super Sloths / Prides / Super Prides with a new one that has an
      // InitSeed equal to the room
      // (we want the card drop to always be the same if there happens to be more than one in the
      // room; in vanilla the type of card that drops depends on the order you kill them in)
      g.g.Spawn(
        entity.Type,
        entity.Variant,
        entity.Position,
        entity.Velocity,
        entity.Parent,
        entity.SubType,
        roomSeed,
      );
      entity.Remove();
    } else if (entity.Type === EntityType.ENTITY_PIN) {
      // 62
      pinFound = true;
    } else if (
      entity.Type === EntityType.ENTITY_PITFALL &&
      entity.Variant === 1 &&
      roomClear
    ) {
      // Suction Pitfall (291.1)
      // Prevent the bug where if Suction Pitfalls do not complete their "Disappear" animation by
      // the time the player leaves the room, they will re-appear the next time the player enters
      // the room (even though the room is already cleared and they should be gone)
      entity.Remove();
      Isaac.DebugString("Removed a buggy stray Suction Pitfall.");
    }
  }

  // If Pin is in the room, cause a rumble as a warning for deaf players
  if (pinFound) {
    g.g.ShakeScreen(20);
    Isaac.DebugString("Pin detected; shaking the screen.");
  }
}

function banB1TreasureRoom() {
  if (!shouldBanB1TreasureRoom()) {
    return;
  }

  // Delete the doors to the Basement 1 treasure room, if any
  // (this includes the doors in a Secret Room)
  // (we must delete the door before changing the minimap, or else the icon will remain)
  const roomIndex = g.l.QueryRoomTypeIndex(
    RoomType.ROOM_TREASURE,
    false,
    RNG(),
  );
  for (let i = 0; i <= 7; i++) {
    const door = g.r.GetDoor(i);
    if (door !== null && door.TargetRoomIndex === roomIndex) {
      g.r.RemoveDoor(i);
      Isaac.DebugString("Removed the Treasure Room door on B1.");
    }
  }

  // Delete the icon on the minimap
  // (this has to be done on every room, because it will reappear)
  let roomDesc;
  if (MinimapAPI === null) {
    roomDesc = g.l.GetRoomByIdx(roomIndex);
    roomDesc.DisplayFlags = 0;
    g.l.UpdateVisibility(); // Setting the display flag will not actually update the map
  } else {
    roomDesc = MinimapAPI.GetRoomByIdx(roomIndex);
    if (roomDesc !== null) {
      roomDesc.Remove();
    }
  }
}

function shouldBanB1TreasureRoom() {
  const stage = g.l.GetStage();
  const challenge = Isaac.GetChallenge();

  return (
    stage === 1 &&
    (g.race.format === "seeded" ||
      challenge === ChallengeCustom.R7_SEASON_4 ||
      (challenge === ChallengeCustom.R7_SEASON_5 &&
        g.speedrun.characterNum >= 2) ||
      challenge === ChallengeCustom.R7_SEASON_6 ||
      challenge === ChallengeCustom.R7_SEASON_9)
  );
}

function banB1CurseRoom() {
  if (!shouldBanB1CurseRoom()) {
    return;
  }

  // Delete the doors to the Basement 1 curse room, if any
  // (this includes the doors in a Secret Room)
  // (we must delete the door before changing the minimap, or else the icon will remain)
  let roomIndex: int | null = null;
  for (let i = 0; i <= 7; i++) {
    const door = g.r.GetDoor(i);
    // We check for "door.TargetRoomType" instead of "door.TargetRoomIndex" because it leads to bugs
    if (door !== null && door.TargetRoomType === RoomType.ROOM_CURSE) {
      g.r.RemoveDoor(i);
      roomIndex = door.TargetRoomIndex;
      Isaac.DebugString("Removed the Curse Room door on B1.");
    }
  }
  if (roomIndex === null) {
    return;
  }

  // Delete the icon on the minimap
  // (this has to be done on every room, because it will reappear)
  let roomDesc;
  if (MinimapAPI === undefined) {
    roomDesc = g.l.GetRoomByIdx(roomIndex);
    roomDesc.DisplayFlags = 0;
    g.l.UpdateVisibility(); // Setting the display flag will not actually update the map
  } else {
    roomDesc = MinimapAPI.GetRoomByIdx(roomIndex);
    if (roomDesc !== null) {
      roomDesc.Remove();
    }
  }
}

function shouldBanB1CurseRoom() {
  const stage = g.l.GetStage();
  const challenge = Isaac.GetChallenge();

  return stage === 1 && challenge === ChallengeCustom.R7_SEASON_9;
}

*/
