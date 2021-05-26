import Config from "./Config";
import GlobalsRun from "./GlobalsRun";
import Hotkeys from "./Hotkeys";
import RaceData from "./RaceData";
import SpeedrunData from "./SpeedrunData";

export default interface GlobalsToSave {
  config?: Config;
  hotkeys?: Hotkeys;
  run?: GlobalsRun;
  race?: RaceData;
  speedrun?: SpeedrunData;
}
