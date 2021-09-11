import { config } from "../../../../../modConfigMenu";
import * as cs from "../crawlspace";
import * as td from "../trapdoor";

export function trapdoor(gridIndex: int): void {
  if (!config.fastTravel) {
    return;
  }

  td.postGridEntityRemoveTrapdoor(gridIndex);
}

export function crawlspace(gridIndex: int): void {
  if (!config.fastTravel) {
    return;
  }

  cs.postGridEntityRemoveCrawlspace(gridIndex);
}
