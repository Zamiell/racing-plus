import { Keyboard, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  RENDER_FRAMES_PER_SECOND,
  game,
  getScreenCenterPos,
  isKeyboardPressed,
} from "isaacscript-common";
import { MOD_NAME, VERSION } from "../../../../constants";
import { MandatoryModFeature } from "../../../MandatoryModFeature";

const SHOW_VERSION_HOTKEY = Keyboard.F1;
const SECONDS_SHOWN = 2;

const v = {
  run: {
    showVersionUntilRenderFrame: null as int | null,
  },
};

export class DrawVersion extends MandatoryModFeature {
  v = v;

  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    const hud = game.GetHUD();

    if (!hud.IsVisible()) {
      return;
    }

    if (ModConfigMenu !== undefined && ModConfigMenu.IsVisible) {
      return;
    }

    // We do not have to check to see if the game is paused because the text will not be drawn on
    // top of the pause menu.

    this.checkInput();
    this.checkDraw();
  }

  /** Make the version persist for a while after the player presses the hotkey. */
  checkInput(): void {
    if (isKeyboardPressed(SHOW_VERSION_HOTKEY)) {
      const renderFrameCount = Isaac.GetFrameCount();
      v.run.showVersionUntilRenderFrame =
        renderFrameCount + SECONDS_SHOWN * RENDER_FRAMES_PER_SECOND;
    }
  }

  checkDraw(): void {
    const renderFrameCount = Isaac.GetFrameCount();

    if (
      v.run.showVersionUntilRenderFrame === null ||
      renderFrameCount >= v.run.showVersionUntilRenderFrame
    ) {
      return;
    }

    const centerPos = getScreenCenterPos();
    let text: string;
    let x: int;
    let y: int;

    text = MOD_NAME;
    x = centerPos.X - 3 * text.length;
    y = centerPos.Y + 40;
    Isaac.RenderText(text, x, y, 2, 2, 2, 2);

    text = `v${VERSION}`;
    x = centerPos.X - 3 * text.length;
    y += 15;
    Isaac.RenderText(text, x, y, 2, 2, 2, 2);
  }
}
