import { config } from "../../../../../modConfigMenu";
import * as cs from "../crawlSpace";
import * as td from "../trapdoor";

// GridEntityType.TRAPDOOR (17)
export function trapdoor(gridEntity: GridEntity): void {
  if (!config.fastTravel) {
    return;
  }

  td.postGridEntityUpdateTrapdoor(gridEntity);
}

// GridEntityType.CRAWL_SPACE (18)
export function crawlSpace(gridEntity: GridEntity): void {
  if (!config.fastTravel) {
    return;
  }

  cs.postGridEntityUpdateCrawlSpace(gridEntity);
}

// GridEntityType.TELEPORTER (23)
export function teleporter(gridEntity: GridEntity): void {
  if (!config.fastTravel) {
    return;
  }

  cs.postGridEntityUpdateTeleporter(gridEntity);
}
