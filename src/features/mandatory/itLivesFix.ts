// Because of a bug with fast-clear, the door to It Lives! will not appear after defeating Mom on
// Mausoleum 2 or Gehenna 2
// If the player exits the room and re-enters, the door will appear, but it will be in an open state

export function postNewRoom(): void {
  /*
  if (shouldRemoveItLives()) {
    removeItLives();
  }
  */
}

/*
const MOMS_HEART_MAUSOLEUM_VARIANT = 6040;

function shouldRemoveItLives() {
  const stage = g.l.GetStage();
  const roomDesc = g.l.GetCurrentRoomDesc();
  const roomVariant = roomDesc.Data.Variant;
  const roomType = g.r.GetType();
  const fullKnives = Isaac.FindByType(
    EntityType.ENTITY_FAMILIAR,
    FamiliarVariant.KNIFE_FULL,
    -1,
    false,
    false,
  );

  return (
    stage === 6 &&
    roomType === RoomType.ROOM_BOSS &&
    roomVariant === MOMS_HEART_MAUSOLEUM_VARIANT &&
    fullKnives.length === 0
  );
}

function removeItLives() {
  // The player got here without properly completing the quest, so remove the boss
  const momsHearts = Isaac.FindByType(
    EntityType.ENTITY_MOMS_HEART,
    -1,
    -1,
    false,
    true,
  );
  for (const momsHeart of momsHearts) {
    momsHeart.Remove();
    g.p.AnimateSad();
  }
}
*/
