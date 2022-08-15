import { game } from "isaacscript-common";
import { ChallengeCustom } from "../../../../enums/ChallengeCustom";
import { drawErrorText } from "../../../mandatory/errors";
import { getTimeConsoleUsed } from "../../../utils/timeConsoleUsed";
import { getTimeGameOpened } from "../../../utils/timeGameOpened";
import {
  SEASON_2_LOCK_MILLISECONDS,
  SEASON_2_LOCK_SECONDS,
  SEASON_2_NUM_BANS,
} from "../constants";
import {
  drawSeason2StartingRoomSprites,
  drawSeason2StartingRoomText,
} from "../startingRoomSprites";
import v from "../v";

export function season2PostRender(): void {
  const hud = game.GetHUD();
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_2) {
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

  drawSeason2StartingRoomSprites();
  drawSeason2StartingRoomText();
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
  } else if (v.run.errors.bansRecentlySet) {
    action = `assigning your ${SEASON_2_NUM_BANS} build bans`;
    errorEventTime = v.persistent.timeBansSet;
  }

  if (action === null || errorEventTime === null) {
    return false;
  }

  const time = Isaac.GetTime();
  const endTime = errorEventTime + SEASON_2_LOCK_MILLISECONDS;
  const millisecondsRemaining = endTime - time;
  const secondsRemaining = Math.ceil(millisecondsRemaining / 1000);
  const text = getSeason2ErrorMessage(action, secondsRemaining);
  drawErrorText(text);
  return true;
}

function getSeason2ErrorMessage(action: string, secondsRemaining: int) {
  if (secondsRemaining > SEASON_2_LOCK_SECONDS) {
    return 'Please set your item vetos for Season 2 again in the "Change Char Order" custom challenge.';
  }

  const suffix = secondsRemaining > 1 ? "s" : "";
  const secondsRemainingText = `${secondsRemaining} second${suffix}`;
  const secondSentence =
    secondsRemaining > 0
      ? `Please wait ${secondsRemainingText} and then restart.`
      : "Please restart.";
  return `You are not allowed to start a new Season 2 run so soon after ${action}. ${secondSentence}`;
}
