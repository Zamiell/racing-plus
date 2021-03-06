import { fonts, game, getPlayerName, KColorDefault } from "isaacscript-common";
import { ChallengeCustom } from "../../../../enums/ChallengeCustom";
import g from "../../../../globals";
import { drawErrorText } from "../../../mandatory/errors";
import { getNumRoomsEntered } from "../../../utils/numRoomsEntered";
import { getTimeConsoleUsed } from "../../../utils/timeConsoleUsed";
import { getTimeGameOpened } from "../../../utils/timeGameOpened";
import {
  SEASON_2_LOCK_MILLISECONDS,
  SEASON_2_LOCK_SECONDS,
  SEASON_2_NUM_BANS,
} from "../constants";
import sprites from "../sprites";
import v from "../v";

const TOP_LEFT_GRID_INDEX = 32;
const TOP_RIGHT_GRID_INDEX = 42;
const SPRITE_TITLE_OFFSET = Vector(0, -30);
const SPRITE_ITEM_OFFSET = 15;

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

  drawStartingRoomSprites();
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

function drawStartingRoomSprites() {
  for (const [spriteName, sprite] of Object.entries(sprites)) {
    if (sprite !== null) {
      const position = getPosition(spriteName as keyof typeof sprites);
      sprite.RenderLayer(0, position);
    }
  }
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

function getPosition(spriteName: keyof typeof sprites) {
  const topLeftPositionGame = g.r.GetGridPosition(TOP_LEFT_GRID_INDEX);
  const topLeftPosition = Isaac.WorldToRenderPosition(topLeftPositionGame);
  const topRightPositionGame = g.r.GetGridPosition(TOP_RIGHT_GRID_INDEX);
  const topRightPosition = Isaac.WorldToRenderPosition(topRightPositionGame);

  switch (spriteName) {
    case "characterTitle": {
      return topLeftPosition.add(SPRITE_TITLE_OFFSET);
    }

    case "seededStartingTitle": {
      return topRightPosition.add(SPRITE_TITLE_OFFSET);
    }

    case "seededItemCenter": {
      return topRightPosition;
    }

    case "seededItemLeft": {
      return topRightPosition.add(Vector(SPRITE_ITEM_OFFSET * -1, 0));
    }

    case "seededItemRight": {
      return topRightPosition.add(Vector(SPRITE_ITEM_OFFSET, 0));
    }

    case "seededItemFarLeft": {
      return topRightPosition.add(Vector(SPRITE_ITEM_OFFSET * -3, 0));
    }

    case "seededItemFarRight": {
      return topRightPosition.add(Vector(SPRITE_ITEM_OFFSET * 3, 0));
    }

    default: {
      return error(
        `Starting room sprites named "${spriteName}" are unsupported.`,
      );
    }
  }
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
