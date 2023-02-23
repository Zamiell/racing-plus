import {
  AngelVariant,
  BloatSubType,
  BossID,
  BrownieSubType,
  CageSubType,
  CarrionQueenSubType,
  ChubSubType,
  ChubVariant,
  DaddyLongLegsVariant,
  DeathSubType,
  DingleSubType,
  DingleVariant,
  DukeOfFliesSubType,
  DukeOfFliesVariant,
  EntityType,
  FallenVariant,
  FamineSubType,
  FistulaSubType,
  FistulaVariant,
  ForsakenSubType,
  FrailSubType,
  GateSubType,
  GeminiSubType,
  GeminiVariant,
  GurdyJrSubType,
  GurdySubType,
  GurglingSubType,
  GurglingVariant,
  HauntSubType,
  HauntVariant,
  HollowSubType,
  HuskSubType,
  LarryJrSubType,
  LarryJrVariant,
  LittleHornSubType,
  LokiVariant,
  MegaFattySubType,
  MegaMawSubType,
  Monstro2SubType,
  Monstro2Variant,
  MonstroSubType,
  PeepSubType,
  PeepVariant,
  PestilenceSubType,
  PinSubType,
  PinVariant,
  PolycephalusSubType,
  PolycephalusVariant,
  RagManSubType,
  StainSubType,
  WarSubType,
  WarVariant,
  WidowSubType,
  WidowVariant,
} from "isaac-typescript-definitions";
import {
  game,
  getRandomArrayElement,
  inBossRoomOf,
  newRNG,
  removeAllMatchingEntities,
  repeat,
  spawnBoss,
} from "isaacscript-common";
import { g } from "../../globals";
import { config } from "../../modConfigMenu";
import { v } from "./v";

