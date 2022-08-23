import { ItLivesSituation } from "../../../enums/ItLivesSituation";
import { Season3Goal } from "./constants";
import v from "./v";

export function season3PostItLivesPath(): ItLivesSituation {
  if (v.persistent.remainingGoals.includes(Season3Goal.MEGA_SATAN)) {
    return ItLivesSituation.BOTH;
  }

  const hasBlueBaby = v.persistent.remainingGoals.includes(
    Season3Goal.BLUE_BABY,
  );
  const hasLamb = v.persistent.remainingGoals.includes(Season3Goal.THE_LAMB);

  if (hasBlueBaby && hasLamb) {
    return ItLivesSituation.BOTH;
  }

  if (hasBlueBaby) {
    return ItLivesSituation.HEAVEN_DOOR;
  }

  if (hasLamb) {
    return ItLivesSituation.TRAPDOOR;
  }

  return ItLivesSituation.NEITHER;
}
