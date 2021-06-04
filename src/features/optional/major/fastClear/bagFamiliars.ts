import bagFamiliarFunctions from "./bagFamiliarFunctions";
import * as paschalCandle from "./paschalCandle";

// In order to make bag familiars drop things after we clear a room,
// we cannot simply increment the "familiar.RoomClearCount" variable,
// because it won't actually make the familiar drop anything
// Instead, we have to emulate the functionality of every familiar
// All of these formulas were reverse engineered by Blade:
// https://bindingofisaacrebirth.gamepedia.com/User:Blcd/RandomTidbits#Pickup_Familiars
export function clearedRoom(): void {
  // Look through all of the player's familiars
  const familiars = Isaac.FindByType(EntityType.ENTITY_FAMILIAR);
  for (const entity of familiars) {
    const familiar = entity.ToFamiliar();
    if (familiar !== null) {
      familiar.RoomClearCount += 1;
      checkForDrops(familiar);
      paschalCandle.clearedRoom(familiar);
    }
  }
}

function checkForDrops(familiar: EntityFamiliar) {
  const bagFamiliarFunction = bagFamiliarFunctions.get(familiar.Variant);
  if (bagFamiliarFunction !== undefined) {
    bagFamiliarFunction(familiar);
  }
}
