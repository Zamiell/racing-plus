import Globals from "./types/Globals";

const globals = new Globals();
export default globals;

// Set a global variable so that other mods can access our scoped global variables
declare let RacingPlusGlobals: Globals;
RacingPlusGlobals = globals; // eslint-disable-line
