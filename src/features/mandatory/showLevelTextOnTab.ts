import { ButtonAction } from "isaac-typescript-definitions";
import {
  getEnglishLevelName,
  isActionPressedOnAnyInput,
} from "isaacscript-common";
import { setStreakTextTab } from "./streakText";

// ModCallback.POST_UPDATE (1)
export function postUpdate(): void {
  // Players who prefer the vanilla streak text will have a separate mod enabled.
  if (VanillaStreakText !== undefined) {
    return;
  }

  // Only show the floor name if the user is pressing tab.
  if (!isActionPressedOnAnyInput(ButtonAction.MAP)) {
    setStreakTextTab(null);
    return;
  }

  const levelText = getEnglishLevelName();
  setStreakTextTab(levelText);
}
