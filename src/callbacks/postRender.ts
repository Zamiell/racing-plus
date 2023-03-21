import { ModCallback } from "isaac-typescript-definitions";
import { hasErrors } from "../classes/features/mandatory/misc/checkErrors/v";
import { racePostRender } from "../features/race/callbacks/postRender";
import * as customConsole from "../features/race/customConsole";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(ModCallback.POST_RENDER, main);
}

function main() {
  /*
  if (game.GetFrameCount() === 0) {
    const sadOnion = getCollectibleGfxFilename(CollectibleType.SAD_ONION);
    sprite.ReplaceSpritesheet(1, sadOnion);
    sprite.LoadGraphics();
    sprite.Play("throw", true);
    sprite.PlaybackSpeed = 0.25;
    Isaac.DebugString("GETTING HERE - LOADED SPRITE");
  } else {
    sprite.Update();
  }

  const room = game.GetRoom();
  const centerPos = room.GetCenterPos();
  const centerRenderPos = Isaac.WorldToScreen(centerPos);
  sprite.Render(centerRenderPos);
  */

  // If there are any errors, we can skip the remainder of this function.
  if (hasErrors()) {
    return;
  }

  // Major
  racePostRender();

  // Other
  customConsole.postRender();
}
