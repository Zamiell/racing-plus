import g from "../../../globals";

const SPLITTING_ENTITIES = [
  // Frowning Gaper, Gaper, and Flaming Gaper have a chance to split into
  // Gusher (11.0) or Pacer (11.1)
  EntityType.ENTITY_GAPER, // 10
  // Mulligan splits into 4 flies; nothing will spawn if the kill damage is high enough
  EntityType.ENTITY_MULLIGAN, // 16
  EntityType.ENTITY_LARRYJR, // 19
  // Hive splits into 4 flies and Drowned Hive splits into 2 Drowned Chargers
  EntityType.ENTITY_HIVE, // 22
  EntityType.ENTITY_GLOBIN, // 24
  // Drowned Boom Flies split into a Drowned Charger
  EntityType.ENTITY_BOOMFLY, // 25
  EntityType.ENTITY_ENVY, // 51
  // Membrain splits into 2 Brains (32.0) and Mama Guts splits into 2 Guts (40.0)
  EntityType.ENTITY_MEMBRAIN, // 57
  EntityType.ENTITY_FISTULA_BIG, // 71 (this includes Teratoma)
  EntityType.ENTITY_FISTULA_MEDIUM, // 72 (this includes Teratoma)
  EntityType.ENTITY_FISTULA_SMALL, // 73 (this includes Teratoma)
  EntityType.ENTITY_BLASTOCYST_BIG, // 74
  EntityType.ENTITY_BLASTOCYST_MEDIUM, // 75
  EntityType.ENTITY_BLASTOCYST_SMALL, // 76
  // Moter splits into 2 Attack Flies (18.0)
  EntityType.ENTITY_MOTER, // 80
  EntityType.ENTITY_FALLEN, // 81
  // Gurgles have a chance to split into a Splasher (238.0)
  EntityType.ENTITY_GURGLE, // 87
  // Hangers split into an Attack Fly (18.0)
  EntityType.ENTITY_HANGER, // 90
  // Swarmers split into a Boom Fly (25.0)
  EntityType.ENTITY_SWARMER, // 91
  // Big Spiders split into 2 Spiders (85.0)
  EntityType.ENTITY_BIGSPIDER, // 94
  // The Hush Blue Baby splits into Hush
  EntityType.ENTITY_ISAAC, // 102
  // Nests have a chance to split into a Trite (29.1) or Big Spider (94.0)
  EntityType.ENTITY_NEST, // 205
  // Pale Fatties have a chance to split into a Blubber (210.0)
  EntityType.ENTITY_FATTY, // 208
  // Fat Sacks have a chance to split into a Blubber (210.0)
  EntityType.ENTITY_FAT_SACK, // 209
  // Blubbers have a chance to split into a Half Sack (211.0)
  EntityType.ENTITY_BLUBBER, // 210
  // Swingers have a chance to split into a Maw (26.0) if you kill the body,
  // or a Globin (24.0) if you kill the head
  EntityType.ENTITY_SWINGER, // 216
  // Squirts split into 2 Dips (217.0) and Dark Squirts split into 2 Clots (15.1)
  EntityType.ENTITY_SQUIRT, // 220
  // Rotties split into a Bony (227.0)
  EntityType.ENTITY_SKINNY, // 226
  // Dingas split into two Squirts (220.0)
  EntityType.ENTITY_DINGA, // 223
  // Grubs split into a random Maggot
  EntityType.ENTITY_GRUB, // 239
  // Conjoined Fatties split into a Fatty (208.0)
  EntityType.ENTITY_CONJOINED_FATTY, // 257
  // Black Globins split into Black Globin's Head (279.0) and Black Globin's Body (280.0)
  EntityType.ENTITY_BLACK_GLOBIN, // 278
  // Mega Clotties split into 2 Clotties (15.0)
  EntityType.ENTITY_MEGA_CLOTTY, // 282
  // Mom's Dead Hands split into 2 Spiders (85.0)
  EntityType.ENTITY_MOMS_DEAD_HAND, // 287
  // Meatballs split into a Host (27.0)
  EntityType.ENTITY_MEATBALL, // 290
  // Blisters split into a Sack (30.2)
  EntityType.ENTITY_BLISTER, // 303
  // Brownie splits into a Dangle (217.2)
  EntityType.ENTITY_BROWNIE, // 402
  // Pustule spawn Small Maggots (853.0)
  EntityType.ENTITY_PUSTULE, // 861
];

