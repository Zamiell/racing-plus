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
  [PlayerType.PLAYER_ISAAC, "characters/costumes/character_001_isaac.png"],
  [
    PlayerType.PLAYER_MAGDALENA,
    "characters/costumes/character_002_magdalene.png",
  ],
  [PlayerType.PLAYER_CAIN, "characters/costumes/character_003_cain.png"],
  [PlayerType.PLAYER_JUDAS, "characters/costumes/character_004_judas.png"],
  [PlayerType.PLAYER_XXX, "characters/costumes/character_006_bluebaby.png"],
  [PlayerType.PLAYER_EVE, "characters/costumes/character_005_eve.png"],
  [PlayerType.PLAYER_SAMSON, "characters/costumes/character_007_samson.png"],
  [PlayerType.PLAYER_AZAZEL, "characters/costumes/character_008_azazel.png"],
  [PlayerType.PLAYER_LAZARUS, "characters/costumes/character_009_lazarus.png"],
  [PlayerType.PLAYER_EDEN, "characters/costumes/character_009_eden.png"],
  [PlayerType.PLAYER_THELOST, "characters/costumes/character_012_thelost.png"],
  [
    PlayerType.PLAYER_LAZARUS2,
    "characters/costumes/character_010_lazarus2.png",
  ],
  [
    PlayerType.PLAYER_BLACKJUDAS,
    "characters/costumes/character_013_blackjudas.png",
  ],
  [PlayerType.PLAYER_LILITH, "characters/costumes/character_014_lilith.png"],
  [PlayerType.PLAYER_KEEPER, "characters/costumes/character_015_keeper.png"],
  [
    PlayerType.PLAYER_APOLLYON,
    "characters/costumes/character_016_apollyon.png",
  ],
  [
    PlayerType.PLAYER_THEFORGOTTEN,
    "characters/costumes/character_017_theforgotten.png",
  ],
  [PlayerType.PLAYER_THESOUL, "characters/costumes/character_018_thesoul.png"],
  [PlayerType.PLAYER_BETHANY, "characters/costumes/character_001x_bethany.png"],
  [PlayerType.PLAYER_JACOB, "characters/costumes/character_002x_jacob.png"],
  [PlayerType.PLAYER_ESAU, "characters/costumes/character_003x_esau.png"],
  [PlayerType.PLAYER_ISAAC_B, "characters/costumes/character_001b_isaac.png"],
  [
    PlayerType.PLAYER_MAGDALENA_B,
    "characters/costumes/character_002b_magdalene.png",
  ],
  [PlayerType.PLAYER_CAIN_B, "characters/costumes/character_003b_cain.png"],
  [PlayerType.PLAYER_JUDAS_B, "characters/costumes/character_004b_judas.png"],
  [PlayerType.PLAYER_XXX_B, "characters/costumes/character_005b_bluebaby.png"],
  [PlayerType.PLAYER_EVE_B, "characters/costumes/character_006b_eve.png"],
  [PlayerType.PLAYER_SAMSON_B, "characters/costumes/character_007b_samson.png"],
  [PlayerType.PLAYER_AZAZEL_B, "characters/costumes/character_008b_azazel.png"],
  [
    PlayerType.PLAYER_LAZARUS_B,
    "characters/costumes/character_009b_lazarus.png",
  ],
  [
    PlayerType.PLAYER_EDEN_B,
    "characters/costumes/characters/costumes/character_009_eden.png",
  ],
  [
    PlayerType.PLAYER_THELOST_B,
    "characters/costumes/character_012b_thelost.png",
  ],
  [PlayerType.PLAYER_LILITH_B, "characters/costumes/character_014b_lilith.png"],
  [PlayerType.PLAYER_KEEPER_B, "characters/costumes/character_015b_keeper.png"],
  [
    PlayerType.PLAYER_APOLLYON_B,
    "characters/costumes/character_016b_apollyon.png",
  ],
  [
    PlayerType.PLAYER_THEFORGOTTEN_B,
    "characters/costumes/character_016b_theforgotten.png",
  ],
  [
    PlayerType.PLAYER_BETHANY_B,
    "characters/costumes/character_018b_bethany.png",
  ],
  [PlayerType.PLAYER_JACOB_B, "characters/costumes/character_019b_jacob.png"],
  [
    PlayerType.PLAYER_LAZARUS2_B,
    "characters/costumes/character_009b_lazarus2.png",
  ],
  [PlayerType.PLAYER_JACOB2_B, "characters/costumes/character_019b_jacob2.png"],
  [
    PlayerType.PLAYER_THESOUL_B,
    "characters/costumes/character_017b_thesoul.png",
  ],
]);
