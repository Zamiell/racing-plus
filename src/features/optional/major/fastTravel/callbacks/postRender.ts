import { game, getPlayers, VectorZero } from "isaacscript-common";
import * as blackSprite from "../../../../../classes/features/optional/major/fastTravel/blackSprite";
import * as checkStateComplete from "../../../../../classes/features/optional/major/fastTravel/checkStateComplete";
import { v } from "../../../../../classes/features/optional/major/fastTravel/v";
import { FastTravelState } from "../../../../../enums/FastTravelState";
import { config } from "../../../../../modConfigMenu";

export function fastTravelPostRender(): void {
  if (!config.FastTravel) {
    return;
  }

  checkStateComplete.postRender();
  blackSprite.draw();
  keepPlayerInPosition();
}

/**
 * If a player is using a Mega Blast and uses a fast-travel entity, then they will slide in the
 * direction of the blast. Prevent this from happening by snapping them to the grid on every render
 * frame.
 */
function keepPlayerInPosition() {
  if (
    v.run.state !== FastTravelState.FADING_TO_BLACK &&
    v.run.state !== FastTravelState.FADING_IN
  ) {
    return;
  }

  for (const player of getPlayers()) {
    const room = game.GetRoom();
    const gridIndex = room.GetGridIndex(player.Position);
    const gridPosition = room.GetGridPosition(gridIndex);
    player.Position = gridPosition;
    player.Velocity = VectorZero;
  }
}
