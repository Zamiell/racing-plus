import { Globals } from "./classes/Globals";

export const g = new Globals();

declare let race: unknown;
race = g.race; // eslint-disable-line
