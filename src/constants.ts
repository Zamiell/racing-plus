export const COLLECTIBLE_SPRITE_LAYER = 1;
export const DEBUG_LOGGING = false;

export const EXCLUDED_CHARACTERS = [
  PlayerType.PLAYER_ESAU, // 20
  PlayerType.PLAYER_THESOUL_B, // 40
];

export const BEAST_ROOM_SUB_TYPE = 4;
export const KCOLOR_DEFAULT = KColor(1, 1, 1, 1);
export const MAX_NUM_DOORS = 8; // In a 2x2 room, there can be 8 doors
export const NORMAL_TRAPDOOR_POSITION = Vector(320, 200); // Near the top door
// This is the ShiftIdx that Blade recommended after having reviewing the game's internal functions
export const RECOMMENDED_SHIFT_IDX = 35;
export const SPRITE_CHALLENGE_OFFSET = Vector(-3, 0);
export const SPRITE_DIFFICULTY_OFFSET = Vector(13, 0);
export const SPRITE_BETHANY_OFFSET = Vector(0, 8);
export const SPRITE_TAINTED_BETHANY_OFFSET = Vector(0, 6);
// The version is updated automatically by IsaacScript
export const VERSION = "0.58.28";
