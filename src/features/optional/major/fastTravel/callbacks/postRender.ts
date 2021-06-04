import g from "../../../../../globals";
import * as blackSprite from "../blackSprite";
import * as checkStateComplete from "../checkStateComplete";

export function main(): void {
  if (!g.config.fastTravel) {
    return;
  }

  checkStateComplete.postRender();
  blackSprite.draw();
}
