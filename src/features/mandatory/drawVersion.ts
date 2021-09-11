import {
  getScreenCenter,
  isKeyboardPressed,
  saveDataManager,
} from "isaacscript-common";
import { VERSION } from "../../constants";
import g from "../../globals";

const v = {
  run: {
    showVersionFrame: null as int | null,
  },
};

export function init(): void {
  saveDataManager("drawVersion", v);
}

export function postRender(): void {
  const gameFrameCount = g.g.GetFrameCount();
  const isPaused = g.g.IsPaused();

  if (isPaused) {
    return;
  }

  // Make the version persist for at least 2 seconds after the player presses "v"
  if (isKeyboardPressed(Keyboard.KEY_F1)) {
    v.run.showVersionFrame = gameFrameCount + 60;
  }

  if (
    v.run.showVersionFrame === null ||
    gameFrameCount > v.run.showVersionFrame
  ) {
    return;
  }

  const center = getScreenCenter();
  let text: string;
  let x: int;
  let y: int;

  text = "Racing+";
  x = center.X - 3 * text.length;
  y = center.Y + 40;
  Isaac.RenderText(text, x, y, 2, 2, 2, 2);

  text = `v${VERSION}`;
  x = center.X - 3 * text.length;
  y += 15;
  Isaac.RenderText(text, x, y, 2, 2, 2, 2);
}
