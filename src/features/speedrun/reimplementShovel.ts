export function spawnTrapdoor(rng: RNG): void {
  // Get a random value between 0 and 1 that will determine what kind of trapdoor we'll get
  const trapdoorPercent = rng.RandomFloat();
  const player = Isaac.GetPlayer();
  const playerPosition = player.Position;
  const trapDoorType =
    trapdoorPercent <= 0.1
      ? GridEntityType.GRID_STAIRS
      : GridEntityType.GRID_TRAPDOOR;

  player.AnimateCollectible(
    CollectibleType.COLLECTIBLE_WE_NEED_TO_GO_DEEPER,
    "UseItem",
  );
  Isaac.GridSpawn(trapDoorType, 0, playerPosition, true);
}
