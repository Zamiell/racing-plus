import { saveDataManager } from "isaacscript-common";
import RaceData from "./features/race/types/RaceData";
import Globals from "./types/Globals";

const globals = new Globals();
export default globals;

const v = {
  run: globals.run,
};

export function init(): void {
  saveDataManager("globals", v);
}

declare let race: RaceData;
race = globals.race; // eslint-disable-line
