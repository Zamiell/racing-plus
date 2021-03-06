import { BossID, EntityType } from "isaac-typescript-definitions";
import {
  getRandomArrayElement,
  inBossRoomOf,
  newRNG,
  removeAllMatchingEntities,
  repeat,
  spawnBoss,
} from "isaacscript-common";
import g from "../../globals";
import { config } from "../../modConfigMenu";
import v from "./v";

const VICTORY_LAP_BOSSES: ReadonlyArray<
  [entityType: EntityType, variant: int, subType: int]
> = [
  [19, 0, 0], // Larry Jr.
  [19, 0, 1], // Larry Jr. (green)
  [19, 0, 2], // Larry Jr. (blue)
  [19, 1, 0], // The Hollow
  [19, 1, 1], // The Hollow (green)
  [19, 1, 2], // The Hollow (grey)
  [19, 1, 3], // The Hollow (yellow)
  // - Don't include Tuff Twins (19.2) since it requires throwable bombs.
  // - Don't include The Shell (19.3) since it requires throwable bombs.
  [20, 0, 0], // Monstro
  [20, 0, 1], // Monstro (double red)
  [20, 0, 2], // Monstro (grey)
  [28, 0, 0], // Chub
  [28, 0, 1], // Chub (green)
  [28, 0, 2], // Chub (yellow)
  [28, 1, 0], // C.H.A.D.
  [28, 2, 0], // Carrion Queen
  [28, 2, 1], // Carrion Queen (pink)
  [36, 0, 0], // Gurdy
  [36, 0, 1], // Gurdy (dark)
  [43, 0, 0], // Monstro II
  [43, 0, 1], // Monstro II (red)
  [43, 1, 0], // Gish
  // - Don't include Mom (45.0) since she is a story boss.
  [62, 0, 0], // Pin
  [62, 0, 1], // Pin (black)
  [62, 1, 0], // Scolex
  [62, 2, 0], // Frail
  [62, 2, 1], // Frail (black)
  // - Don't include Wormwood (62.3) since it requires water.
  [63, 0, 0], // Famine
  [63, 0, 1], // Famine (blue)
  [64, 0, 0], // Pestilence
  [64, 0, 1], // Pestilence (white)
  [65, 0, 0], // War
  [65, 0, 1], // War (dark)
  [65, 1, 0], // Conquest
  [66, 0, 0], // Death
  [66, 0, 1], // Death (black)
  [67, 0, 0], // The Duke of Flies
  [67, 0, 1], // The Duke of Flies (green)
  [67, 0, 2], // The Duke of Flies (peach)
  [67, 1, 0], // The Husk
  [67, 1, 1], // The Husk (black)
  [67, 1, 2], // The Husk (grey)
  [68, 0, 0], // Peep
  [68, 0, 1], // Peep (yellow)
  [68, 0, 2], // Peep (green)
  [68, 1, 0], // The Bloat
  [68, 1, 1], // The Bloat (green)
  [69, 0, 0], // Loki
  [69, 1, 0], // Lokii
  [71, 0, 0], // Fistula
  [71, 0, 1], // Fistula (black)
  [71, 1, 0], // Teratoma
  [74, 0, 0], // Blastocyst
  // - Don't include Mom's Heart (78.0) / It Lives! (78.1) since they are story bosses.
  [79, 0, 0], // Gemini
  [79, 0, 1], // Gemini (green, detached)
  [79, 0, 2], // Gemini (blue)
  [79, 1, 0], // Steven
  [79, 2, 0], // The Blighted Ovum
  [81, 0, 0], // The Fallen
  // - Don't include Krampus (81.1) since he too common and he spawns an item.
  [82, 0, 0], // The Headless Horseman
  // - Don't include Satan (84.0) since he is a story boss.
  [97, 0, 0], // Mask of Infamy
  [99, 0, 0], // Gurdy Jr.
  [99, 0, 1], // Gurdy Jr. (double blue)
  [99, 0, 2], // Gurdy Jr. (orange)
  [100, 0, 0], // Widow
  [100, 0, 1], // Widow (black)
  [100, 0, 2], // Widow (pink)
  [100, 1, 0], // The Wretched
  [101, 0, 0], // Daddy Long Legs
  [101, 1, 0], // Triachnid
  // - Don't include Isaac (102.0) / Blue Baby (102.1) since they are story bosses.
  [237, 1, 0], // Gurglings
  [237, 1, 1], // Gurglings (double yellow)
  [237, 1, 2], // Gurglings (black)
  [237, 2, 0], // Turdling
  [260, 0, 0], // The Haunt
  [260, 0, 1], // The Haunt (black)
  [260, 0, 2], // The Haunt (pink)
  [261, 0, 0], // Dingle
  [261, 0, 1], // Dingle (red)
  [261, 0, 2], // Dingle (black)
  [261, 1, 0], // Dangle
  [262, 0, 0], // Mega Maw
  [262, 0, 1], // Mega Maw (red)
  [262, 0, 2], // Mega Maw (black)
  [263, 0, 0], // The Gate
  [263, 0, 1], // The Gate (red)
  [263, 0, 2], // The Gate (black)
  [264, 0, 0], // Mega Fatty
  [264, 0, 1], // Mega Fatty (red)
  [264, 0, 2], // Mega Fatty (yellow)
  [265, 0, 0], // The Cage
  [265, 0, 1], // The Cage (green)
  [265, 0, 2], // The Cage (double pink)
  [266, 0, 0], // Mama Gurdy
  [267, 0, 0], // Dark One
  [268, 0, 0], // The Adversary
  [269, 0, 0], // Polycephalus
  [269, 0, 1], // Polycephalus (red)
  [269, 0, 2], // Polycephalus (double pink)
  [269, 1, 0], // The Pile
  [270, 0, 0], // Mr. Fred
  [271, 0, 0], // Uriel
  [271, 1, 0], // Uriel (fallen)
  [272, 0, 0], // Gabriel
  [272, 1, 0], // Gabriel (fallen)
  // - Don't include The Lamb (273.0) since it is a story boss.
  // - Don't include Mega Satan (274.0) or Mega Satan 2 (275.0) since they are story bosses.
  [401, 0, 0], // The Stain
  [401, 0, 1], // The Stain (dark)
  [402, 0, 0], // Brownie
  [402, 0, 1], // Brownie (dark)
  [403, 0, 0], // The Forsaken
  [403, 0, 1], // The Forsaken (black)
  [404, 0, 0], // Little Horn
  [404, 0, 1], // Little Horn (grey)
  [404, 0, 2], // Little Horn (black)
  [405, 0, 0], // Rag Man
  [405, 0, 1], // Rag Man (orange)
  [405, 0, 2], // Rag Man (black)
  // - Don't include Hush (407.0) since it is a story boss.
  [409, 0, 0], // Rag Mega
  [410, 0, 0], // Sisters Vis
  [411, 0, 0], // Big Horn
  // - Don't include Delirium (412.0) since it is a story boss.
  [413, 0, 0], // The Matriarch
  [900, 0, 0], // Reap Creep
  [901, 0, 0], // Lil Blub
  [902, 0, 0], // The Rainmaker
  [903, 0, 0], // The Visage
  [904, 0, 0], // The Siren
  [905, 0, 0], // The Heretic
  // - Don't include Hornfel (906.0) since it changes the screen too much.
  // - Don't include Great Gideon (907.0) since it is invulnerable.
  [908, 0, 0], // Baby Plum
  [909, 0, 0], // The Scourge
  [910, 0, 0], // Chimera
  // - Don't include Rotgut since it requires leaving the current screen.
  // - Don't include Mother (912.0) it is a story boss.
  [913, 0, 0], // Min-Min
  [914, 0, 0], // Clog
  [915, 0, 0], // Singe
  [916, 0, 0], // Bumbino
  [917, 0, 0], // Colostomia
  [918, 0, 0], // Turdlet
  // - Don't include Raglich (919) since it is a cut boss from Repentance.
  [920, 0, 0], // Horny Boys
  [921, 0, 0], // Clutch
  // - Don't include Dogma (950.0) since it is a story boss.
  // - Don't include The Beast (951.0) since it is a story boss.
];

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  checkVictoryLapBossReplace();
}

function checkVictoryLapBossReplace() {
  const roomClear = g.r.IsClear();
  const roomSeed = g.r.GetSpawnSeed();
  const centerPos = g.r.GetCenterPos();
  const rng = newRNG(roomSeed);

  if (
    !g.raceVars.finished ||
    roomClear ||
    (!inBossRoomOf(BossID.BLUE_BABY) && !inBossRoomOf(BossID.THE_LAMB))
  ) {
    return;
  }

  // Replace Blue Baby or The Lamb with some random bosses (based on the number of Victory Laps).
  removeAllMatchingEntities(EntityType.ISAAC);
  removeAllMatchingEntities(EntityType.THE_LAMB);

  const numBosses = v.run.numVictoryLaps + 1;
  repeat(numBosses, () => {
    const randomBoss = getRandomArrayElement(VICTORY_LAP_BOSSES, rng);
    const [entityType, variant, subType] = randomBoss;
    spawnBoss(entityType, variant, subType, centerPos);
  });
}

export function shouldShowVictoryLaps(): boolean {
  return config.clientCommunication && v.run.numVictoryLaps > 0;
}

export function getNumVictoryLaps(): int {
  return v.run.numVictoryLaps;
}
