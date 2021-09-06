/*

// Check for various NPCs all at once
// (we want to loop through all of the entities in the room only for performance reasons)
function checkEntities() {
  const gameFrameCount = g.g.GetFrameCount();
  const roomClear = g.r.IsClear();
  const roomShape = g.r.GetRoomShape();
  const roomSeed = g.r.GetSpawnSeed();
  const character = g.p.GetPlayerType();

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
    }
  }

}

*/
