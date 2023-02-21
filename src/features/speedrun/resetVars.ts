import { randomCharacterOrderResetPersistentVars } from "../../classes/features/speedrun/RandomCharacterOrder";
import { speedrunResetPersistentVarsSpeedrun } from "./v";

export function speedrunResetPersistentVars(): void {
  speedrunResetPersistentVarsSpeedrun();
  randomCharacterOrderResetPersistentVars();
}
