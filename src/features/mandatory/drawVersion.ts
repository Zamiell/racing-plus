import { Keyboard } from "isaac-typescript-definitions";
import {
  getScreenCenterPos,
  isKeyboardPressed,
  saveDataManager,
} from "isaacscript-common";
import { VERSION } from "../../constants";
import g from "../../globals";

const SHOW_VERSION_ACTIVATION_HOTKEY = Keyboard.F1;

const v = {
  run: {
    showVersionFrame: null as int | null,
  },
};

export function init(): void {
  saveDataManager("drawVersion", v);
}

// ModCallback.POST_RENDER (2)
export function postRender(): void {
  const hud = g.g.GetHUD();
  const gameFrameCount = g.g.GetFrameCount();

  if (!hud.IsVisible()) {
    return;
  }

  // We do not have to check to see if the game is paused because the text will not be drawn on top
  // of the pause menu.

  // Make the version persist for at least 2 seconds after the player presses the hotkey.
  if (isKeyboardPressed(SHOW_VERSION_ACTIVATION_HOTKEY)) {
    v.run.showVersionFrame = gameFrameCount + 60;
  }

  if (
    v.run.showVersionFrame === null ||
    gameFrameCount > v.run.showVersionFrame
  ) {
    return;
  }

  const centerPos = getScreenCenterPos();
  let text: string;
  let x: int;
  let y: int;

  text = "Racing+";
  x = centerPos.X - 3 * text.length;
  y = centerPos.Y + 40;
  Isaac.RenderText(text, x, y, 2, 2, 2, 2);

  text = `v${VERSION}`;
  x = centerPos.X - 3 * text.length;
  y += 15;
  Isaac.RenderText(text, x, y, 2, 2, 2, 2);
}
