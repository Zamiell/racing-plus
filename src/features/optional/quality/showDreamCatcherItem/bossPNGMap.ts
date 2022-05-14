import { EntityType } from "isaac-typescript-definitions";

// cspell:disable
export const bossPNGMap = new Map([
  [
    EntityType.LARRY_JR,
    [
      "portrait_19.0_larryjr.png",
      "portrait_19.1_thehollow.png",
      "portrait_19.100_tufftwins.png",
      "portrait_shell.png",
    ],
  ],
  [EntityType.MONSTRO, ["portrait_20.0_monstro.png"]],
  [
    EntityType.CHUB,
    [
      "portrait_28.0_chub.png",
      "portrait_28.1_chad.png",
      "portrait_28.2_carrionqueen.png",
    ],
  ],
  [EntityType.GURDY, ["portrait_36.0_gurdy.png"]],
  [
    EntityType.MONSTRO_2,
    ["portrait_43.0_monstro2.png", "portrait_43.1_gish.png"],
  ],
  [EntityType.MOM, ["portrait_45.0_mom.png"]],
  [
    EntityType.PIN,
    [
      "portrait_62.0_pin.png",
      "portrait_62.1_scolex.png",
      "portrait_thefrail.png",
    ],
  ],
  [EntityType.FAMINE, ["portrait_63.0_famine.png"]],
  [EntityType.PESTILENCE, ["portrait_64.0_pestilence.png"]],
  [EntityType.WAR, ["portrait_65.0_war.png", "portrait_65.1_conquest.png"]],
  [EntityType.DEATH, ["portrait_66.0_death.png"]],
  [
    EntityType.DUKE,
    ["portrait_67.0_dukeofflies.png", "portrait_67.1_thehusk.png"],
  ],
  [EntityType.PEEP, ["portrait_68.0_peep.png", "portrait_68.1_bloat.png"]],
  [EntityType.LOKI, ["portrait_69.0_loki.png", "portrait_69.1_lokii.png"]],
  [
    EntityType.FISTULA_BIG,
    ["portrait_71.0_fistula.png", "portrait_71.1_teratoma.png"],
  ],
  [EntityType.BLASTOCYST_BIG, ["portrait_74.0_blastocyst.png"]],
  [
    EntityType.MOMS_HEART,
    ["portrait_78.0_momsheart.png", "portrait_78.1_itlives.png"],
  ],
  [
    EntityType.GEMINI,
    [
      "portrait_79.0_gemini.png",
      "portrait_79.1_steven.png",
      "portrait_79.2_blightedovum.png",
    ],
  ],
  [EntityType.FALLEN, ["portrait_81.0_thefallen.png"]],
  [EntityType.HEADLESS_HORSEMAN, ["portrait_82.0_headlesshorseman.png"]],
  [EntityType.SATAN, ["portrait_84.0_satan.png"]],
  [EntityType.MASK_OF_INFAMY, ["portrait_97.0_maskofinfamy.png"]],
  [EntityType.GURDY_JR, ["portrait_99.0_gurdyjr.png"]],
  [
    EntityType.WIDOW,
    ["portrait_100.0_widow.png", "portrait_100.1_thewretched.png"],
  ],
  [
    EntityType.DADDY_LONG_LEGS,
    ["portrait_101.0_daddylonglegs.png", "portrait_101.1_triachnid.png"],
  ],
  [
    EntityType.ISAAC,
    ["portrait_102.0_isaac.png", "portrait_102.1_bluebaby.png"],
  ],
  [EntityType.THE_HAUNT, ["portrait_260.0_thehaunt.png"]],
  [EntityType.DINGLE, ["portrait_261.0_dingle.png", "portrait_dangle.png"]],
  [EntityType.MEGA_MAW, ["portrait_262.0_megamaw.png"]],
  [EntityType.GATE, ["portrait_263.0_megamaw2.png"]],
  [EntityType.MEGA_FATTY, ["portrait_264.0_megafatty.png"]],
  [EntityType.CAGE, ["portrait_265.0_fatty2.png"]],
  [EntityType.MAMA_GURDY, ["portrait_266.0_mamagurdy.png"]],
  [EntityType.DARK_ONE, ["portrait_267.0_darkone.png"]],
  [EntityType.ADVERSARY, ["portrait_268.0_darkone2.png"]],
  [
    EntityType.POLYCEPHALUS,
    ["portrait_269.0_polycephalus.png", "portrait_269.1_polycephalus2.png"],
  ],
  [EntityType.MR_FRED, ["portrait_270.0_megafred.png"]],
  [EntityType.THE_LAMB, ["portrait_273.0_thelamb.png"]],
  [EntityType.MEGA_SATAN, ["portrait_274.0_megasatan.png"]],
  // The file name for Gurglings appears to be incorrectly labeled.
  [
    EntityType.GURGLING,
    [
      "portrait_276.0_gurglings.png", // The normal version
      "portrait_276.0_gurglings.png", // The boss version
      "portrait_turdlings.png",
    ],
  ],
  [EntityType.STAIN, ["portrait_401.0_thestain.png"]],
  [EntityType.BROWNIE, ["portrait_402.0_brownie.png"]],
  [EntityType.FORSAKEN, ["portrait_403.0_theforsaken.png"]],
  [EntityType.LITTLE_HORN, ["portrait_404.0_littlehorn.png"]],
  [EntityType.RAG_MAN, ["portrait_405.0_ragman.png"]],
  [EntityType.ULTRA_GREED, ["portrait_406.0_ultragreed.png"]],
  [EntityType.HUSH, ["portrait_407.0_hush.png"]],
  [EntityType.RAG_MEGA, ["portrait_ragmega.png"]], // 409
  [EntityType.SISTERS_VIS, ["portrait_sistersvis.png"]], // 410
  [EntityType.BIG_HORN, ["portrait_bighorn.png"]], // 411
  [EntityType.DELIRIUM, ["portrait_delirium.png"]], // 412
  [EntityType.MATRIARCH, ["portrait_matriarch.png"]], // 413
  [EntityType.REAP_CREEP, ["portrait_900.0_reapcreep.png"]],
  [EntityType.LIL_BLUB, ["portrait_901.0_beelzeblub.png"]],
  [EntityType.RAINMAKER, ["portrait_902.0_rainmaker.png"]],
  [EntityType.VISAGE, ["portrait_903.0_visage.png"]],
  [EntityType.SIREN, ["portrait_904.0_siren.png"]],
  [EntityType.HERETIC, ["portrait_905.0_heretic.png"]],
  [EntityType.HORNFEL, ["portrait_906.0_hornfel.png"]],
  [EntityType.GIDEON, ["portrait_907.0_gideon.png"]],
  [EntityType.BABY_PLUM, ["portrait_908.0_babyplum.png"]],
  [EntityType.SCOURGE, ["portrait_909.0_scourge.png"]],
  [EntityType.CHIMERA, ["portrait_910.0_chimera.png"]],
  [EntityType.ROTGUT, ["portrait_911.0_rotgut.png"]],
  [EntityType.MOTHER, ["portrait_mother.png"]], // 912
  // "portrait_913.0_maidinthemist.png" is unused.
  [EntityType.MIN_MIN, ["portrait_minmin.png"]], // 913
  [EntityType.CLOG, ["portrait_clog.png"]], // 914
  [EntityType.SINGE, ["portrait_singe.png"]], // 915
  [EntityType.BUMBINO, ["portrait_bumbino.png"]], // 916
  [EntityType.COLOSTOMIA, ["portrait_colostomia.png"]], // 917
  [EntityType.TURDLET, ["portrait_turdlet.png"]], // 918
  [EntityType.RAGLICH, ["portrait_raglich.png"]], // 919
  [EntityType.HORNY_BOYS, ["portrait_hornyboys.png"]], // 920
  [EntityType.CLUTCH, ["portrait_clutch.png"]], // 921
  [EntityType.DOGMA, ["portrait_dogma.png"]], // 950
]);
