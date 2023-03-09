import * as cs from "../../../../../classes/features/optional/major/fastTravel/crawlSpace";
import * as td from "../../../../../classes/features/optional/major/fastTravel/trapdoor";
import { config } from "../../../../../modConfigMenu";

// GridEntityType.TRAPDOOR (17)
export function trapdoor(gridEntity: GridEntity): void {
  if (!config.FastTravel) {
    return;
  }

  td.postGridEntityUpdateTrapdoor(gridEntity);
}

// GridEntityType.CRAWL_SPACE (18)
export function crawlSpace(gridEntity: GridEntity): void {
  if (!config.FastTravel) {
    return;
  }

  cs.postGridEntityUpdateCrawlSpace(gridEntity);
}
