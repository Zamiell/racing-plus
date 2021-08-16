/*
export function main(): void {
  removeInvisibleEntities();
  checkRoomCleared();
  checkDDItems();
  checkKeeperHearts();
  checkItemPickup();
  checkCharacter();
  checkManualRechargeActive();
  checkMutantSpiderInnerEye();
  crownOfLight();
  checkLilithExtraIncubus();
  checkLudoSoftlock();
  checkWishbone();
  checkWalnut();
  fix9VoltSynergy();
  checkDisableControls();

  if (isCustomInputPressed("hotkeyAutofire")) {
    autofire.Toggle();
  }

  // Handle things for races
  racePostUpdate.Main();
  shadow.PostUpdate();

  // Handle things for multi-character speedruns
  speedrunPostUpdate.Main();

  // Handle things for the "Change Char Order" custom challenge
  changeCharOrder.PostUpdate();
}

// Keep track of the when the room is cleared
// and the total amount of rooms cleared on this run thus far
function checkRoomCleared() {
  const roomClear = g.r.IsClear();

  // Check the clear status of the room and compare it to what it was a frame ago
  if (roomClear === g.run.currentRoomClearState) {
    return;
  }

  g.run.currentRoomClearState = roomClear;

  if (!roomClear) {
    return;
  }

  if (!g.run.room.fastCleared) {
    Isaac.DebugString("Vanilla room clear detected!");
  }

  // Give a charge to the player's Schoolbag item
  schoolbag.AddCharge();
}

function checkDDItems() {
  const gameFrameCount = g.g.GetFrameCount();
  const roomType = g.r.GetType();
  const roomFrameCount = g.r.GetFrameCount();

  const collectibles = Isaac.FindByType(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_COLLECTIBLE,
  );
  let numDDItems = 0;
  for (const entity of collectibles) {
    const collectible = entity.ToPickup();
    if (collectible !== null && collectible.Price < 0) {
      numDDItems += 1;
    }
  }

  if (roomFrameCount === 1) {
    g.run.room.numDDItems = numDDItems;
    return;
  }

  if (numDDItems < g.run.room.numDDItems) {
    g.run.room.numDDItems = numDDItems;
    g.run.frameOfLastDD = gameFrameCount;
  }
}

// Fix The Battery + 9 Volt synergy (2/2)
function fix9VoltSynergy() {
  if (g.run.giveExtraCharge) {
    g.run.giveExtraCharge = false;
    g.p.SetActiveCharge(g.p.GetActiveCharge() + 1);
  }
}

function checkDisableControls() {
  if (g.run.disableControls) {
    g.run.disableControls = false;
    g.p.ControlsEnabled = false;
  }
}

*/
