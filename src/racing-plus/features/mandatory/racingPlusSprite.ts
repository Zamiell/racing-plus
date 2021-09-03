// In the "hudpickups.png" file, we blank out the "No Achievements" icon
// For every run, we draw a "R+" icon on top of where the "No Achievements" icon would normally be

import { getHUDOffsetVector, isJacobOrEsau } from "isaacscript-common";
import {
  SPRITE_BETHANY_OFFSET,
  SPRITE_CHALLENGE_OFFSET,
  SPRITE_DIFFICULTY_OFFSET,
  SPRITE_TAINTED_BETHANY_OFFSET,
} from "../../constants";
import g from "../../globals";
import { initSprite } from "../../util";
import * as socketClient from "../race/socketClient";

enum SpriteLayer {
  BLUE,
  GREEN,
}

const SPRITE_POSITION = Vector(4, 72); // On top of where the "No Achievements" icon would be

const sprite = initSprite("gfx/ui/racing_plus/racing_plus.anm2");

export function postRender(): void {
  if (g.seeds.HasSeedEffect(SeedEffect.SEED_NO_HUD)) {
    return;
  }

  const spriteLayer = socketClient.isActive()
    ? SpriteLayer.GREEN
    : SpriteLayer.BLUE;
  const position = getPosition();
  sprite.RenderLayer(spriteLayer, position);
}

export function getPosition(): Vector {
  const challenge = Isaac.GetChallenge();
  const HUDOffsetVector = getHUDOffsetVector();
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();

  let position = SPRITE_POSITION.add(HUDOffsetVector);

  // On vanilla, being in a challenge shifts the "No Achievements" icon to the left
  if (challenge !== Challenge.CHALLENGE_NULL) {
    position = position.add(SPRITE_CHALLENGE_OFFSET);
  }

  // On vanilla, being in Hard Mode or Greed Mode shifts the "No Achievements" icon to the right
  if (g.g.Difficulty !== Difficulty.DIFFICULTY_NORMAL) {
    position = position.add(SPRITE_DIFFICULTY_OFFSET);
  }

  // Certain characters have extra HUD elements, shifting the "No Achievements" icon down
  if (character === PlayerType.PLAYER_BETHANY || isJacobOrEsau(player)) {
    position = position.add(SPRITE_BETHANY_OFFSET);
  } else if (character === PlayerType.PLAYER_BETHANY_B) {
    position = position.add(SPRITE_TAINTED_BETHANY_OFFSET);
  }

  return position;
}
