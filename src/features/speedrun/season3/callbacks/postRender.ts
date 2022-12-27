import { ButtonAction } from "isaac-typescript-definitions";
import {
  fonts,
  game,
  isActionPressedOnAnyInput,
  KColorDefault,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../../enums/ChallengeCustom";
import { SEASON_3_GOALS } from "../constants";
import {
  drawSeason3StartingRoomSprites,
  drawSeason3StartingRoomText,
} from "../startingRoomSprites";
import v from "../v";

export function season3PostRender(): void {
  const challenge = Isaac.GetChallenge();
  if (challenge !== ChallengeCustom.SEASON_3) {
    return;
  }

  const hud = game.GetHUD();
  if (!hud.IsVisible()) {
    return;
  }

  drawSeason3StartingRoomSprites();
  drawSeason3StartingRoomText();
  checkDrawGoals();
}

function checkDrawGoals() {
  if (isActionPressedOnAnyInput(ButtonAction.MAP) || v.run.goalCompleted) {
    drawGoals();
  }
}

function drawGoals() {
  const font = fonts.droid;

  const x = 70;
  let baseY = 55;

  const pillsIdentifiedText = `Goals remaining: ${v.persistent.remainingGoals.length} / ${SEASON_3_GOALS.length}`;
  font.DrawString(pillsIdentifiedText, x, baseY - 9 + 20, KColorDefault);

  baseY += 20;
  v.persistent.remainingGoals.forEach((goal, i) => {
    const y = baseY + 20 * (i + 1);
    font.DrawString(`- ${goal}`, x, y - 9, KColorDefault);
  });
}
