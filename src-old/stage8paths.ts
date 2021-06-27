/*
enum ItLivesSituation {
  Neither,
  HeavenDoor,
  Trapdoor,
  Both,
}

export function spawn(entity: Entity): void {
  const stage = g.l.GetStage();
  const centerPos = g.r.GetCenterPos();
  const challenge = Isaac.GetChallenge();

  // Define positions for the trapdoor and heaven door (recorded from vanilla)
  let posCenter = Vector(320, 280);
  let posCenterLeft = Vector(280, 280);
  let posCenterRight = Vector(360, 280);
  if (stage === 9) {
    // The positions are different for the Blue Womb; they are more near the top wall
    posCenter = Vector(600, 280);
    posCenterLeft = Vector(560, 280);
    posCenterRight = Vector(640, 280);
  }

  // Figure out if we need to spawn either a trapdoor, a heaven door, or both
  let situation = getItLivesSituation(entity);

  // Handle special things for Season 7
  if (
    challenge === ChallengeCustom.R7_SEASON_7 &&
    entity.Type === EntityType.ENTITY_MOMS_HEART
  ) {
    // Spawn a big chest
    // (which will get replaced with either a checkpoint or a trophy on the next frame)
    if (g.season7.remainingGoals.includes("It Lives!")) {
      Isaac.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_BIGCHEST,
        0,
        centerPos,
        Vector.Zero,
        null,
      );
    }

    // Perform some path validation for Season 7
    if (
      situation !== ItLivesSituation.NEITHER &&
      !g.season7.remainingGoals.includes("Blue Baby") &&
      !g.season7.remainingGoals.includes("The Lamb") &&
      !g.season7.remainingGoals.includes("Mega Satan") &&
      !g.season7.remainingGoals.includes("Ultra Greed")
    ) {
      situation = ItLivesSituation.NEITHER;
    }
  }

  // Do the appropriate action depending on the situation
  if (situation === ItLivesSituation.NEITHER) {
    Isaac.DebugString(
      "It Lives! or Hush killed; situation 0 - neither up nor down.",
    );
  } else if (situation === ItLivesSituation.BEAM_OF_LIGHT) {
    // Spawn a heaven door, a.k.a. Heaven Door (1000.39)
    // It will get replaced with the fast-travel version on this frame
    // Make the spawner entity the player so that we can distinguish it from the vanilla heaven door
    Isaac.Spawn(
      EntityType.ENTITY_EFFECT,
      EffectVariant.HEAVEN_LIGHT_DOOR,
      0,
      posCenter,
      Vector.Zero,
      g.p,
    );
    Isaac.DebugString("It Lives! || Hush killed; situation 1 - only up.");
  } else if (situation === ItLivesSituation.TRAPDOOR) {
    // Spawn a trapdoor (it will get replaced with the fast-travel version on this frame)
    Isaac.GridSpawn(GridEntityType.GRID_TRAPDOOR, 0, posCenter, true);
    Isaac.DebugString("It Lives! || Hush killed; situation 2 - only down.");
  } else if (situation === ItLivesSituation.BOTH) {
    // Spawn both a trapdoor and a heaven door
    // They will get replaced with the fast-travel versions on this frame
    // Make the spawner entity the player so that we can distinguish it from the vanilla heaven door
    Isaac.GridSpawn(GridEntityType.GRID_TRAPDOOR, 0, posCenterLeft, true);
    Isaac.Spawn(
      EntityType.ENTITY_EFFECT,
      EffectVariant.HEAVEN_LIGHT_DOOR,
      0,
      posCenterRight,
      Vector.Zero,
      g.p,
    );
    Isaac.DebugString("It Lives! || Hush killed; situation 3 - up && down.");
  }
}

function getItLivesSituation(entity: Entity) {
  const challenge = Isaac.GetChallenge();

  if (
    // Some seasons always go to the Cathedral / The Chest
    challenge === ChallengeCustom.R15_VANILLA ||
    challenge === ChallengeCustom.R9_SEASON_1 ||
    challenge === ChallengeCustom.R14_SEASON_1 ||
    challenge === ChallengeCustom.R7_SEASON_4 ||
    challenge === ChallengeCustom.R7_SEASON_5 ||
    challenge === ChallengeCustom.R7_SEASON_8 ||
    challenge === ChallengeCustom.R7_SEASON_9 ||
    // Races to Blue Baby go to the Cathedral / The Chest
    (g.race.status === "in progress" && g.race.myStatus === "racing" && g.race.goal === "Blue Baby")
  ) {
    return ItLivesSituation.BEAM_OF_LIGHT;
  }

  if (
    // Season 2 speedruns always goes to Sheol / the Dark Room
    challenge === ChallengeCustom.R7_SEASON_2 ||
    // Races to The Lamb go to Sheol / the Dark Room
    (g.race.status === "in progress" && g.race.myStatus === "racing" && g.race.goal === "The Lamb")
  ) {
    return ItLivesSituation.TRAPDOOR;
  }

  if (
    // Some speedruns alternate between Cathedral / The Chest && Sheol / the Dark Room,
    // starting with Cathedral / The Chest
    challenge === ChallengeCustom.R7_SEASON_3 ||
    challenge === ChallengeCustom.R7_SEASON_6
  ) {
    return g.speedrun.characterNum % 2 === 0
      ? ItLivesSituation.TRAPDOOR
      : ItLivesSituation.BEAM_OF_LIGHT;
  }

  if (
    ((g.race.status === "in progress" && g.race.myStatus === "racing" && g.race.goal === "Hush") ||
      challenge === ChallengeCustom.R7_SEASON_7) &&
    entity.Type === EntityType.ENTITY_HUSH
  ) {
    // If Hush is the goal,
    // don't spawn any paths in case the player would accidentally walk into them
    return ItLivesSituation.NEITHER;
  }

  if (g.p.HasTrinket(TrinketType.TRINKET_MYSTERIOUS_PAPER)) {
    // On every frame, the Mysterious Paper trinket will randomly give The Polaroid or The Negative,
    // so since it is impossible to determine their actual photo status,
    // just give the player a choice between the directions
    return ItLivesSituation.BOTH;
  }

  if (
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_POLAROID) &&
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_NEGATIVE)
  ) {
    // The player has both photos (which can occur with Eden or in a diversity race)
    // So, give the player a choice between the directions
    return ItLivesSituation.BOTH;
  }

  if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_POLAROID)) {
    // The player has The Polaroid, so send them to Cathedral
    return ItLivesSituation.BEAM_OF_LIGHT;
  }

  if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_NEGATIVE)) {
    // The player has The Negative, so send them to Sheol
    return ItLivesSituation.TRAPDOOR;
  }

  // The player does not have either The Polaroid or The Negative,
  // so give them a choice between the directions
  return ItLivesSituation.BOTH;
}
*/
