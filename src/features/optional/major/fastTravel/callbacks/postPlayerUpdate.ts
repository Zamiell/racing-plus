import g from "../../../../../globals";
import * as crawlspace from "../crawlspace";

export function main(player: EntityPlayer): void {
  if (!g.config.fastTravel) {
    return;
  }

  crawlspace.postPlayerUpdate(player);
}
