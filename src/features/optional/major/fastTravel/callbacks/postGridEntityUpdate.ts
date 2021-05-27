import g from "../../../../../globals";
import * as cs from "../crawlspace";
import * as td from "../trapdoor";

export function trapdoor(gridEntity: GridEntity, gridIndex: int): void {
  if (!g.config.fastTravel) {
    return;
  }

  td.postGridEntityUpdateTrapdoor(gridEntity, gridIndex);
}

export function crawlspace(gridEntity: GridEntity, gridIndex: int): void {
  if (!g.config.fastTravel) {
    return;
  }

  cs.postGridEntityUpdateCrawlspace(gridEntity, gridIndex);
}
