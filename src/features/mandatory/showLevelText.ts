import { isActionPressedOnAnyInput } from "isaacscript-common";
import * as streakText from "./streakText";

export function postUpdate(): void {
  // Players who prefer the vanilla streak text will have a separate mod enabled
  if (VanillaStreakText !== null) {
    return;
  }

  // Only show the floor name if the user is pressing tab
  if (!isActionPressedOnAnyInput(ButtonAction.ACTION_MAP)) {
    streakText.setTab(null);
    return;
  }

  const levelText = streakText.getLevelText();
  streakText.setTab(levelText);
}
