/* eslint-disable max-classes-per-file */

import { ModCallback, SeedEffect } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  game,
  getHUDOffsetVector,
  isBethany,
  isJacobOrEsau,
} from "isaacscript-common";
import {
  SPRITE_BETHANY_OFFSET,
  SPRITE_JACOB_ESAU_OFFSET,
} from "../../../constants";
import { shouldDrawPlaceLeftSprite } from "../../../features/race/placeLeft";
import {
  CHALLENGE_DEFINITIONS,
  CUSTOM_CHALLENGES_SET,
} from "../../../speedrun/constants";
import { ChallengeModFeature } from "../../ChallengeModFeature";
import { speedrunGetCharacterNum } from "./characterProgress/v";

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
      sprite.SetFrame("Default", 0);

      // Make the numbers a bit smaller than the ones used for the timer.
      sprite.Scale = Vector(0.9, 0.9);
    }

    this.slash.Load("gfx/timer/slash.anm2", true);
    this.slash.SetFrame("Default", 0);
  }
}

const sprites = new CharacterProgressSprites();

/** The sprite on the left hand side of the screen that shows "1 / 7". */
export class DrawCharacterProgress extends ChallengeModFeature {
  challenge = CUSTOM_CHALLENGES_SET;

  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    this.drawCharacterProgressAndSeasonIcon();
  }

  drawCharacterProgressAndSeasonIcon(): void {
    const hud = game.GetHUD();
    if (!hud.IsVisible()) {
      return;
    }

    // The `HUD.IsVisible` method does not take into account `SeedEffect.NO_HUD`.
    const seeds = game.GetSeeds();
    if (seeds.HasSeedEffect(SeedEffect.NO_HUD)) {
      return;
    }

    const characterNum = speedrunGetCharacterNum();

    let position = STARTING_POSITION;
    const HUDOffsetVector = getHUDOffsetVector();
    position = position.add(HUDOffsetVector);

    if (shouldDrawPlaceLeftSprite()) {
      position = position.add(RACE_PLACE_OFFSET);
    }

    const digitLength = 7.25;
    let adjustment1 = 0;
    let adjustment2 = 0;
    if (characterNum > 9) {
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
    let digit1 = characterNum;
    let digit2 = -1;
    if (characterNum > 9) {
      digit1 = 1;
      digit2 = characterNum - 10;
    }
    const digit3 = 7; // Assume a 7 character speedrun by default.

    sprites.digits.digit1.SetFrame("Default", digit1);
    sprites.digits.digit1.Render(position);

    if (digit2 !== -1) {
      sprites.digits.digit2.SetFrame("Default", digit2);
      const digit2Modification = Vector(digitLength - 1, 0);
      const digit2Position = position.add(digit2Modification);
      sprites.digits.digit2.Render(digit2Position);
    }

    const slashModification = Vector(digitLength - 1 + adjustment1, 0);
    const slashPosition = position.add(slashModification);
    sprites.slash.Render(slashPosition);

    sprites.digits.digit3.SetFrame("Default", digit3);
    const digit3Modification = Vector(digitLength + adjustment2 + 5, 0);
    const digit3Position = position.add(digit3Modification);
    sprites.digits.digit3.Render(digit3Position);

    // Draw the sprite for the season icon.
    const spacing = 17;
    const posSeason = Vector(digit3Position.X + spacing, digit3Position.Y);
    sprites.seasonIcon.Render(posSeason);
  }

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReorderedFalse(): void {
    this.initSeasonIconSprite();
  }

  initSeasonIconSprite(): void {
    const challenge = Isaac.GetChallenge();
    const challengeDefinition = CHALLENGE_DEFINITIONS.get(challenge);
    if (challengeDefinition === undefined) {
      error("Failed to get the challenge definition.");
    }
    const { challengeCustomAbbreviation } = challengeDefinition;

    sprites.seasonIcon.Load(
      `gfx/speedrun/${challengeCustomAbbreviation}.anm2`,
      true,
    );
    sprites.seasonIcon.SetFrame("Default", 0);
  }
}
