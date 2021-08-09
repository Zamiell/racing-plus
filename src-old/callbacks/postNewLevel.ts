/*

function newLevel() {
  // Reset the RNG of some items that should be seeded per floor
  const stageSeed = g.seeds.GetStageSeed(stage);
  g.RNGCounter.teleport = stageSeed;
  g.RNGCounter.undefined = stageSeed;
  g.RNGCounter.telepills = stageSeed;
  for (let i = 0; i < 100; i++) {
    // Increment the RNG 100 times so that players cannot use knowledge of Teleport! teleports
    // to determine where the Telepills destination will be
    g.RNGCounter.telepills = misc.incrementRNG(g.RNGCounter.telepills);
  }
}

*/
