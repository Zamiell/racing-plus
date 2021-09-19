import { gridToPos } from "isaacscript-common";
import { KCOLOR_DEFAULT } from "../../../constants";
import g from "../../../globals";
import { ChallengeCustom } from "../../speedrun/enums";
import * as buttons from "../buttons";
import { CHANGE_CHAR_ORDER_POSITIONS } from "../constants";
import ChangeCharOrderPhase from "../types/ChangeCharOrderPhase";
import v from "../v";

export default function charCharOrderPostRender(): void {
  const challenge = Isaac.GetChallenge();
  if (challenge !== ChallengeCustom.CHANGE_CHAR_ORDER) {
    return;
  }

  disableControls();
  drawCurrentChoosingActivity();
  buttons.postRender();
  drawCharacterSprites();
}

function disableControls() {
  const gameFrameCount = g.g.GetFrameCount();
  const player = Isaac.GetPlayer();

  // Disable the controls or else the player will be able to move around while the screen is still
  // black
  if (gameFrameCount < 1) {
    player.ControlsEnabled = false;
  } else {
    player.ControlsEnabled = true;
  }
}

function drawCurrentChoosingActivity() {
  const posActivityGame = gridToPos(6, 6);
  const posActivity = Isaac.WorldToScreen(posActivityGame);
  posActivity.Y -= 15;
  const text = getTextForCurrentActivity(v.room.phase);
  const length = g.fontDroid.GetStringWidthUTF8(text);
  g.fontDroid.DrawString(
    text,
    posActivity.X - length / 2,
    posActivity.Y,
    KCOLOR_DEFAULT,
    0,
    true,
  );
}

function getTextForCurrentActivity(phase: ChangeCharOrderPhase) {
  switch (phase) {
    case ChangeCharOrderPhase.SEASON_SELECT: {
      return "Choose your season";
    }

    case ChangeCharOrderPhase.CHARACTER_SELECT: {
      return "Choose your character order";
    }

    default: {
      return "Unknown";
    }
  }
}

function drawCharacterSprites() {
  if (v.room.seasonChosenAbbreviation === null) {
    return;
  }
  const season = CHANGE_CHAR_ORDER_POSITIONS[v.room.seasonChosenAbbreviation];

  // Render the character sprites
  for (let i = 0; i < v.room.sprites.characters.length; i++) {
    const characterSprite = v.room.sprites.characters[i];
    const [, x, y] = season.charPositions[i];

    let posCharGame;
    if (v.room.sprites.characters.length === 1) {
      posCharGame = gridToPos(6, 5); // The bottom-center of the room
    } else {
      posCharGame = gridToPos(x, y - 1); // We want it to be one tile above the button
    }

    const posChar = Isaac.WorldToScreen(posCharGame);
    posChar.Y += 10; // Nudge it a bit upwards to make it look better

    characterSprite.Render(posChar, Vector.Zero, Vector.Zero);
  }
}
