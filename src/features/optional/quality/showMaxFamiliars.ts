import {
  anyPlayerIs,
  countEntities,
  MAX_NUM_FAMILIARS,
  saveDataManager,
} from "isaacscript-common";
import { config } from "../../../modConfigMenu";
import { initSprite } from "../../../sprite";
import { shouldGetFreeDevilItemOnThisRun } from "../major/freeDevilItem";

const ICON_SPRITE_POSITION = Vector(35, 33); // To the right of the coin count
const TAINTED_ISAAC_OFFSET = Vector(4, 24);
const FREE_DEVIL_DEAL_ICON_OFFSET = Vector(15, 0);

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
  if (!v.run.haveMaxFamiliars) {
    return;
  }

  const position1 = anyPlayerIs(PlayerType.PLAYER_ISAAC_B)
    ? ICON_SPRITE_POSITION.add(TAINTED_ISAAC_OFFSET)
    : ICON_SPRITE_POSITION;

  const position2 = shouldGetFreeDevilItemOnThisRun()
    ? position1.add(FREE_DEVIL_DEAL_ICON_OFFSET)
    : position1;

  sprite.RenderLayer(0, position2);
}
