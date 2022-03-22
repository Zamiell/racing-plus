import { Globals } from "./classes/Globals";

const globals = new Globals();
export default globals;

declare let race: unknown;
race = globals.race; // eslint-disable-line
