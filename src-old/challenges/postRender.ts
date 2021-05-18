import g from "../globals";
import { CHALLENGE_DEFINITIONS } from "./constants";
import { ChallengeCustom } from "./enums";
import { inSpeedrun } from "./misc";
import * as season6 from "./season6";
import * as season7 from "./season7";
import * as season8 from "./season8";

export function main(): void {
  if (!inSpeedrun()) {
    return;
  }

  if (RacingPlusData === null) {
    return;
  }

  checkRestart();
  displayCharProgress();
  season6.postRender();
  season7.postRender();
  season8.postRender();
}

function checkRestart() {
  // Local variables
  const isaacFrameCount = Isaac.GetFrameCount();

  // We grabbed the checkpoint, so fade out the screen before we reset
  if (g.speedrun.fadeFrame !== 0 && isaacFrameCount >= g.speedrun.fadeFrame) {
    g.speedrun.fadeFrame = 0;
    g.g.Fadeout(0.0275, FadeoutTarget.FADEOUT_RESTART_RUN);
    // 72 restarts as the current character and we want a frame of leeway
    g.speedrun.resetFrame = isaacFrameCount + 70;
    // (this is necessary because we don't want the player to be able to reset to skip having to
    // watch the fade out)
    return;
  }

  // The screen is now black, so move us to the next character for the speedrun
  if (g.speedrun.resetFrame !== 0 && isaacFrameCount >= g.speedrun.resetFrame) {
    g.speedrun.resetFrame = 0;
    g.speedrun.fastReset = true; // Set this so that we don't go back to the beginning again
    g.speedrun.characterNum += 1;
    g.run.restart = true;
    Isaac.DebugString("Switching to the next character for the speedrun.");
  }
}

// Called from the "PostRender.Main()" function
function displayCharProgress() {
  // Local variables
  const challenge = Isaac.GetChallenge();

  // Don't show the progress if we are not in the custom challenge
  if (!inSpeedrun()) {
    return;
  }

  if (g.seeds.HasSeedEffect(SeedEffect.SEED_NO_HUD)) {
    return;
  }

  // Load the sprites for the multi-character speedrun progress
  if (g.speedrun.sprites.slash === null) {
    g.speedrun.sprites.digit = {};
    for (let i = 0; i < 4; i++) {
      g.speedrun.sprites.digit[i] = Sprite();
      g.speedrun.sprites.digit[i].Load("gfx/timer/timer.anm2", true);
      g.speedrun.sprites.digit[i].Scale = Vector(0.9, 0.9);
      // Make the numbers a bit smaller than the ones used for the timer
      g.speedrun.sprites.digit[i].SetFrame("Default", 0);
    }

    g.speedrun.sprites.slash = Sprite();
    g.speedrun.sprites.slash.Load("gfx/timer/slash.anm2", true);
    g.speedrun.sprites.slash.SetFrame("Default", 0);

    // Get the abbreviation for the challenge that we are currently in
    const challengeDefinition = CHALLENGE_DEFINITIONS.get(challenge);
    if (challengeDefinition === undefined) {
      error("Failed to get the challenge definition.");
    }
    const abbreviation = challengeDefinition[0];

    g.speedrun.sprites.season = Sprite();
    g.speedrun.sprites.season.Load(`gfx/speedrun/${abbreviation}.anm2`, true);
    g.speedrun.sprites.season.SetFrame("Default", 0);
  }

  // Local variables
  const digitLength = 7.25;
  const startingX = 23;
  const startingY = 79;
  let adjustment1 = 0;
  let adjustment2 = 0;
  if (g.speedrun.characterNum > 9) {
    adjustment1 = digitLength - 2;
    adjustment2 = adjustment1 - 1;
  }

  // Display the sprites
  let digit1 = g.speedrun.characterNum;
  let digit2 = -1;
  if (g.speedrun.characterNum > 9) {
    digit1 = 1;
    digit2 = g.speedrun.characterNum - 10;
  }
  let digit3 = 7; // Assume a 7 character speedrun by default
  let digit4 = -1;
  if (challenge === ChallengeCustom.R9_SEASON_1) {
    digit3 = 9;
  } else if (challenge === ChallengeCustom.R14_SEASON_1) {
    digit3 = 1;
    digit4 = 4;
  } else if (challenge === ChallengeCustom.R15_VANILLA) {
    digit3 = 1;
    digit4 = 5;
  }

  const posDigit1 = Vector(startingX, startingY);
  g.speedrun.sprites.digit[1].SetFrame("Default", digit1);
  g.speedrun.sprites.digit[1].RenderLayer(0, posDigit1);

  if (digit2 !== -1) {
    const posDigit2 = Vector(startingX + digitLength - 1, startingY);
    g.speedrun.sprites.digit[2].SetFrame("Default", digit2);
    g.speedrun.sprites.digit[2].RenderLayer(0, posDigit2);
  }

  const posSlash = Vector(startingX + digitLength - 1 + adjustment1, startingY);
  g.speedrun.sprites.slash.RenderLayer(0, posSlash);

  const posDigit3 = Vector(
    startingX + digitLength + adjustment2 + 5,
    startingY,
  );
  g.speedrun.sprites.digit[3].SetFrame("Default", digit3);
  g.speedrun.sprites.digit[3].RenderLayer(0, posDigit3);

  let posDigit4;
  if (digit4 !== -1) {
    posDigit4 = Vector(
      startingX + digitLength + adjustment2 + 3 + digitLength,
      startingY,
    );
    g.speedrun.sprites.digit[3].SetFrame("Default", digit4);
    g.speedrun.sprites.digit[3].RenderLayer(0, posDigit4);
  }

  let posSeason;
  const spacing = 17;
  if (posDigit4) {
    posSeason = Vector(posDigit4.X + spacing, posDigit4.Y);
  } else {
    posSeason = Vector(posDigit3.X + spacing, posDigit3.Y);
  }
  g.speedrun.sprites.season.SetFrame("Default", 0);
  g.speedrun.sprites.season.RenderLayer(0, posSeason);
}
