import * as streakText from "../features/mandatory/streakText";
import * as showPills from "../features/optional/quality/showPills";

export function main(pillEffect: PillEffect): void {
  // This callback does not pass the player, so we have to assume player 0 ate the pill
  const player = Isaac.GetPlayer();

  showPills.usePill(player, pillEffect);
  streakText.usePill(pillEffect);
}
