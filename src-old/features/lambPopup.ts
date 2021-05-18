// Subvert the "Would you like to do a Victory Lap!?" popup that happens after defeating The Lamb
/*
function subvertVictoryLapPopup() {
  const roomIndex = getRoomIndex();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const roomType = g.r.GetType();

  if (
    // 11.0 is the Dark Room
    stage === 11 &&
    stageType === 0 &&
    roomType === RoomType.ROOM_BOSS &&
    roomIndex !== GridRooms.ROOM_MEGA_SATAN_IDX
  ) {
    Isaac.Spawn(
      EntityType.ENTITY_EFFECT,
      EffectVariantCustom.ROOM_CLEAR_DELAY,
      0,
      misc.gridToPos(0, 0),
      Vector.Zero,
      null,
    );
    Isaac.DebugString(
      'Spawned the "Room Clear Delay Effect" custom entity (for The Lamb).',
    );
    // (this will not work to delay the room clearing if "debug 10" is turned on)

    // Track that we have defeated The Lamb (for the "Everything" race goal)
    g.run.killedLamb = true;
  }
}
*/
