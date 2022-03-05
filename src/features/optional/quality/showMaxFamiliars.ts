import {
  countEntities,
  MAX_NUM_FAMILIARS,
  saveDataManager,
} from "isaacscript-common";
import { config } from "../../../modConfigMenu";
import { initSprite } from "../../../sprite";

const SPRITE_POSITION = Vector(35, 33); // To the right of the coin count

const sprite = initSprite("gfx/ui/max_familiars.anm2");

const v = {
  run: {
    haveMaxFamiliars: false,
  },
};

export function init(): void {
  saveDataManager("showMaxFamiliars", v, featureEnabled);
}

function featureEnabled() {
  return config.showMaxFamiliars;
}

// ModCallbacks.MC_POST_UPDATE (1)
export function postUpdate(): void {
  if (!config.showMaxFamiliars) {
    return;
  }

  const numFamiliars = countEntities(EntityType.ENTITY_FAMILIAR);
  v.run.haveMaxFamiliars = numFamiliars >= MAX_NUM_FAMILIARS;
}

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  if (!config.showMaxFamiliars) {
    return;
  }

  drawSprite();
}

function drawSprite() {
  if (v.run.haveMaxFamiliars) {
    sprite.RenderLayer(0, SPRITE_POSITION);
  }
}
