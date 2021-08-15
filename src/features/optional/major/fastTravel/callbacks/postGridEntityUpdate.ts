import { config } from "../../../../../modConfigMenu";
import * as cs from "../crawlspace";
import * as td from "../trapdoor";

// GridEntityType.GRID_TRAPDOOR (17)
export function trapdoor(gridEntity: GridEntity): void {
  if (!config.fastTravel) {
    return;
  }

  td.postGridEntityUpdateTrapdoor(gridEntity);
}

// GridEntityType.GRID_STAIRS (18)
export function crawlspace(gridEntity: GridEntity): void {
  if (!config.fastTravel) {
    return;
  }

  cs.postGridEntityUpdateCrawlspace(gridEntity);
}

// GridEntityType.GRID_TELEPORTER (23)
export function teleporter(gridEntity: GridEntity): void {
  if (!config.fastTravel) {
    return;
  }

  cs.postGridEntityUpdateTeleporter(gridEntity);
}
