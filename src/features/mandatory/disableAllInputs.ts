import { saveDataManager } from "isaacscript-common";

const v = {
  run: {
    enableInputs: true,
  },
};

export function init(): void {
  saveDataManager("disableAllInputs", v);
}

export function isActionPressed(): boolean | void {
  return v.run.enableInputs ? undefined : false;
}

export function isActionTriggered(): boolean | void {
  return v.run.enableInputs ? undefined : false;
}

export function getActionValue(): float | void {
  return v.run.enableInputs ? undefined : 0;
}

export function enableAllInputs(): void {
  v.run.enableInputs = true;
}

export function disableAllInputs(): void {
  v.run.enableInputs = false;
}
