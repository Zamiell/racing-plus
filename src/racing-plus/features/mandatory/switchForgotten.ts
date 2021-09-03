import { saveDataManager } from "isaacscript-common";

const v = {
  run: {
    shouldSwitchToForgotten: false,
  },
};

export function init(): void {
  saveDataManager("switchForgotten", v);
}

// Manually switch from The Soul to The Forgotten in specific circumstances
export function actionDrop(): boolean | void {
  if (v.run.shouldSwitchToForgotten) {
    v.run.shouldSwitchToForgotten = false;
    return true;
  }

  return undefined;
}

export function forceSwitchToForgotten(): void {
  v.run.shouldSwitchToForgotten = true;
}
