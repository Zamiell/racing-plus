import g from "../../globals";
import bagFamiliarFunctions from "./bagFamiliarFunctions";

// In order to make bag familiars drop things after we clear a room,
// we cannot simply increment the "familiar.RoomClearCount" variable,
// because it won't actually make the familiar drop anything
// Instead, we have to emulate the functionality of every familiar
// All of these formulas were reverse engineered by blcd:
// https://bindingofisaacrebirth.gamepedia.com/User:Blcd/RandomTidbits#Pickup_Familiars
export function clearedRoom(): void {
  // Look through all of the player's familiars
  const familiars = Isaac.FindByType(
    EntityType.ENTITY_FAMILIAR,
    -1,
    -1,
    false,
    false,
  );
  for (const entity of familiars) {
    const familiar = entity.ToFamiliar();
    if (familiar !== null) {
      familiar.RoomClearCount += 1;
      checkForDrops(familiar);
      paschalCandle(familiar);
    }
  }
}

function checkForDrops(familiar: EntityFamiliar) {
  const bagFamiliarFunction = bagFamiliarFunctions.get(familiar.Variant);
  if (bagFamiliarFunction !== undefined) {
    bagFamiliarFunction(familiar);
  }
}

function paschalCandle(familiar: EntityFamiliar) {
  if (familiar.Variant !== FamiliarVariant.PASCHAL_CANDLE) {
    return;
  }

  const oldCounters = g.run.fastClear.paschalCandleCounters;
  g.run.fastClear.paschalCandleCounters += 1;
  const maxCounters = 5;
  if (g.run.fastClear.paschalCandleCounters > maxCounters) {
    g.run.fastClear.paschalCandleCounters = maxCounters;
  }

  if (oldCounters !== g.run.fastClear.paschalCandleCounters) {
    g.p.AddCacheFlags(CacheFlag.CACHE_FIREDELAY);
    g.p.EvaluateItems();
  }
}
