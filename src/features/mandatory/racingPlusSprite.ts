// In the "hudpickups.png" file, we blank out the "No Achievements" icon
// For every run, we draw a "R+" icon on top of where the "No Achievements" icon would normally be

import {
  SPRITE_CHALLENGE_OFFSET,
  SPRITE_DIFFICULTY_OFFSET,
} from "../../constants";
import g from "../../globals";
import { getHUDOffsetVector, initSprite } from "../../misc";

enum SpriteLayer {
  Blue,
  Green,
}

const SPRITE_POSITION = Vector(4, 72); // On top of where the "No Achievements" icon would be

const sprite = initSprite("gfx/ui/racing_plus/racing_plus.anm2");

export function postRender(): void {
  const spriteLayer =
    g.socket.client === null ? SpriteLayer.Blue : SpriteLayer.Green;
  const position = getPosition();
  sprite.RenderLayer(spriteLayer, position);
}

export function getPosition(): Vector {
  const challenge = Isaac.GetChallenge();
  const HUDOffsetVector = getHUDOffsetVector();

  let position = SPRITE_POSITION.add(HUDOffsetVector);

  if (challenge !== Challenge.CHALLENGE_NULL) {
    // On vanilla, being in a challenge shifts the "No Achievements" icon to the left
    position = position.add(SPRITE_CHALLENGE_OFFSET);
  } else if (g.g.Difficulty !== Difficulty.DIFFICULTY_NORMAL) {
    // On vanilla, being in Hard Mode or Greed Mode shifts the "No Achievements" icon to the right
    position = position.add(SPRITE_DIFFICULTY_OFFSET);
  }

  return position;
}
