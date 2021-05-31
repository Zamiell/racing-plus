import g from "../../../../../globals";
import * as blackSprite from "../blackSprite";
import * as checkStateComplete from "../checkStateComplete";
import * as nextFloor from "../nextFloor";

export function main(): void {
  if (!g.config.fastTravel) {
    return;
  }

  checkStateComplete.postRender();
  // This has to be done on every frame because the ControlsEnabled value will be reset by the game
  nextFloor.immobilizeAllPlayers();
  blackSprite.draw();
}
