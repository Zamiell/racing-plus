/*
// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  // We only want to manually create certain rooms in seeded races
  if (g.race.format !== "seeded" || g.race.status !== "in progress" || g.race.myStatus !== "racing") {
    return;
  }

  const roomType = g.r.GetType();

  // We only want to replace things on the first visit, or else everything will get duplicated
  if (!g.r.IsFirstVisit()) {
    return;
  }

  if (roomType === RoomType.ROOM_DEVIL) {
    devilRoom();
  } else if (roomType === RoomType.ROOM_ANGEL) {
    angelRoom();
  }
}

function devilRoom() {
  // First, find out if we should encounter Krampus instead of getting a normal Devil Room
  if (!g.run.metKrampus) {
    g.RNGCounter.devilRoomKrampus = misc.incrementRNG(
      g.RNGCounter.devilRoomKrampus,
    );
    math.randomseed(g.RNGCounter.devilRoomKrampus);
    const krampusRoll = math.random(1, 100);

    let krampusChance;
    if (g.g.GetDevilRoomDeals() > 0) {
      krampusChance = 40;
    } else {
      krampusChance = 10;
    }
    if (RacingPlusRebalancedVersion !== null) {
      krampusChance = 0;
    }

    if (krampusRoll <= krampusChance) {
      // Spawn Krampus
      g.run.metKrampus = true;
      Isaac.Spawn(
        EntityType.ENTITY_FALLEN,
        1,
        0,
        g.r.GetCenterPos(),
        Vector.Zero,
        null,
      );
      g.r.SetClear(false); // If we don't do this, we won't get a charge after Krampus is killed
      return;
    }
  }

  // Second, find out how many item pedestals we should spawn
  // We remove the 1x 10 red chests room (0.1 weight) because it can cause different items to spawn
  // on the same seed
  g.RNGCounter.devilRoomChoice = misc.incrementRNG(
    g.RNGCounter.devilRoomChoice,
  );
  math.randomseed(g.RNGCounter.devilRoomChoice);
  // The total weight of all of the rooms is 17.05 - 0.1 = 16.95
  const roomRoll = math.random(1, 1695);

  if (roomRoll <= 110) {
    // 1x 1 pedestal + 4 bombs (1 weight)
    spawnPedestalDevilRoom(6, 4);

    for (let i = 0; i < 2; i++) {
      let pos = misc.gridToPos(4, 4);
      if (i === 2) {
        pos = misc.gridToPos(8, 4);
      }
      Isaac.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_BOMB,
        BombSubType.BOMB_DOUBLEPACK,
        pos,
        Vector.Zero,
        null,
      );
    }
  } else if (roomRoll <= 210) {
    // 1x 1 pedestal + ? card (1 weight)
    spawnPedestalDevilRoom(5, 4);

    const pos = misc.gridToPos(7, 4);
    Isaac.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_TAROTCARD,
      Card.CARD_QUESTIONMARK,
      pos,
      Vector.Zero,
      null,
    );
  } else if (roomRoll <= 310) {
    // 1x 1 pedestal + black rune (1 weight)
    const pos = misc.gridToPos(5, 4);
    Isaac.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_TAROTCARD,
      Card.RUNE_BLACK,
      pos,
      Vector.Zero,
      null,
    );

    spawnPedestalDevilRoom(7, 4);
  } else if (roomRoll <= 410) {
    // 1x 1 pedestal + Devil Beggar (1 weight)
    spawnPedestalDevilRoom(5, 4);

    g.RNGCounter.devilRoomBeggar = misc.incrementRNG(
      g.RNGCounter.devilRoomBeggar,
    );
    const pos2 = misc.gridToPos(7, 4);
    g.g.Spawn(
      EntityType.ENTITY_SLOT,
      5,
      pos2,
      Vector.Zero,
      null,
      0,
      g.RNGCounter.devilRoomBeggar,
    );
  } else if (roomRoll <= 1610) {
    // 12x 2 pedestals (12 weight)
    spawnPedestalDevilRoom(5, 4);
    spawnPedestalDevilRoom(7, 4);
  } else if (roomRoll <= 1695) {
    // 1x 3 pedestals (0.85 weight)
    for (let x = 4; x <= 8; x++) {
      if (x % 2 === 0) {
        spawnPedestalDevilRoom(x, 4);
      }
    }

    // Also spawn 8 pitfalls to match the normal Racing+ room
    for (let x = 3; x <= 9; x++) {
      for (let y = 4; y <= 5; y++) {
        if (x % 2 !== 0) {
          const pos = misc.gridToPos(x, y);
          Isaac.Spawn(EntityType.ENTITY_PITFALL, 0, 0, pos, Vector.Zero, null);
        }
      }
    }
  } else if (roomRoll <= 1705) {
    // 1x 4 pedestals (0.1 weight)
    for (let x = 3; x <= 9; x++) {
      for (let y = 3; y <= 4; y++) {
        if (
          (y === 3 && (x === 3 || x === 9)) ||
          (y === 4 && (x === 5 || x === 7))
        ) {
          spawnPedestalDevilRoom(x, y);
        }
      }
    }
  }

  // Spawn the Devil Statue
  g.r.SpawnGridEntity(52, GridEntityType.GRID_STATUE, 0, 0, 0);

  // Spawn the two fires
  for (let i = 0; i < 2; i++) {
    let pos = misc.gridToPos(3, 1);
    if (i === 2) {
      pos = misc.gridToPos(9, 1);
    }
    Isaac.Spawn(EntityType.ENTITY_FIREPLACE, 0, 0, pos, Vector.Zero, null);
  }
}

function spawnPedestalDevilRoom(x: int, y: int) {
  // The collectible will be manually chosen in the PreGetCollectible callback
  const pos = misc.gridToPos(x, y);
  Isaac.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_SHOPITEM,
    0,
    pos,
    Vector.Zero,
    null,
  );
  // (we do not care about the seed because it will be replaced on the next frame)
}

function angelRoom() {
  // Find out how many item pedestals we should spawn
  g.RNGCounter.angelRoomChoice = misc.incrementRNG(
    g.RNGCounter.angelRoomChoice,
  );
  math.randomseed(g.RNGCounter.angelRoomChoice);
  const roomRoll = math.random(1, 16); // The total weight of all of the rooms is 16

  if (roomRoll <= 12) {
    // 12x 2 pedestals (12 weight)
    spawnPedestalAngelRoom(4, 4);
    spawnPedestalAngelRoom(8, 4);

    // Spawn the Angel Statue
    g.r.SpawnGridEntity(52, GridEntityType.GRID_STATUE, 1, 0, 0);
  } else if (roomRoll <= 13) {
    // 1x 3 pedestals (1 weight)
    spawnPedestalAngelRoom(0, 0);
    spawnPedestalAngelRoom(12, 0);
    spawnPedestalAngelRoom(0, 6);

    // Spawn 3x blocks
    g.r.SpawnGridEntity(31, GridEntityType.GRID_ROCKB, 0, 0, 0);
    g.r.SpawnGridEntity(43, GridEntityType.GRID_ROCKB, 0, 0, 0);
    g.r.SpawnGridEntity(91, GridEntityType.GRID_ROCKB, 0, 0, 0);

    // Spawn 3x lock blocks
    g.r.SpawnGridEntity(17, GridEntityType.GRID_LOCK, 0, 0, 0);
    g.r.SpawnGridEntity(27, GridEntityType.GRID_LOCK, 0, 0, 0);
    g.r.SpawnGridEntity(107, GridEntityType.GRID_LOCK, 0, 0, 0);

    // Spawn the Angel Statue
    g.r.SpawnGridEntity(52, GridEntityType.GRID_STATUE, 1, 0, 0);
  } else if (roomRoll <= 14) {
    // 1x 1 pedestal + 2 Eternal Chests (1 weight)
    spawnPedestalAngelRoom(6, 4);

    // Spawn 2 Angel Statues
    g.r.SpawnGridEntity(50, GridEntityType.GRID_STATUE, 1, 0, 0);
    g.r.SpawnGridEntity(54, GridEntityType.GRID_STATUE, 1, 0, 0);

    // 2x Eternal Chests
    for (let i = 0; i < 2; i++) {
      g.RNGCounter.angelRoomMisc = misc.incrementRNG(
        g.RNGCounter.angelRoomMisc,
      );
      let pos = misc.gridToPos(4, 4);
      if (i === 2) {
        pos = misc.gridToPos(8, 4);
      }
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_ETERNALCHEST,
        pos,
        Vector.Zero,
        null,
        0,
        g.RNGCounter.angelRoomMisc,
      );
    }
  } else if (roomRoll <= 15) {
    // 1x 1 pedestal + 1 random bomb (1 weight)
    spawnPedestalAngelRoom(6, 4);

    // 1x Random Bomb
    g.RNGCounter.angelRoomMisc = misc.incrementRNG(g.RNGCounter.angelRoomMisc);
    const pos = misc.gridToPos(6, 1);
    g.g.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_BOMB,
      pos,
      Vector.Zero,
      null,
      0,
      g.RNGCounter.angelRoomMisc,
    );

    // Spawn 2 Angel Statues
    g.r.SpawnGridEntity(50, GridEntityType.GRID_STATUE, 1, 0, 0);
    g.r.SpawnGridEntity(54, GridEntityType.GRID_STATUE, 1, 0, 0);
  } else if (roomRoll <= 16) {
    // 1x 1 pedestal (1 weight)
    spawnPedestalAngelRoom(6, 4);

    // Spawn 2 Angel Statues
    g.r.SpawnGridEntity(50, GridEntityType.GRID_STATUE, 1, 0, 0);
    g.r.SpawnGridEntity(54, GridEntityType.GRID_STATUE, 1, 0, 0);
  }
}

function spawnPedestalAngelRoom(x: int, y: int) {
  // The collectible will be manually chosen in the PreGetCollectible callback
  const pos = misc.gridToPos(x, y);
  const pickup = Isaac.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
    0,
    pos,
    Vector.Zero,
    null,
  ).ToPickup();
  // (we do not care about the seed because it will be replaced on the next frame)
  if (pickup !== null) {
    pickup.TheresOptionsPickup = true;
  }
}

// ModCallbacks.MC_PRE_ENTITY_SPAWN (24)
export function preEntitySpawn(
  _entityType: EntityType,
  _variant: int,
  _subType: int,
  _seed: int,
): [int, int, int] | null {
  // We only want to delete things in seeded races
  if (g.race.format !== "seeded" || g.race.status !== "in progress" || g.race.myStatus !== "racing") {
    return null;
  }

  // We only care about replacing things when the room is first loading
  if (g.r.GetFrameCount() !== -1) {
    return null;
  }

  const roomType = g.r.GetType();
  if (
    roomType === RoomType.ROOM_DEVIL || // 14
    roomType === RoomType.ROOM_ANGEL // 15
  ) {
    return [999, 0, 0]; // Equal to 1000.0, which is a blank effect, which is essentially nothing
  }

  return null;
}
*/
