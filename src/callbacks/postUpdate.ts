import { ModCallback } from "isaac-typescript-definitions";
import * as fireworks from "../features/mandatory/fireworks";
import { seededDeathPostUpdate } from "../features/mandatory/seededDeath/callbacks/postUpdate";
import * as showLevelTextOnTab from "../features/mandatory/showLevelTextOnTab";
import { fastClearPostUpdate } from "../features/optional/major/fastClear/callbacks/postUpdate";
import { fastTravelPostUpdate } from "../features/optional/major/fastTravel/callbacks/postUpdate";
import { racePostUpdate } from "../features/race/callbacks/postUpdate";
import { mod } from "../mod";

export function init(): void {
  mod.AddCallback(ModCallback.POST_UPDATE, main);
}

function main() {
  // Mandatory
  seededDeathPostUpdate();
  fireworks.postUpdate();
  showLevelTextOnTab.postUpdate();

  // Major
  racePostUpdate();
  fastClearPostUpdate();
  fastTravelPostUpdate();
}