const SPLITTING_CHAMPIONS = [
  ChampionColor.PULSE_GREEN, // 15
  ChampionColor.FLY_PROTECTED, // 17
  ChampionColor.SIZE_PULSE, // 21
  ChampionColor.RAINBOW, // 25
];

// ModCallbacks.MC_POST_NPC_INIT (27)
export function postNPCInitEye(npc: EntityNPC): void {
  if (!g.config.fastClear2) {
    return;
  }

  deleteFriendlyEye(npc);
}

function deleteFriendlyEye(npc: EntityNPC) {
  // After It Lives! dies, we set an entity flag of FLAG_FRIENDLY to fast-clear the room
  // However, this has the side effect of making the Eyes that she spawns as part of the encounter
  // friendly eyes
  // Delete them if this is the case
  if (shouldDeleteFriendlyEye()) {
    npc.Remove();
  }
}

function shouldDeleteFriendlyEye() {
  // "npc.HasEntityFlags(EntityFlag.FLAG_FRIENDLY)" is equal to false here
  // "itLives.HasEntityFlags(EntityFlag.FLAG_FRIENDLY)" is also equal to false
  // "itLives.IsDead()" is equal to false
  // Instead, we simply record when It Lives! is dead
  return g.run.room.fastClear2.itLivesDead;
}

// ModCallbacks.MC_POST_PROJECTILE_INIT (43)
export function postProjectileInit(projectile: EntityProjectile): void {
  if (!g.config.fastClear2) {
    return;
  }

  deleteItLivesProjectile(projectile);
}

function deleteItLivesProjectile(projectile: EntityProjectile) {
  // It Lives! will spawn a tear burst that is friendly to the player, so we need to fix this
  // For some reason, "projectile.HasEntityFlag(EntityFlag.FLAG_FRIENDLY)" is false here
  // Furthermore, if we remove the flag on the first frame of the PostTearUpdate callback,
  // it won't do anything
  // Instead, delete the projectile and spawn a new one in its place
  if (
    g.run.room.fastClear2.itLivesDead &&
    projectile.SpawnerType === EntityType.ENTITY_MOMS_HEART
  ) {
    projectile.Remove();
    g.g.Spawn(
      projectile.Type,
      projectile.Variant,
      projectile.Position,
      projectile.Velocity,
      null,
      projectile.SubType,
      projectile.InitSeed,
    );
  }
}

// ModCallbacks.MC_POST_ENTITY_KILL (68)
export function postEntityKill(entity: Entity): void {
  if (!g.config.fastClear2) {
    return;
  }

  const npc = entity.ToNPC();
  if (npc === null) {
    return;
  }

  setItLivesDead(npc);
  addFriendlyFlag(npc);
}

function setItLivesDead(npc: EntityNPC) {
  if (npc.Type === EntityType.ENTITY_MOMS_HEART) {
    g.run.room.fastClear2.itLivesDead = true;
  }
}

function addFriendlyFlag(npc: EntityNPC) {
  if (!SPLITTING_ENTITIES.includes(npc.Type) && !isSplittingChampion(npc)) {
    npc.AddEntityFlags(EntityFlag.FLAG_FRIENDLY);
  }
}

function isSplittingChampion(npc: EntityNPC) {
  const isChampion = npc.IsChampion();
  const championColor = npc.GetChampionColorIdx();
  return isChampion && SPLITTING_CHAMPIONS.includes(championColor);
}
