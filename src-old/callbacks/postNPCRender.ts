/*
// EntityType.ENTITY_PITFALL (291)
export function pitfall(npc: EntityNPC, _renderOffset: Vector): void {
  // Disable this feature in Boss Rooms (since Big Horn can spawn Pitfalls)
  const roomType = g.r.GetType();
  if (roomType === RoomType.ROOM_BOSS) {
    return;
  }

  const sprite = npc.GetSprite();
  if (sprite.IsPlaying("Disappear") && sprite.PlaybackSpeed === 1) {
    sprite.PlaybackSpeed = 3;
  }
}
*/
