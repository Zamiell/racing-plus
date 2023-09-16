import { characterProgressResetPersistentVars } from "../classes/features/speedrun/characterProgress/v";
import { randomCharacterOrderResetPersistentVars } from "../classes/features/speedrun/RandomCharacterOrder";
import { randomStartingBuildResetPersistentVars } from "../classes/features/speedrun/RandomStartingBuild";
import { speedrunTimerResetPersistentVars } from "../classes/features/speedrun/SpeedrunTimer";

export function speedrunResetPersistentVars(): void {
  characterProgressResetPersistentVars();
  speedrunTimerResetPersistentVars();
  randomCharacterOrderResetPersistentVars();
  randomStartingBuildResetPersistentVars();
}
