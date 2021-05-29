import g from "../../../../../globals";
import * as cs from "../crawlspace";
import * as td from "../trapdoor";

export function trapdoor(gridEntity: GridEntity): void {
  if (!g.config.fastTravel) {
    return;
  }

  td.postGridEntityUpdateTrapdoor(gridEntity);
}

export function crawlspace(gridEntity: GridEntity): void {
  if (!g.config.fastTravel) {
    return;
  }

  cs.postGridEntityUpdateCrawlspace(gridEntity);
}
