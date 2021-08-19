import g from "../../globals";

export function spawnTrapdoor(rng: RNG, player: EntityPlayer): void {
  const stage = g.l.GetStage();

  const trapdoorChance = rng.RandomFloat();
  const gridEntityType =
    trapdoorChance <= 0.1
      ? GridEntityType.GRID_STAIRS
      : GridEntityType.GRID_TRAPDOOR;

  player.AnimateCollectible(
    CollectibleType.COLLECTIBLE_WE_NEED_TO_GO_DEEPER,
    "UseItem",
  );

  // Only spawn crawlspaces above stage 8
  if (stage > 8 && trapdoorChance > 0.1) {
    return;
  }

  Isaac.GridSpawn(gridEntityType, 0, player.Position, true);
}
