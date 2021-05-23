import { ChallengeCustom } from "../features/speedrun/enums";

export default class SpeedrunData {
  fastReset = false;
  characterNum = 1;
  characterOrder = new LuaTable<ChallengeCustom, int[]>();
}
