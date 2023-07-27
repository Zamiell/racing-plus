import { ModCallback } from "isaac-typescript-definitions";
import { hasErrors } from "../classes/features/mandatory/misc/checkErrors/v";
import { racePostRender } from "../features/race/callbacks/postRender";
import * as customConsole from "../features/race/customConsole";
import { mod } from "../mod";

export function postNPCRenderInit(): void {
  mod.AddCallback(ModCallback.POST_RENDER, main);
}

function main() {
  // If there are any errors, we can skip the remainder of this function.
  if (hasErrors()) {
    return;
  }

  // Major
  racePostRender();

  // Other
  customConsole.postRender();
}
