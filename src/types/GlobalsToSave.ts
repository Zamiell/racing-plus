import RaceData from "../features/race/types/RaceData";
import SpeedrunData from "../features/speedrun/types/SpeedrunData";
import Config from "./Config";
import GlobalsRun from "./GlobalsRun";
import Hotkeys from "./Hotkeys";

export default interface GlobalsToSave {
  config?: Config;
  hotkeys?: Hotkeys;
  run?: GlobalsRun;
  race?: RaceData;
  speedrun?: SpeedrunData;
}
