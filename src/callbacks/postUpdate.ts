import { ModCallback } from "isaac-typescript-definitions";
import * as fireworks from "../features/mandatory/fireworks";
import * as showLevelTextOnTab from "../features/mandatory/showLevelTextOnTab";
import { racePostUpdate } from "../features/race/callbacks/postUpdate";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(ModCallback.POST_UPDATE, main);
}

function main() {
  // Mandatory
  fireworks.postUpdate();
  showLevelTextOnTab.postUpdate();

  // Major
  racePostUpdate();
}
