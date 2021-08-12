import { saveDataManager } from "isaacscript-common";
import Globals from "./types/Globals";

const globals = new Globals();
export default globals;

const v = {
  persistent: {
    foo: false,
  },

  run: globals.run,
};

export function init(): void {
  saveDataManager("globals", v);
}
