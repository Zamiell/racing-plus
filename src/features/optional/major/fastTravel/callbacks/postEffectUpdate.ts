import g from "../../../../../globals";
import * as crawlspace from "../crawlspace";
import * as trapdoor from "../trapdoor";

export function trapdoorFastTravel(effect: EntityEffect): void {
  if (!g.config.fastTravel) {
    return;
  }

  trapdoor.postEffectUpdateTrapdoor(effect);
}

export function crawlspaceFastTravel(effect: EntityEffect): void {
  if (!g.config.fastTravel) {
    return;
  }

  crawlspace.postEffectUpdateCrawlspace(effect);
}

export function wombTrapdoorFastTravel(_effect: EntityEffect): void {
  if (!g.config.fastTravel) {
  }
}

export function blueWombTrapdoorFastTravel(_effect: EntityEffect): void {
  if (!g.config.fastTravel) {
  }
}

export function heavenDoorFastTravel(_effect: EntityEffect): void {
  if (!g.config.fastTravel) {
  }
}

export function voidPortalFastTravel(_effect: EntityEffect): void {
  if (!g.config.fastTravel) {
  }
}
