import { Globals } from "./types/Globals";

const globals = new Globals();
export default globals;

// Set it as a global variable for troubleshooting purposes
declare let g: unknown;
g = globals; // eslint-disable-line