/** Contains tuples of: `[entityType: EntityType, variant: int, subType: int]` */
const VICTORY_LAP_BOSSES = [
  [EntityType.LARRY_JR, LarryJrVariant.LARRY_JR, LarryJrSubType.NORMAL], // 19.0.0
  [EntityType.LARRY_JR, LarryJrVariant.LARRY_JR, LarryJrSubType.GREEN], // 19.0.1
  [EntityType.LARRY_JR, LarryJrVariant.LARRY_JR, LarryJrSubType.BLUE], // 19.0.2
  [EntityType.LARRY_JR, LarryJrVariant.THE_HOLLOW, HollowSubType.NORMAL], // 19.1.0
  [EntityType.LARRY_JR, LarryJrVariant.THE_HOLLOW, HollowSubType.GREEN], // 19.1.1
  [EntityType.LARRY_JR, LarryJrVariant.THE_HOLLOW, HollowSubType.BLACK], // 19.1.2
  [EntityType.LARRY_JR, LarryJrVariant.THE_HOLLOW, HollowSubType.YELLOW], // 19.1.3
  // - Don't include Tuff Twins (19.2) since it requires throwable bombs.
  // - Don't include The Shell (19.3) since it requires throwable bombs.
  [EntityType.MONSTRO, 0, MonstroSubType.NORMAL], // 20.0.0
  [EntityType.MONSTRO, 0, MonstroSubType.RED], // 20.0.1
  [EntityType.MONSTRO, 0, MonstroSubType.GREY], // 20.0.2
  [EntityType.CHUB, ChubVariant.CHUB, ChubSubType.NORMAL], // 28.0.0
  [EntityType.CHUB, ChubVariant.CHUB, ChubSubType.BLUE], // 28.0.1
  [EntityType.CHUB, ChubVariant.CHUB, ChubSubType.ORANGE], // 28.0.2
  [EntityType.CHUB, ChubVariant.CHAD, 0], // 28.1.0
  [EntityType.CHUB, ChubVariant.CARRION_QUEEN, CarrionQueenSubType.NORMAL], // 28.2.0
  [EntityType.CHUB, ChubVariant.CARRION_QUEEN, CarrionQueenSubType.PINK], // 28.2.1
  [EntityType.GURDY, 0, GurdySubType.NORMAL], // 36.0.0
  [EntityType.GURDY, 0, GurdySubType.GREEN], // 36.0.1
  [EntityType.MONSTRO_2, Monstro2Variant.MONSTRO_2, Monstro2SubType.NORMAL], // 43.0.0
  [EntityType.MONSTRO_2, Monstro2Variant.MONSTRO_2, Monstro2SubType.RED], // 43.0.1
  [EntityType.MONSTRO_2, Monstro2Variant.GISH, 0], // 43.1.0
  // - Don't include Mom (45.0) since she is a story boss.
  [EntityType.PIN, PinVariant.PIN, PinSubType.NORMAL], // 62.0.0
  [EntityType.PIN, PinVariant.PIN, PinSubType.GREY], // 62.0.1
  [EntityType.PIN, PinVariant.SCOLEX, 0], // 62.1.0
  [EntityType.PIN, PinVariant.FRAIL, FrailSubType.NORMAL], // 62.2.0
  [EntityType.PIN, PinVariant.FRAIL, FrailSubType.BLACK], // 62.2.1
  // - Don't include Wormwood (62.3) since it requires water.
  [EntityType.FAMINE, 0, FamineSubType.NORMAL], // 63.0.0
  [EntityType.FAMINE, 0, FamineSubType.BLUE], // 63.0.1
  [EntityType.PESTILENCE, 0, PestilenceSubType.NORMAL], // 64.0.0
  [EntityType.PESTILENCE, 0, PestilenceSubType.GREY], // 64.0.1
  [EntityType.WAR, WarVariant.WAR, WarSubType.NORMAL], // 65.0.0
  [EntityType.WAR, WarVariant.WAR, WarSubType.GREY], // 65.0.1
  [EntityType.WAR, WarVariant.CONQUEST, 0], // 65.1.0
  [EntityType.DEATH, 0, DeathSubType.NORMAL], // 66.0.0
  [EntityType.DEATH, 0, DeathSubType.BLACK], // 66.0.1
  [
    EntityType.DUKE_OF_FLIES,
    DukeOfFliesVariant.DUKE_OF_FLIES,
    DukeOfFliesSubType.NORMAL,
  ], // 67.0.0
  [
    EntityType.DUKE_OF_FLIES,
    DukeOfFliesVariant.DUKE_OF_FLIES,
    DukeOfFliesSubType.GREEN,
  ], // 67.0.1
  [
    EntityType.DUKE_OF_FLIES,
    DukeOfFliesVariant.DUKE_OF_FLIES,
    DukeOfFliesSubType.ORANGE,
  ], // 67.0.2
  [EntityType.DUKE_OF_FLIES, DukeOfFliesVariant.THE_HUSK, HuskSubType.NORMAL], // 67.1.0
  [EntityType.DUKE_OF_FLIES, DukeOfFliesVariant.THE_HUSK, HuskSubType.BLACK], // 67.1.1
  [EntityType.DUKE_OF_FLIES, DukeOfFliesVariant.THE_HUSK, HuskSubType.RED], // 67.1.2
  [EntityType.PEEP, PeepVariant.PEEP, PeepSubType.NORMAL], // 68.0.0
  [EntityType.PEEP, PeepVariant.PEEP, PeepSubType.YELLOW], // 68.0.1
  [EntityType.PEEP, PeepVariant.PEEP, PeepSubType.CYAN], // 68.0.2
  [EntityType.PEEP, PeepVariant.BLOAT, BloatSubType.NORMAL], // 68.1.0
  [EntityType.PEEP, PeepVariant.BLOAT, BloatSubType.GREEN], // 68.1.1
  [EntityType.LOKI, LokiVariant.LOKI, 0], // 69.0.0
  [EntityType.LOKI, LokiVariant.LOKII, 0], // 69.1.0
  [EntityType.FISTULA_BIG, FistulaVariant.FISTULA, FistulaSubType.NORMAL], // 71.0.0
  [EntityType.FISTULA_BIG, FistulaVariant.FISTULA, FistulaSubType.GREY], // 71.0.1
  [EntityType.FISTULA_BIG, FistulaVariant.TERATOMA, 0], // 71.1.0
  [EntityType.BLASTOCYST_BIG, 0, 0], // 74.0.0 Blastocyst
  // - Don't include Mom's Heart (78.0) / It Lives! (78.1) since they are story bosses.
  [EntityType.GEMINI, GeminiVariant.GEMINI, GeminiSubType.NORMAL], // 79.0.0
  [EntityType.GEMINI, GeminiVariant.GEMINI, GeminiSubType.GREEN], // 79.0.1
  [EntityType.GEMINI, GeminiVariant.GEMINI, GeminiSubType.BLUE], // 79.0.2
  [EntityType.GEMINI, GeminiVariant.STEVEN, 0], // 79.1.0
  [EntityType.GEMINI, GeminiVariant.BLIGHTED_OVUM, 0], // 79.2.0
  [EntityType.FALLEN, FallenVariant.FALLEN, 0], // 81.0.0
  // - Don't include Krampus (81.1) since he too common and he spawns an item.
  [EntityType.HEADLESS_HORSEMAN, 0, 0], // 82.0.0
  // - Don't include Satan (84.0) since he is a story boss.
  [EntityType.MASK_OF_INFAMY, 0, 0], // 97.0.0
  [EntityType.GURDY_JR, 0, GurdyJrSubType.NORMAL], // 99.0.0
  [EntityType.GURDY_JR, 0, GurdyJrSubType.BLUE], // 99.0.1
  [EntityType.GURDY_JR, 0, GurdyJrSubType.YELLOW], // 99.0.2
  [EntityType.WIDOW, WidowVariant.WIDOW, WidowSubType.NORMAL], // 100.0.0
  [EntityType.WIDOW, WidowVariant.WIDOW, WidowSubType.BLACK], // 100.0.1
  [EntityType.WIDOW, WidowVariant.WIDOW, WidowSubType.PINK], // 100.0.2
  [EntityType.WIDOW, WidowVariant.THE_WRETCHED, 0], // 100.1.0
  [EntityType.DADDY_LONG_LEGS, DaddyLongLegsVariant.DADDY_LONG_LEGS, 0], // 101.0.0
  [EntityType.DADDY_LONG_LEGS, DaddyLongLegsVariant.TRIACHNID, 0], // 101.1.0
  // - Don't include Isaac (102.0) or Blue Baby (102.1) since they are story bosses.
  [EntityType.GURGLING, GurglingVariant.GURGLING_BOSS, GurglingSubType.NORMAL], // 237.1.0
  [EntityType.GURGLING, GurglingVariant.GURGLING_BOSS, GurglingSubType.YELLOW], // 237.1.1
  [EntityType.GURGLING, GurglingVariant.GURGLING_BOSS, GurglingSubType.BLACK], // 237.1.2
  [EntityType.GURGLING, GurglingVariant.TURDLING, 0], // 237.2.0
  [EntityType.THE_HAUNT, HauntVariant.HAUNT, HauntSubType.NORMAL], // 260.0.0
  [EntityType.THE_HAUNT, HauntVariant.HAUNT, HauntSubType.BLACK], // 260.0.1
  [EntityType.THE_HAUNT, HauntVariant.HAUNT, HauntSubType.PINK], // 260.0.2
  [EntityType.DINGLE, DingleVariant.DINGLE, DingleSubType.NORMAL], // 261.0.0
  [EntityType.DINGLE, DingleVariant.DINGLE, DingleSubType.RED], // 261.0.1 (red)
  [EntityType.DINGLE, DingleVariant.DINGLE, DingleSubType.BLACK], // 261.0.2 (black)
  [EntityType.DINGLE, DingleVariant.DANGLE, 0], // 261.1.0
  [EntityType.MEGA_MAW, 0, MegaMawSubType.NORMAL], // 262.0.0
  [EntityType.MEGA_MAW, 0, MegaMawSubType.RED], // 262.0.1
  [EntityType.MEGA_MAW, 0, MegaMawSubType.BLACK], // 262.0.2
  [EntityType.GATE, 0, GateSubType.NORMAL], // 263.0.0
  [EntityType.GATE, 0, GateSubType.RED], // 263.0.1
  [EntityType.GATE, 0, GateSubType.BLACK], // 263.0.2
  [EntityType.MEGA_FATTY, 0, MegaFattySubType.NORMAL], // 264.0.0
  [EntityType.MEGA_FATTY, 0, MegaFattySubType.RED], // 264.0.1
  [EntityType.MEGA_FATTY, 0, MegaFattySubType.BROWN], // 264.0.2
  [EntityType.CAGE, 0, CageSubType.NORMAL], // 265.0.0
  [EntityType.CAGE, 0, CageSubType.GREEN], // 265.0.1
  [EntityType.CAGE, 0, CageSubType.PINK], // 265.0.2
  [EntityType.MAMA_GURDY, 0, 0], // 266.0.0
  [EntityType.DARK_ONE, 0, 0], // 267.0.0
  [EntityType.ADVERSARY, 0, 0], // 268.0.0
  [
    EntityType.POLYCEPHALUS,
    PolycephalusVariant.POLYCEPHALUS,
    PolycephalusSubType.NORMAL,
  ], // 269.0.0
  [
    EntityType.POLYCEPHALUS,
    PolycephalusVariant.POLYCEPHALUS,
    PolycephalusSubType.RED,
  ], // 269.0.1
  [
    EntityType.POLYCEPHALUS,
    PolycephalusVariant.POLYCEPHALUS,
    PolycephalusSubType.PINK,
  ], // 269.0.2
  [EntityType.POLYCEPHALUS, PolycephalusVariant.THE_PILE, 0], // 269.1.0
  [EntityType.MR_FRED, 0, 0], // 270.0.0
  [EntityType.URIEL, AngelVariant.NORMAL, 0], // 271.0.0
  [EntityType.URIEL, AngelVariant.FALLEN, 0], // 271.1.0
  [EntityType.GABRIEL, AngelVariant.NORMAL, 0], // 272.0.0
  [EntityType.GABRIEL, AngelVariant.FALLEN, 0], // 272.1.0
  // - Don't include The Lamb (273.0) since it is a story boss.
  // - Don't include Mega Satan (274.0) or Mega Satan 2 (275.0) since they are story bosses.
  [EntityType.STAIN, 0, StainSubType.NORMAL], // 401.0.0
  [EntityType.STAIN, 0, StainSubType.GREY], // 401.0.1
  [EntityType.BROWNIE, 0, BrownieSubType.NORMAL], // 402.0.0
  [EntityType.BROWNIE, 0, BrownieSubType.BLACK], // 402.0.1 Brownie
  [EntityType.FORSAKEN, 0, ForsakenSubType.NORMAL], // 403.0.0
  [EntityType.FORSAKEN, 0, ForsakenSubType.BLACK], // 403.0.1
  [EntityType.LITTLE_HORN, 0, LittleHornSubType.NORMAL], // 404.0.0
  [EntityType.LITTLE_HORN, 0, LittleHornSubType.ORANGE], // 404.0.1
  [EntityType.LITTLE_HORN, 0, LittleHornSubType.BLACK], // 404.0.2
  [EntityType.RAG_MAN, 0, RagManSubType.NORMAL], // 405.0.0
  [EntityType.RAG_MAN, 0, RagManSubType.RED], // 405.0.1
  [EntityType.RAG_MAN, 0, RagManSubType.BLACK], // 405.0.2
  // - Don't include Hush (407.0) since it is a story boss.
  [EntityType.RAG_MEGA, 0, 0], // 409.0.0
  [EntityType.SISTERS_VIS, 0, 0], // 410.0.0
  [EntityType.BIG_HORN, 0, 0], // 411.0.0
  // - Don't include Delirium (412.0) since it is a story boss.
  [EntityType.MATRIARCH, 0, 0], // 413.0.0
  [EntityType.REAP_CREEP, 0, 0], // 900.0.0
  [EntityType.LIL_BLUB, 0, 0], // 901.0.0
  [EntityType.RAINMAKER, 0, 0], // 902.0.0
  [EntityType.VISAGE, 0, 0], // 903.0.0
  [EntityType.SIREN, 0, 0], // 904.0.0
  [EntityType.HERETIC, 0, 0], // 905.0.0
  // - Don't include Hornfel (906.0) since it changes the screen too much.
  // - Don't include Great Gideon (907.0) since it is invulnerable.
  [EntityType.BABY_PLUM, 0, 0], // 908.0.0
  [EntityType.SCOURGE, 0, 0], // 909.0.0
  [EntityType.CHIMERA, 0, 0], // 910.0.0
  // - Don't include Rotgut since it requires leaving the current screen.
  // - Don't include Mother (912.0) it is a story boss.
  [EntityType.MIN_MIN, 0, 0], // 913.0.0
  [EntityType.CLOG, 0, 0], // 914.0.0
  [EntityType.SINGE, 0, 0], // 915.0.0
  [EntityType.BUMBINO, 0, 0], // 916.0.0
  [EntityType.COLOSTOMIA, 0, 0], // 917.0.0
  [EntityType.TURDLET, 0, 0], // 918.0.0
  // - Don't include Raglich (919) since it is a cut boss from Repentance.
  [EntityType.HORNY_BOYS, 0, 0], // 920.0.0
  [EntityType.CLUTCH, 0, 0], // 921.0.0
  // - Don't include Dogma (950.0) since it is a story boss.
  // - Don't include The Beast (951.0) since it is a story boss.
] as const;

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  checkVictoryLapBossReplace();
}

function checkVictoryLapBossReplace() {
  const room = game.GetRoom();
  const roomClear = room.IsClear();
  const roomSeed = room.GetSpawnSeed();
  const centerPos = room.GetCenterPos();
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
  return config.ClientCommunication && v.run.numVictoryLaps > 0;
}

export function getNumVictoryLaps(): int {
  return v.run.numVictoryLaps;
}
