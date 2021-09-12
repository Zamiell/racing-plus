// We use a script to find every NPC in the game that has a death animation longer than 1 frame
// This is used as a whitelist to know which entities should be affected by fast-clear
export const FAST_CLEAR_WHITELIST = new Set<EntityType>([
  EntityType.ENTITY_MONSTRO, // 20
  EntityType.ENTITY_CHUB, // 28
  EntityType.ENTITY_HOPPER, // 29 (only included because of Eggy)
  EntityType.ENTITY_GURDY, // 36
  EntityType.ENTITY_MONSTRO2, // 43
  EntityType.ENTITY_PEEP, // 68
  EntityType.ENTITY_MOMS_HEART, // 78
  EntityType.ENTITY_FALLEN, // 81
  EntityType.ENTITY_SATAN, // 84
  EntityType.ENTITY_MASK_OF_INFAMY, // 97
  EntityType.ENTITY_HEART_OF_INFAMY, // 98
  EntityType.ENTITY_GURDY_JR, // 99
  EntityType.ENTITY_WIDOW, // 100
  EntityType.ENTITY_DADDYLONGLEGS, // 101 // cspell:disable-line
  EntityType.ENTITY_ISAAC, // 102
  EntityType.ENTITY_GURGLING, // 237
  EntityType.ENTITY_DINGLE, // 261
  EntityType.ENTITY_MEGA_MAW, // 262
  EntityType.ENTITY_GATE, // 263
  EntityType.ENTITY_MEGA_FATTY, // 264
  EntityType.ENTITY_CAGE, // 265
  EntityType.ENTITY_MAMA_GURDY, // 266
  EntityType.ENTITY_DARK_ONE, // 267
  EntityType.ENTITY_ADVERSARY, // 268
  EntityType.ENTITY_POLYCEPHALUS, // 269
  EntityType.ENTITY_MR_FRED, // 270
  EntityType.ENTITY_URIEL, // 271
  EntityType.ENTITY_GABRIEL, // 272
  EntityType.ENTITY_THE_LAMB, // 273
  EntityType.ENTITY_STAIN, // 401
  EntityType.ENTITY_FORSAKEN, // 403
  EntityType.ENTITY_LITTLE_HORN, // 404
  EntityType.ENTITY_RAG_MAN, // 405
  EntityType.ENTITY_ULTRA_GREED, // 406
  EntityType.ENTITY_HUSH, // 407
  EntityType.ENTITY_SISTERS_VIS, // 410
  EntityType.ENTITY_BIG_HORN, // 411
  EntityType.ENTITY_REAP_CREEP, // 900
  EntityType.ENTITY_RAINMAKER, // 902
  EntityType.ENTITY_VISAGE, // 903
  EntityType.ENTITY_SIREN, // 904
  EntityType.ENTITY_HERETIC, // 905
  EntityType.ENTITY_GIDEON, // 907
  EntityType.ENTITY_BABY_PLUM, // 908
  EntityType.ENTITY_SCOURGE, // 909
  EntityType.ENTITY_MIN_MIN, // 913
  EntityType.ENTITY_CLOG, // 914
  EntityType.ENTITY_SINGE, // 915
  EntityType.ENTITY_BUMBINO, // 916
  EntityType.ENTITY_COLOSTOMIA, // 917
  EntityType.ENTITY_RAGLICH, // 919
  EntityType.ENTITY_HORNY_BOYS, // 920
  EntityType.ENTITY_CLUTCH, // 921
  EntityType.ENTITY_BEAST, // 951
]);

export const FAST_CLEAR_WHITELIST_WITH_SPECIFIC_VARIANT = new Set<string>([
  // We do not want fast-clear to apply to Lil' Haunts
  `${EntityType.ENTITY_THE_HAUNT}.${HauntVariant.HAUNT}`, // 260
  // We only want fast-clear to apply to the final phase of Mother
  `${EntityType.ENTITY_MOTHER}.${MotherVariant.PHASE_2}`, // 912
]);

export const ATTACHED_NPC_ID_WITHOUT_SUBTYPE = new Set<string>([
  `${EntityType.ENTITY_VIS}.${VisVariant.CHUBBER_PROJECTILE}`,
  `${EntityType.ENTITY_DEATH}.${DeathVariant.DEATH_SCYTHE}`,
  `${EntityType.ENTITY_PEEP}.${PeepVariant.PEEP_EYE}`,
  `${EntityType.ENTITY_PEEP}.${PeepVariant.BLOAT_EYE}`,
  `${EntityType.ENTITY_BEGOTTEN}.${BegottenVariant.BEGOTTEN_CHAIN}`,
  `${EntityType.ENTITY_MAMA_GURDY}.${MamaGurdyVariant.LEFT_HAND}`,
  `${EntityType.ENTITY_MAMA_GURDY}.${MamaGurdyVariant.RIGHT_HAND}`,
  `${EntityType.ENTITY_BIG_HORN}.${BigHornVariant.SMALL_HOLE}`,
  `${EntityType.ENTITY_BIG_HORN}.${BigHornVariant.BIG_HOLE}`,
]);

export const ATTACHED_NPC_ID_WITH_SUBTYPE = new Set<string>([
  `${EntityType.ENTITY_CHARGER}.${ChargerVariant.CHARGER}.${ChargerSubType.MY_SHADOW}`,
]);
