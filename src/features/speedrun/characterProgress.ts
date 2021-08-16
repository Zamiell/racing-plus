import g from "../../globals";
import { CHALLENGE_DEFINITIONS } from "./constants";
import v from "./v";

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

  const digitLength = 7.25;
  const startingX = 23;
  const startingY = 79;
  let adjustment1 = 0;
  let adjustment2 = 0;
  if (v.persistent.characterNum > 9) {
    adjustment1 = digitLength - 2;
    adjustment2 = adjustment1 - 1;
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
  const posDigit1 = Vector(startingX, startingY);
  digit1Sprite.SetFrame("Default", digit1);
  digit1Sprite.RenderLayer(0, posDigit1);

  if (digit2 !== -1) {
    const digit2Sprite = sprites.digit[1];
    const posDigit2 = Vector(startingX + digitLength - 1, startingY);
    digit2Sprite.SetFrame("Default", digit2);
    digit2Sprite.RenderLayer(0, posDigit2);
  }

  const posSlash = Vector(startingX + digitLength - 1 + adjustment1, startingY);
  sprites.slash.RenderLayer(0, posSlash);

  const digit3Sprite = sprites.digit[2];
  const posDigit3 = Vector(
    startingX + digitLength + adjustment2 + 5,
    startingY,
  );
  digit3Sprite.SetFrame("Default", digit3);
  digit3Sprite.RenderLayer(0, posDigit3);

  let posDigit4 = null;
  if (digit4 !== -1) {
    const digit4Sprite = sprites.digit[3];
    posDigit4 = Vector(
      startingX + digitLength + adjustment2 + 3 + digitLength,
      startingY,
    );
    digit4Sprite.SetFrame("Default", digit4);
    digit4Sprite.RenderLayer(0, posDigit4);
  }

  let posSeason;
  const spacing = 17;
  if (posDigit4 !== null) {
    posSeason = Vector(posDigit4.X + spacing, posDigit4.Y);
  } else {
    posSeason = Vector(posDigit3.X + spacing, posDigit3.Y);
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
