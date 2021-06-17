/*
// Called from the PostUpdate callback (the "CheckEntities.EntityRaceTrophy()" function)
export function victoryLap(): void {
  const gameFrameCount = g.g.GetFrameCount();

  // Remove the final place graphic if it is showing
  sprites.init("place2", "");

  // Make them float upwards
  // (the code is loosely copied from the "FastTravel.CheckTrapdoorEnter()" function)
  g.run.trapdoor.state = FastTravelState.PLAYER_ANIMATION;
  g.run.trapdoor.upwards = true;
  g.run.trapdoor.frame = gameFrameCount + 16;
  g.p.ControlsEnabled = false;
  g.p.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE; // 0
  // (this is necessary so that enemy attacks don't move the player while they are doing the jumping
  // animation)
  g.p.Velocity = Vector.Zero; // Remove all of the player's momentum
  g.p.PlayExtraAnimation("LightTravel");
  g.run.level.stage -= 1;
  // This is needed or else state 5 will not correctly trigger
  // (because the PostNewRoom callback will occur 3 times instead of 2)
  g.raceVars.victoryLaps += 1;
}
*/
