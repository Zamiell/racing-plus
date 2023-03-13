import { ButtonAction, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  getEnglishLevelName,
  isActionPressedOnAnyInput,
} from "isaacscript-common";
import { setStreakTextMap } from "../../../../features/mandatory/streakText";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

export class ShowLevelTextOnMap extends MandatoryModFeature {
  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    // Players who prefer the vanilla streak text will have a separate mod enabled.
    if (VanillaStreakText !== undefined) {
      return;
    }

    // Only show the floor name if the user is pressing tab.
    if (!isActionPressedOnAnyInput(ButtonAction.MAP)) {
      setStreakTextMap(null);
      return;
    }

    const levelText = getEnglishLevelName();
    setStreakTextMap(levelText);
  }
}
