import g from "../../globals";

export function postEntityKillMom(entity: Entity): void {
  const room = g.r;
  const startSeed = g.seeds.GetStartSeed();
  const player = Isaac.GetPlayer();
  const variant = entity.Variant;

  if (!g.config.clientCommunication) {
    return;
  }

  if (
    g.race.status !== "in progress" &&
    g.race.myStatus !== "racing" &&
    g.race.goal !== "custom"
  ) {
    return;
  }

  // Add a check on Mom's foot only, otherwise the player would be granted 5 bombs
  if (variant === 10) {
    player.AddBombs(1);

    room.SpawnGridEntity(
      room.GetGridIndex(Vector(120, 400)),
      GridEntityType.GRID_ROCK_ALT2,
      0,
      startSeed,
      0,
    );
  }
}
