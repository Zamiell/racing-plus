import {
  fonts,
  game,
  getPlayerName,
  KColorDefault,
  todo,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../../enums/ChallengeCustom";
import g from "../../../../globals";
import { drawErrorText } from "../../../mandatory/errors";
import { getNumRoomsEntered } from "../../../utils/numRoomsEntered";
import { getTimeConsoleUsed } from "../../../utils/timeConsoleUsed";
import { getTimeGameOpened } from "../../../utils/timeGameOpened";
import { SEASON_3_LOCK_MILLISECONDS } from "../constants";
import v from "../v";

const TOP_LEFT_GRID_INDEX = 32;

export function season3PostRender(): void {
  const hud = game.GetHUD();
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_3) {
    return;
  }

  if (!hud.IsVisible()) {
    return;
  }

  // We do not have to check if the game is paused because the pause menu will be drawn on top of
  // the starting room sprites. (And we do not have to worry about the room slide animation because
  // the starting room sprites are not shown once we re-enter the room.)

  if (drawErrors()) {
    return;
  }

  todo("draw diversity sprites");
  drawStartingRoomText();
}

function drawErrors() {
  let action: string | null = null;
  let errorEventTime: int | null = null;
  if (v.run.errors.gameRecentlyOpened) {
    action = "opening the game";
    errorEventTime = getTimeGameOpened();
  } else if (v.run.errors.consoleRecentlyUsed) {
    action = "using the console";
    errorEventTime = getTimeConsoleUsed();
  }

  if (action === null || errorEventTime === null) {
    return false;
  }

  const time = Isaac.GetTime();
  const endTime = errorEventTime + SEASON_3_LOCK_MILLISECONDS;
  const millisecondsRemaining = endTime - time;
  const secondsRemaining = Math.ceil(millisecondsRemaining / 1000);
  const text = getSeason2ErrorMessage(action, secondsRemaining);
  drawErrorText(text);
  return true;
}

function getSeason2ErrorMessage(action: string, secondsRemaining: int) {
  const suffix = secondsRemaining > 1 ? "s" : "";
  const secondsRemainingText = `${secondsRemaining} second${suffix}`;
  const secondSentence =
    secondsRemaining > 0
      ? `Please wait ${secondsRemainingText} and then restart.`
      : "Please restart.";
  return `You are not allowed to start a new Season 3 run so soon after ${action}. ${secondSentence}`;
}

function drawStartingRoomText() {
  const numRoomsEntered = getNumRoomsEntered();

  if (numRoomsEntered !== 1) {
    return;
  }

  const player = Isaac.GetPlayer();
  const characterName = getPlayerName(player);

  const positionGame = g.r.GetGridPosition(TOP_LEFT_GRID_INDEX);
  let position = Isaac.WorldToRenderPosition(positionGame);
  position = position.add(Vector(0, -11));

  const font = fonts.droid;
  const length = font.GetStringWidthUTF8(characterName);

  font.DrawString(
    characterName,
    position.X - length / 2,
    position.Y,
    KColorDefault,
  );
}
