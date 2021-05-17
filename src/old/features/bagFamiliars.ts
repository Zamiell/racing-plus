import g from "../globals";
import bagFamiliarFunctions from "./bagFamiliarFunctions";

export function incrementRoomsCleared(): void {
  // Local variables
  const incrementedMap = new Map<FamiliarVariant, boolean>();

  // Look through all of the player's familiars
  const familiars = Isaac.FindByType(
    EntityType.ENTITY_FAMILIAR,
    -1,
    -1,
    false,
    false,
  );
  for (const familiar of familiars) {
    // We only want to increment the rooms cleared variable once,
    // even we have multiple of the same familiar
    if (incrementedMap.has(familiar.Variant)) {
      continue;
    }
    incrementedMap.set(familiar.Variant, true);

    const vars = g.run.familiarVars.get(familiar.Variant);
    if (vars === undefined) {
      continue;
    }

    vars.roomsCleared += 1;
  }
}

// Emulate various familiars dropping things
// All of these formula were reverse engineered by blcd:
// https://bindingofisaacrebirth.gamepedia.com/User:Blcd/RandomTidbits#Pickup_Familiars
export function checkSpawn(): void {
  // Local variables
  let constant1 = 1.1; // For Little C.H.A.D., Bomb Bag, Acid Baby, Sack of Sacks
  let constant2 = 1.11; // For The Relic, Mystery Sack, Rune Bag
  if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_BFFS)) {
    constant1 = 1.2;
    constant2 = 1.15;
  }

  // Look through all of the player's familiars
  const entities = Isaac.FindByType(
    EntityType.ENTITY_FAMILIAR,
    -1,
    -1,
    false,
    false,
  );
  for (const entity of entities) {
    const familiar = entity.ToFamiliar();
    if (familiar !== null) {
      const bagFamiliarFunction = bagFamiliarFunctions.get(familiar.Variant);
      if (bagFamiliarFunction !== undefined) {
        const vars = g.run.familiarVars.get(familiar.Variant);
        if (vars === undefined) {
          error(
            `Failed to get the variables for familiar: ${familiar.Variant}`,
          );
        }
        bagFamiliarFunction(familiar, vars, constant1, constant2);
      }
    }
  }
}
