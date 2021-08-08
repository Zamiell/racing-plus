import { saveDataManager } from "isaacscript-common";

const v = {
  room: {
    showEndOfRunText: false,
  },
};
export default v;

export function init(): void {
  saveDataManager("speedrun", v, featureEnabled);
}

function featureEnabled() {
  const challenge = Isaac.GetChallenge();
  return challenge !== Challenge.CHALLENGE_NULL;
}
