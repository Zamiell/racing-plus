import { ButtonAction } from "isaac-typescript-definitions";
import { isActionPressedOnAnyInput } from "isaacscript-common";
import * as streakText from "./streakText";

// ModCallback.POST_UPDATE (1)
export function postUpdate(): void {
  // Players who prefer the vanilla streak text will have a separate mod enabled.
  if (VanillaStreakText !== undefined) {
    return;
  }

  // Only show the floor name if the user is pressing tab.
  if (!isActionPressedOnAnyInput(ButtonAction.MAP)) {
    streakText.setTab(null);
    return;
  }

  const levelText = streakText.getLevelText();
  streakText.setTab(levelText);
}
