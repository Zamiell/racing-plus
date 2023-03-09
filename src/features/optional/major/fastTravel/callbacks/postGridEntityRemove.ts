import * as cs from "../../../../../classes/features/optional/major/fastTravel/crawlSpace";
import * as td from "../../../../../classes/features/optional/major/fastTravel/trapdoor";
import { config } from "../../../../../modConfigMenu";

// GridEntityType.TRAPDOOR (17)
export function trapdoor(gridIndex: int): void {
  if (!config.FastTravel) {
    return;
  }

  td.postGridEntityRemoveTrapdoor(gridIndex);
}

// GridEntityType.CRAWL_SPACE (18)
export function crawlSpace(gridIndex: int): void {
  if (!config.FastTravel) {
    return;
  }

  cs.postGridEntityRemoveCrawlSpace(gridIndex);
}
