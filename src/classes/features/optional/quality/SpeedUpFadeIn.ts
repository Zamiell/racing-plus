import { ModCallback } from "isaac-typescript-definitions";
import { Callback, game } from "isaacscript-common";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

/** This is fine tuned from trial and error to be a good speed. */
const FADE_IN_SPEED = 0.15;

const v = {
  run: {
    spedUpFadeIn: false,
  },
};

/** Get rid of the slow fade-in at the beginning of a run. */
export class SpeedUpFadeIn extends ConfigurableModFeature {
  configKey: keyof Config = "SpeedUpFadeIn";
  v = v;

  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    if (this.shouldSpeedUpFadeIn()) {
      this.speedUpFadeIn();
    }
  }

  shouldSpeedUpFadeIn(): boolean {
    const gameFrameCount = game.GetFrameCount();
    return !v.run.spedUpFadeIn && gameFrameCount === 0;
  }

  speedUpFadeIn(): void {
    v.run.spedUpFadeIn = true;
    game.Fadein(FADE_IN_SPEED);
  }
}
