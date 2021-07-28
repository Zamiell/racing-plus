// We replace the vanilla streak text because it blocks the map occasionally

import g from "../../globals";
import { gridToPos } from "../../utilGlobals";

const FRAMES_BEFORE_FADE = 50;

export function postRender(): void {
  checkDraw();
}

function checkDraw() {
  // Players who prefer the vanilla streak text will have a separate mod enabled
  if (VanillaStreakText !== undefined) {
    return;
  }

  if (g.run.streakText.frame === 0) {
    // Only draw the tab text if there is no normal streak text showing
    if (g.run.streakText.tabText !== "") {
      draw(g.run.streakText.tabText, 1);
    }

    return;
  }

  // The streak text will slowly fade out
  const elapsedFrames = Isaac.GetFrameCount() - g.run.streakText.frame;
  let fade: float;
  if (elapsedFrames <= FRAMES_BEFORE_FADE) {
    fade = 1;
  } else {
    const fadeFrames = elapsedFrames - FRAMES_BEFORE_FADE;
    fade = 1 - 0.02 * fadeFrames;
  }
  if (fade <= 0) {
    g.run.streakText.frame = 0;
    return;
  }

  draw(g.run.streakText.text, fade);
}

function draw(text: string, fade: float) {
  const positionGame = gridToPos(6, 0); // Below the top door
  const position = Isaac.WorldToRenderPosition(positionGame);
  const color = KColor(1, 1, 1, fade);
  const scale = 1;
  const length = g.font.GetStringWidthUTF8(text) * scale;
  g.font.DrawStringScaled(
    text,
    position.X - length / 2,
    position.Y,
    scale,
    scale,
    color,
    0,
    true,
  );
}

export function set(text: string): void {
  g.run.streakText.text = text;
  g.run.streakText.frame = Isaac.GetFrameCount();
}
