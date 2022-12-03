/*

pack/unpack reference:

- "b" a signed char, "B" an unsigned char
- "h" a signed short (2 bytes), "H" an unsigned short (2 bytes)
- "i" a signed int (4 bytes), "I" an unsigned int (4 bytes)
- "l" a signed long (8 bytes), "L" an unsigned long (8 bytes)
- "f" a float (4 bytes), "d" a double (8 bytes)
- "s" a zero-terminated string
- "cn" a sequence of exactly n chars corresponding to a single Lua string

*/

import { RENDER_FRAMES_PER_SECOND } from "isaacscript-common";

export const BEACON_INTERVAL = 10 * RENDER_FRAMES_PER_SECOND;
export const BEACON_FIELDS = ["raceID", "userID", "message"] as const;
export const BEACON_DATA_FORMAT = "IIc5";
export const BEACON_MESSAGE = "HELLO";

export const SHADOW_INTERVAL = 2; // In render frames
export const SHADOW_FIELDS = [
  "raceID",
  "userID",
  "x",
  "y",
  "stage",
  "stageType",
  "roomIndex",
  "character",
  "animation",
  "animationFrame",
  "overlayAnimation",
  "overlayAnimationFrame",
  "username",
];
export const SHADOW_DATA_FORMAT = "IIffIIIIc20Ic20Ic20"; // This matches the ShadowMessage interface

export const CHARACTER_LAYER_ID = 0;
export const DEFAULT_CHARACTER_PNG =
  "characters/costumes/character_001_isaac.png";
export const SHADOW_FADED_COLOR: Readonly<Color> = Color(
  1,
  1,
  1,
  0.075,
  0,
  0,
  0,
);
