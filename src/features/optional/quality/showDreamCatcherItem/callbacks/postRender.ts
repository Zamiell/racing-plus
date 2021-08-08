import { config } from "../../../../../modConfigMenu";
import DreamCatcherWarpState from "../../../../../types/DreamCatcherWarpState";
import { centerPlayers } from "../../../../mandatory/centerStart";
import * as sprites from "../sprites";
import v from "../v";

export default function showDreamCatcherItemPostRender(): void {
  if (!config.showDreamCatcherItem) {
    return;
  }

  repositionPlayer();
  sprites.draw();
}

function repositionPlayer() {
  if (v.level.warpState === DreamCatcherWarpState.RepositioningPlayer) {
    v.level.warpState = DreamCatcherWarpState.Finished;
    centerPlayers();
  }
}
