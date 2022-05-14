import { config } from "../../../../../modConfigMenu";
import * as cs from "../crawlSpace";
import * as td from "../trapdoor";

// GridEntityType.TRAPDOOR (17)
export function trapdoor(gridIndex: int): void {
  if (!config.fastTravel) {
    return;
  }

  td.postGridEntityRemoveTrapdoor(gridIndex);
}

// GridEntityType.CRAWL_SPACE (18)
export function crawlSpace(gridIndex: int): void {
  if (!config.fastTravel) {
    return;
  }

  cs.postGridEntityRemoveCrawlspace(gridIndex);
}
