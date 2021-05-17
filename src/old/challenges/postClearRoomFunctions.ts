import { ChallengeCustom } from "./constants";
import * as season6 from "./season6";
import * as season9 from "./season9";

const functionMap = new Map<int, () => void>();
export default functionMap;

functionMap.set(ChallengeCustom.R7_SEASON_6, () => {
  season6.postClearRoom();
});

functionMap.set(ChallengeCustom.R7_SEASON_9, () => {
  season9.postClearRoom();
});
