import { EntityType, PlayerType } from "isaac-typescript-definitions";
import {
  anyPlayerIs,
  countEntities,
  game,
  MAX_NUM_FAMILIARS,
} from "isaacscript-common";
import { mod } from "../../../mod";
import { config } from "../../../modConfigMenu";
import { newSprite } from "../../../sprite";
import { shouldGetFreeDevilItemOnThisRun } from "../major/freeDevilItem";

const ICON_SPRITE_POSITION = Vector(35, 33); // To the right of the coin count
const TAINTED_ISAAC_OFFSET = Vector(4, 24);
const FREE_DEVIL_DEAL_ICON_OFFSET = Vector(15, 0);

const sprite = newSprite("gfx/ui/max_familiars.anm2");

const v = {
  run: {
    haveMaxFamiliars: false,
  },
};

export function init(): void {
  mod.saveDataManager("showMaxFamiliars", v, featureEnabled);
}

function featureEnabled() {
  return config.showMaxFamiliars;
}

// ModCallback.POST_UPDATE (1)
export function postUpdate(): void {
  if (!config.showMaxFamiliars) {
    return;
  }

  const numFamiliars = countEntities(EntityType.FAMILIAR);
  v.run.haveMaxFamiliars = numFamiliars >= MAX_NUM_FAMILIARS;
}

// ModCallback.POST_RENDER (2)
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

  const hud = game.GetHUD();
  if (!hud.IsVisible()) {
    return;
  }

  const position1 = anyPlayerIs(PlayerType.ISAAC_B)
    ? ICON_SPRITE_POSITION.add(TAINTED_ISAAC_OFFSET)
    : ICON_SPRITE_POSITION;

  const position2 = shouldGetFreeDevilItemOnThisRun()
    ? position1.add(FREE_DEVIL_DEAL_ICON_OFFSET)
    : position1;

  sprite.Render(position2);
}
