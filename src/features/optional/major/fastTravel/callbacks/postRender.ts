import { config } from "../../../../../modConfigMenu";
import * as blackSprite from "../blackSprite";
import * as checkStateComplete from "../checkStateComplete";

export default function fastTravelPostRender(): void {
  if (!config.fastTravel) {
    return;
  }

  checkStateComplete.postRender();
  blackSprite.draw();
}