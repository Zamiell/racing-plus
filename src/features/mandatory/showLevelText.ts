import g from "../../globals";
import { isActionPressedOnAnyInput } from "../../misc";

export function postUpdate(): void {
  // Players who prefer the vanilla streak text will have a separate mod enabled
  if (VanillaStreakText !== null) {
    return;
  }

  // Only show the floor name if the user is pressing tab
  if (!isActionPressedOnAnyInput(ButtonAction.ACTION_MAP)) {
    g.run.streakText.tabText = "";
    return;
  }

  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  g.run.streakText.tabText = g.l.GetName(stage, stageType, 0, 0, false);
}
