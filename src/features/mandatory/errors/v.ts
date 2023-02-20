import { mod } from "../../../mod";

export const v = {
  run: {
    afterbirthPlus: false,
    corrupted: false,
    incompleteSave: false,
    otherModsEnabled: false,
    babiesModEnabled: false,
    invalidCharOrder: false,
  },
};

export function errorsInit(): void {
  mod.saveDataManager("errors", v);
}

export function hasErrors(): boolean {
  const errors = Object.values(v.run);
  return errors.includes(true);
}
