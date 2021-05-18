import g from "../../globals";
import { initRNG } from "../../misc";
import bagFamiliarFunctions from "./bagFamiliarFunctions";

// In order to make bag familiars drop things after we clear a room,
// we cannot simply increment the "familiar.RoomClearCount" variable,
// because it won't actually make the familiar drop anything
// Instead, we have to emulate the functionality of every familiar
// All of these formulas were reverse engineered by blcd:
// https://bindingofisaacrebirth.gamepedia.com/User:Blcd/RandomTidbits#Pickup_Familiars
export function clearedRoom(): void {
  let constant1 = 1.1; // For Little C.H.A.D., Bomb Bag, Acid Baby, Sack of Sacks
  let constant2 = 1.11; // For The Relic, Mystery Sack, Rune Bag
  if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_BFFS)) {
    constant1 = 1.2;
    constant2 = 1.15;
  }

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
      checkForDrops(familiar, constant1, constant2);
      paschalCandle(familiar);
    }
  }
}

function checkForDrops(
  familiar: EntityFamiliar,
  constant1: float,
  constant2: float,
) {
  const startSeed = g.seeds.GetStartSeed();
  const bagFamiliarFunction = bagFamiliarFunctions.get(familiar.Variant);
  if (bagFamiliarFunction !== undefined) {
    const data = familiar.GetData();
    if (data.racingPlusRNG === null) {
      data.racingPlusRNG = initRNG(startSeed);
    }
    bagFamiliarFunction(
      familiar,
      data.racingPlusRNG as RNG,
      constant1,
      constant2,
    );
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
