import { ChallengeCustom } from "../enums";

export default class SpeedrunData {
  characterNum = 1;
  characterOrder = new LuaTable<ChallengeCustom, int[]>();
  fastReset = false;

  startedTime = -1;
  startedFrame = -1;

  finished = false;
  finishedTime = -1;
  finishedFrames = -1;

  startedCharTime = -1;
  characterRunTimes: int[] = [];
}
