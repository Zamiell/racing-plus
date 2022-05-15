import {
  getHUDOffsetVector,
  isBethany,
  isJacobOrEsau,
} from "isaacscript-common";
import {
  SPRITE_BETHANY_OFFSET,
  SPRITE_JACOB_ESAU_OFFSET,
} from "../../constants";
import g from "../../globals";
import { shouldDrawPlaceLeftSprite } from "../race/placeLeft";
import { CHALLENGE_DEFINITIONS } from "./constants";
import v from "./v";

const STARTING_POSITION = Vector(23, 79);
const RACE_PLACE_OFFSET = Vector(30, 0);

class CharacterProgressSprites {
  digits = {
    digit1: Sprite(),
    digit2: Sprite(),
    digit3: Sprite(),
    digit4: Sprite(),
  };

  slash = Sprite();
  seasonIcon = Sprite();

  constructor() {
    for (const sprite of Object.values(this.digits)) {
      sprite.Load("gfx/timer/timer.anm2", true);

      // Make the numbers a bit smaller than the ones used for the timer.
      sprite.Scale = Vector(0.9, 0.9);

      sprite.SetFrame("Default", 0);
    }

    this.slash.Load("gfx/timer/slash.anm2", true);
    this.slash.SetFrame("Default", 0);
  }
}

const sprites = new CharacterProgressSprites();

// ModCallback.POST_RENDER (2)
export function postRender(): void {
  drawCharacterProgressAndSeasonIcon();
}

function drawCharacterProgressAndSeasonIcon() {
  const hud = g.g.GetHUD();

  if (!hud.IsVisible()) {
    return;
  }

  let position = STARTING_POSITION;
  const HUDOffsetVector = getHUDOffsetVector();
  position = position.add(HUDOffsetVector);

  if (shouldDrawPlaceLeftSprite()) {
    position = position.add(RACE_PLACE_OFFSET);
  }

  const digitLength = 7.25;
  let adjustment1 = 0;
  let adjustment2 = 0;
  if (v.persistent.characterNum > 9) {
    adjustment1 = digitLength - 2;
    adjustment2 = adjustment1 - 1;
  }

  // Certain characters have extra HUD elements, shifting the "No Achievements" icon down.
  const player = Isaac.GetPlayer();
  if (isBethany(player)) {
    position = position.add(SPRITE_BETHANY_OFFSET);
  } else if (isJacobOrEsau(player)) {
    position = position.add(SPRITE_JACOB_ESAU_OFFSET);
  }

  // Draw the sprites for the character progress.
  let digit1 = v.persistent.characterNum;
  let digit2 = -1;
  if (v.persistent.characterNum > 9) {
    digit1 = 1;
    digit2 = v.persistent.characterNum - 10;
  }
  const digit3 = 7; // Assume a 7 character speedrun by default
  const digit4 = -1;

  sprites.digits.digit1.SetFrame("Default", digit1);
  sprites.digits.digit1.RenderLayer(0, position);

  if (digit2 !== -1) {
    sprites.digits.digit2.SetFrame("Default", digit2);
    const digit2Modification = Vector(digitLength - 1, 0);
    const digit2Position = position.add(digit2Modification);
    sprites.digits.digit2.RenderLayer(0, digit2Position);
  }

  const slashModification = Vector(digitLength - 1 + adjustment1, 0);
  const slashPosition = position.add(slashModification);
  sprites.slash.RenderLayer(0, slashPosition);

  sprites.digits.digit3.SetFrame("Default", digit3);
  const digit3Modification = Vector(digitLength + adjustment2 + 5, 0);
  const digit3Position = position.add(digit3Modification);
  sprites.digits.digit3.RenderLayer(0, digit3Position);

  let digit4Position: Vector | undefined;
  if (digit4 !== -1) {
    sprites.digits.digit4.SetFrame("Default", digit4);
    const digit4Modification = Vector(
      digitLength + adjustment2 + 3 + digitLength,
      0,
    );
    digit4Position = position.add(digit4Modification);
    sprites.digits.digit4.RenderLayer(0, digit4Position);
  }

  // Draw the sprite for the season icon.
  let posSeason: Vector;
  const spacing = 17;
  if (digit4Position === undefined) {
    posSeason = Vector(digit3Position.X + spacing, digit3Position.Y);
  } else {
    posSeason = Vector(digit3Position.X + spacing, digit3Position.Y);
  }
  sprites.seasonIcon.RenderLayer(0, posSeason);
}

// ModCallback.POST_GAME_STARTED (15)
export function postGameStarted(): void {
  initSeasonIconSprite();
}

function initSeasonIconSprite() {
  const challenge = Isaac.GetChallenge();
  const challengeDefinition = CHALLENGE_DEFINITIONS.get(challenge);
  if (challengeDefinition === undefined) {
    error("Failed to get the challenge definition.");
  }
  const abbreviation = challengeDefinition[0];

  sprites.seasonIcon.Load(`gfx/speedrun/${abbreviation}.anm2`, true);
  sprites.seasonIcon.SetFrame("Default", 0);
}
