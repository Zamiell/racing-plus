import { ModCallback } from "isaac-typescript-definitions";
import { racePostUpdate } from "../features/race/callbacks/postUpdate";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(ModCallback.POST_UPDATE, main);
}

function main() {
  // Major
  racePostUpdate();
}
