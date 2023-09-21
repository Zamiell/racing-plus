import { ButtonAction } from "isaac-typescript-definitions";
import {
  fonts,
  isActionPressedOnAnyInput,
  KColorDefault,
} from "isaacscript-common";
import { SEASON_3_GOALS } from "./constants";
import { v } from "./v";

const FONT = fonts.droid;

export function season3CheckDrawGoals(): void {
  if (isActionPressedOnAnyInput(ButtonAction.MAP) || v.run.goalCompleted) {
    drawGoals();
  }
}

function drawGoals() {
  const x = 70;
  let baseY = 55;

  const pillsIdentifiedText = `Goals remaining: ${v.persistent.remainingGoals.length} / ${SEASON_3_GOALS.length}`;
  FONT.DrawString(pillsIdentifiedText, x, baseY - 9 + 20, KColorDefault);

  baseY += 20;
  for (const [i, goal] of v.persistent.remainingGoals.entries()) {
    const y = baseY + 20 * (i + 1);
    FONT.DrawString(`- ${goal}`, x, y - 9, KColorDefault);
  }
}
