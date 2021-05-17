export enum FastTravelState {
  DISABLED,
  PLAYER_ANIMATION,
  FADING_TO_BLACK,
  SCREEN_IS_BLACK,
  POST_NEW_ROOM_1,
  POST_NEW_ROOM_2,
  CONTROLS_ENABLED,
  PLAYER_JUMP,
}

export const TRAPDOOR_OPEN_DISTANCE = 60; // This feels about right
export const TRAPDOOR_TOUCH_DISTANCE = 16.5; // This feels about right
// (it is slightly smaller than vanilla)
export const TRAPDOOR_PICKUP_TOUCH_DISTANCE = TRAPDOOR_TOUCH_DISTANCE + 2;

export const JUMP_DOWN_ANIMATION_FRAME_LENGTH = 16;
export const FADE_TO_BLACK_FRAMES = 9;
// (10 is too many, as you can start to see the same room again)
export const JUMP_UP_ANIMATION_FRAME_LENGTH = 7;
