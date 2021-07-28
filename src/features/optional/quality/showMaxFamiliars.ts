import g from "../../../globals";
import { initSprite } from "../../../util";

const MAX_FAMILIARS = 64;
const SPRITE_POSITION = Vector(35, 33); // To the right of the coin count

const sprite = initSprite("gfx/ui/max_familiars.anm2");

// ModCallbacks.MC_POST_UPDATE (1)
export function postUpdate(): void {
  const familiars = Isaac.FindByType(EntityType.ENTITY_FAMILIAR);
  g.run.maxFamiliars = familiars.length >= MAX_FAMILIARS;
}

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  if (!g.config.showMaxFamiliars) {
    return;
  }

  drawSprite();
}

function drawSprite() {
  if (g.run.maxFamiliars) {
    sprite.RenderLayer(0, SPRITE_POSITION);
  }
}
