import { getHUDOffsetVector, isJacobOrEsau } from "isaacscript-common";
import {
  SPRITE_BETHANY_OFFSET,
  SPRITE_TAINTED_BETHANY_OFFSET,
} from "../../constants";
import g from "../../globals";
import { CHALLENGE_DEFINITIONS } from "./constants";
import v from "./v";

const STARTING_POSITION = Vector(23, 79);

const sprites = {
  digit: [] as Sprite[],
  slash: Sprite(),
  season: Sprite(),
};

export function init(): void {
  for (let i = 0; i < 4; i++) {
    const sprite = Sprite();
    sprite.Load("gfx/timer/timer.anm2", true);
    sprite.Scale = Vector(0.9, 0.9);
    // Make the numbers a bit smaller than the ones used for the timer
    sprite.SetFrame("Default", 0);

    sprites.digit.push(sprite);
  }

  sprites.slash.Load("gfx/timer/slash.anm2", true);
  sprites.slash.SetFrame("Default", 0);
}

export function postRender(): void {
  displayCharacterProgress();
}

function displayCharacterProgress() {
  if (g.seeds.HasSeedEffect(SeedEffect.SEED_NO_HUD)) {
    return;
  }

  let position = STARTING_POSITION;
  const HUDOffsetVector = getHUDOffsetVector();
  position = position.add(HUDOffsetVector);

  const digitLength = 7.25;
  let adjustment1 = 0;
  let adjustment2 = 0;
  if (v.persistent.characterNum > 9) {
    adjustment1 = digitLength - 2;
    adjustment2 = adjustment1 - 1;
  }

  // Certain characters have extra HUD elements, shifting the "No Achievements" icon down
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();
  if (character === PlayerType.PLAYER_BETHANY || isJacobOrEsau(player)) {
    position = position.add(SPRITE_BETHANY_OFFSET);
  } else if (character === PlayerType.PLAYER_BETHANY_B) {
    position = position.add(SPRITE_TAINTED_BETHANY_OFFSET);
  }

  // Display the sprites
  let digit1 = v.persistent.characterNum;
  let digit2 = -1;
  if (v.persistent.characterNum > 9) {
    digit1 = 1;
    digit2 = v.persistent.characterNum - 10;
  }
  const digit3 = 7; // Assume a 7 character speedrun by default
  const digit4 = -1;

  const digit1Sprite = sprites.digit[0];
  digit1Sprite.SetFrame("Default", digit1);
  digit1Sprite.RenderLayer(0, position);

  if (digit2 !== -1) {
    const digit2Sprite = sprites.digit[1];
    digit2Sprite.SetFrame("Default", digit2);
    const digit2Modification = Vector(digitLength - 1, 0);
    const digit2Position = position.add(digit2Modification);
    digit2Sprite.RenderLayer(0, digit2Position);
  }

  const slashModification = Vector(digitLength - 1 + adjustment1, 0);
  const slashPosition = position.add(slashModification);
  sprites.slash.RenderLayer(0, slashPosition);

  const digit3Sprite = sprites.digit[2];
  digit3Sprite.SetFrame("Default", digit3);
  const digit3Modification = Vector(digitLength + adjustment2 + 5, 0);
  const digit3Position = position.add(digit3Modification);
  digit3Sprite.RenderLayer(0, digit3Position);

  let digit4Position: Vector | undefined;
  if (digit4 !== -1) {
    const digit4Sprite = sprites.digit[3];
    digit4Sprite.SetFrame("Default", digit4);
    const digit4Modification = Vector(
      digitLength + adjustment2 + 3 + digitLength,
      0,
    );
    digit4Position = position.add(digit4Modification);
    digit4Sprite.RenderLayer(0, digit4Position);
  }

  let posSeason;
  const spacing = 17;
  if (digit4Position === undefined) {
    posSeason = Vector(digit3Position.X + spacing, digit3Position.Y);
  } else {
    posSeason = Vector(digit3Position.X + spacing, digit3Position.Y);
  }
  sprites.season.SetFrame("Default", 0);
  sprites.season.RenderLayer(0, posSeason);
}

export function postGameStarted(): void {
  initSeasonSprite();
}

function initSeasonSprite() {
  const challenge = Isaac.GetChallenge();
  const challengeDefinition = CHALLENGE_DEFINITIONS.get(challenge);
  if (challengeDefinition === undefined) {
    error("Failed to get the challenge definition.");
  }
  const abbreviation = challengeDefinition[0];

  sprites.season.Load(`gfx/speedrun/${abbreviation}.anm2`, true);
  sprites.season.SetFrame("Default", 0);
}
