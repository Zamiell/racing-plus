// In the "hudpickups.png" file, we blank out the "No Achievements" icon
// For every run, we draw a "R+" icon on top of where the "No Achievements" icon would normally be

import g from "../../globals";
import { initSprite } from "../../misc";

enum SpriteLayer {
  Blue,
  Green,
}

const SPRITE_POSITION = Vector(4, 74);
const SPRITE_LEFT_OFFSET = Vector(-3, 0); // For challenges
const SPRITE_RIGHT_OFFSET = Vector(13, 0); // For hard mode

const sprite = initSprite("gfx/ui/racing_plus/racing_plus.anm2");

export function postRender(): void {
  const challenge = Isaac.GetChallenge();

  let position = SPRITE_POSITION;
  if (challenge !== Challenge.CHALLENGE_NULL) {
    // On vanilla, being in a challenge shifts the "No Achievements" icon to the left
    position = position.__add(SPRITE_LEFT_OFFSET);
  } else if (g.g.Difficulty !== Difficulty.DIFFICULTY_NORMAL) {
    // On vanilla, being in Hard Mode or Greed Mode shifts the "No Achievements" icon to the right
    position = position.__add(SPRITE_RIGHT_OFFSET);
  }

  const spriteLayer =
    g.socket.client === null ? SpriteLayer.Blue : SpriteLayer.Green;
  sprite.RenderLayer(spriteLayer, position);
}
