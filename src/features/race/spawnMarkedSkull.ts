import g from "../../globals";

export function postEntityKillMom(entity: Entity): void {
  const startSeed = g.seeds.GetStartSeed();
  const player = Isaac.GetPlayer();
  const variant = entity.Variant;

  if (!g.config.clientCommunication) {
    return;
  }

  if (
    g.race.status !== "in progress" ||
    g.race.myStatus !== "racing" ||
    g.race.goal !== "The Beast"
  ) {
    return;
  }

  // Add a check on Mom's foot only, otherwise the player would be granted 5 bombs
  // Vector(120, 400) is an empty spot on every Mom layout, the skull will always spawn
  if (variant === MomVariant.STOMP) {
    player.AddBombs(1);

    g.r.SpawnGridEntity(
      g.r.GetGridIndex(Vector(120, 400)),
      GridEntityType.GRID_ROCK_ALT2,
      0,
      startSeed,
      0,
    );
  }
}
