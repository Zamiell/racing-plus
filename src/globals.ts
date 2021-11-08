import { RaceData } from "./features/race/types/RaceData";
import { Globals } from "./types/Globals";

const globals = new Globals();
export default globals;

declare let race: RaceData;
race = globals.race; // eslint-disable-line
