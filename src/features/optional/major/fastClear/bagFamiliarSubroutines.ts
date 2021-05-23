import g from "../../../../globals";
import { initRNG } from "../../../../misc";

/** The multiplier constants for each familiar were reversed from the game by blcd / Will. */
const MULTIPLIER_MAP = new Map<FamiliarVariant, [int, int]>([
  [FamiliarVariant.BOMB_BAG, [0.35, 0.42]],
  [FamiliarVariant.BOMB_BAG, [0.35, 0.42]],
  [FamiliarVariant.SACK_OF_PENNIES, [0.5, 0.57]],
  [FamiliarVariant.SACK_OF_PENNIES, [0.5, 0.57]],
  [FamiliarVariant.LITTLE_CHAD, [0.35, 0.42]],
  [FamiliarVariant.RELIC, [0.166, 0.125]],
  [FamiliarVariant.MYSTERY_SACK, [0.18, 0.22]],
  [FamiliarVariant.RUNE_BAG, [0.125, 0.166]],
  [FamiliarVariant.ACID_BABY, [0.125, 0.166]],
  [FamiliarVariant.SACK_OF_SACKS, [0.125, 0.166]],
]);

/**
 * This algorithm applies to most bag familiars (but not all).
 * The logic was reversed from the game by blcd / Will.
 */
export function shouldDropSomething(familiar: EntityFamiliar): boolean {
  const character = g.p.GetPlayerType();

  const multipliers = MULTIPLIER_MAP.get(familiar.Variant);
  if (multipliers === undefined) {
    error(
      `Failed to find the multipliers for familiar variant: ${familiar.Variant}`,
    );
  }
  const [multiplierNormal, multiplierBFFS] = multipliers;

  let multiplier = g.p.HasCollectible(CollectibleType.COLLECTIBLE_BFFS)
    ? multiplierBFFS
    : multiplierNormal;
  if (character === PlayerType.PLAYER_BETHANY) {
    multiplier *= 0.75;
  }

  return (
    math.floor((familiar.RoomClearCount + 1) * multiplier) >
    math.floor(familiar.RoomClearCount * multiplier)
  );
}

/**
 * Bag familiars that drop hearts are slightly more complicated,
 * as they also include logic to account for the Daemon's Tail trinket.
 */
export function shouldDropHeart(familiar: EntityFamiliar): boolean {
  return (
    !g.p.HasTrinket(TrinketType.TRINKET_DAEMONS_TAIL) ||
    (getCurrentFamiliarSeed(familiar) & 5) === 0
  );
}

/**
 * Since familiar drops need to be consistently seeded, we need a way to get a seed based on the
 * familiar. The InitSeed and the RoomClearCount of a familiar will persist after closing and
 * reopening the game. Thus, we can use this as a basis for deriving a unique seed.
 *
 * We use a simple scheme of starting with the InitSeed of the familiar and then incrementing it
 * based on the number of rooms it has cleared. (Again, we don't want to cache this data because it
 * will be lost if the run is exited.)
 */
export function getCurrentFamiliarSeed(familiar: EntityFamiliar): int {
  const rng = initRNG(familiar.InitSeed);

  for (let i = 0; i < familiar.RoomClearCount; i++) {
    rng.Next();
  }

  return rng.GetSeed();
}
