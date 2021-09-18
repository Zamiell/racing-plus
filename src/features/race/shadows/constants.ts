import { ISAAC_FRAMES_PER_SECOND } from "../../../constants";

export const BEACON_INTERVAL = 10 * ISAAC_FRAMES_PER_SECOND;
export const BEACON_FIELDS = ["raceID", "userID", "message"];
export const BEACON_DATA_FORMAT = "IIc5";

export const SHADOW_FIELDS = [
  "raceID",
  "userID",
  "x",
  "y",
  "stage",
  "roomIndex",
  "character",
  "animation",
  "animationFrame",
  "overlayAnimation",
  "overlayAnimationFrame",
];
export const SHADOW_DATA_FORMAT = "IIffIIIc20Ic20I";

export const CHARACTER_LAYER_ID = 0;
export const DEFAULT_ANIMATION = "WalkDown";
export const DEFAULT_OVERLAY_ANIMATION = "HeadDown";
export const DEFAULT_CHARACTER_PNG =
  "characters/costumes/character_001_isaac.png";
export const FADED_COLOR = Color(1, 1, 1, 0.075, 0, 0, 0);
export const OVERLAY_ANIMATIONS = [
  "HeadLeft",
  "HeadUp",
  "HeadRight",
  "HeadDown",
];

export const CHARACTER_PNG_MAP = new Map<PlayerType, string>([
  [PlayerType.PLAYER_ISAAC, "characters/costumes/character_001_isaac.png"], // 0
  [
    PlayerType.PLAYER_MAGDALENA,
    "characters/costumes/character_002_magdalene.png",
  ], // 1
  [PlayerType.PLAYER_CAIN, "characters/costumes/character_003_cain.png"], // 2
  [PlayerType.PLAYER_JUDAS, "characters/costumes/character_004_judas.png"], // 3
  [PlayerType.PLAYER_XXX, "characters/costumes/character_006_bluebaby.png"], // 4
  [PlayerType.PLAYER_EVE, "characters/costumes/character_005_eve.png"], // 5
  [PlayerType.PLAYER_SAMSON, "characters/costumes/character_007_samson.png"], // 6
  [PlayerType.PLAYER_AZAZEL, "characters/costumes/character_008_azazel.png"], // 7
  [PlayerType.PLAYER_LAZARUS, "characters/costumes/character_009_lazarus.png"], // 8
  [PlayerType.PLAYER_EDEN, "characters/costumes/character_009_eden.png"], // 9
  [PlayerType.PLAYER_THELOST, "characters/costumes/character_012_thelost.png"], // 10
  [
    PlayerType.PLAYER_LAZARUS2,
    "characters/costumes/character_010_lazarus2.png",
  ], // 11
  [
    PlayerType.PLAYER_BLACKJUDAS,
    "characters/costumes/character_013_blackjudas.png",
  ], // 12
  [PlayerType.PLAYER_LILITH, "characters/costumes/character_014_lilith.png"], // 13
  [PlayerType.PLAYER_KEEPER, "characters/costumes/character_015_keeper.png"], // 14
  [
    PlayerType.PLAYER_APOLLYON,
    "characters/costumes/character_016_apollyon.png",
  ], // 15
  [
    PlayerType.PLAYER_THEFORGOTTEN,
    "characters/costumes/character_017_theforgotten.png",
  ], // 16
  [PlayerType.PLAYER_THESOUL, "characters/costumes/character_018_thesoul.png"], // 17
  [PlayerType.PLAYER_BETHANY, "characters/costumes/character_001x_bethany.png"], // 18
  [PlayerType.PLAYER_JACOB, "characters/costumes/character_002x_jacob.png"], // 19
  [PlayerType.PLAYER_ESAU, "characters/costumes/character_003x_esau.png"], // 20
  [PlayerType.PLAYER_ISAAC_B, "characters/costumes/character_001b_isaac.png"], // 21
  [
    PlayerType.PLAYER_MAGDALENA_B,
    "characters/costumes/character_002b_magdalene.png",
  ], // 22
  [PlayerType.PLAYER_CAIN_B, "characters/costumes/character_003b_cain.png"], // 23
  [PlayerType.PLAYER_JUDAS_B, "characters/costumes/character_004b_judas.png"], // 24
  [PlayerType.PLAYER_XXX_B, "characters/costumes/character_005b_bluebaby.png"], // 25
  [PlayerType.PLAYER_EVE_B, "characters/costumes/character_006b_eve.png"], // 26
  [PlayerType.PLAYER_SAMSON_B, "characters/costumes/character_007b_samson.png"], // 27
  [PlayerType.PLAYER_AZAZEL_B, "characters/costumes/character_008b_azazel.png"], // 28
  [
    PlayerType.PLAYER_LAZARUS_B,
    "characters/costumes/character_009b_lazarus.png",
  ], // 29
  [
    PlayerType.PLAYER_EDEN_B,
    "characters/costumes/characters/costumes/character_009_eden.png",
  ], // 30
  [
    PlayerType.PLAYER_THELOST_B,
    "characters/costumes/character_012b_thelost.png",
  ], // 31
  [PlayerType.PLAYER_LILITH_B, "characters/costumes/character_014b_lilith.png"], // 32
  [PlayerType.PLAYER_KEEPER_B, "characters/costumes/character_015b_keeper.png"], // 33
  [
    PlayerType.PLAYER_APOLLYON_B,
    "characters/costumes/character_016b_apollyon.png",
  ], // 34
  [
    PlayerType.PLAYER_THEFORGOTTEN_B,
    "characters/costumes/character_016b_theforgotten.png",
  ], // 35
  [
    PlayerType.PLAYER_BETHANY_B,
    "characters/costumes/character_018b_bethany.png",
  ], // 36
  [PlayerType.PLAYER_JACOB_B, "characters/costumes/character_019b_jacob.png"], // 37
  [
    PlayerType.PLAYER_LAZARUS2_B,
    "characters/costumes/character_009b_lazarus2.png",
  ], // 38
  [PlayerType.PLAYER_JACOB2_B, "characters/costumes/character_019b_jacob2.png"], // 39
  [
    PlayerType.PLAYER_THESOUL_B,
    "characters/costumes/character_017b_thesoul.png",
  ], // 40
]);
