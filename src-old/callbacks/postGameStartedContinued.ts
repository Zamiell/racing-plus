/*

// Fix the bug where the Gaping Maws will not respawn in the "Race Room"
if (
  roomIndex === GridRooms.ROOM_DEBUG_IDX &&
  (g.race.status === "open" || g.race.status === "starting")
) {
  // Spawn two Gaping Maws (235.0)
  Isaac.Spawn(
    EntityType.ENTITY_GAPING_MAW,
    0,
    0,
    misc.gridToPos(5, 5),
    Vector.Zero,
    null,
  );
  Isaac.Spawn(
    EntityType.ENTITY_GAPING_MAW,
    0,
    0,
    misc.gridToPos(7, 5),
    Vector.Zero,
    null,
  );
}

*/
