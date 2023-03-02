import { EntityType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  countEntities,
  game,
  MAX_NUM_FAMILIARS,
  VectorZero,
} from "isaacscript-common";
import { config } from "../../../../modConfigMenu";
import { newSprite } from "../../../../sprite";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";
import {
  ANOTHER_UI_ICON_OFFSET,
  getTopLeftUIPositionFreeDevilItem,
  shouldGetFreeDevilItemOnThisRun,
} from "../major/FreeDevilItem";

const maxFamiliarsSprite = newSprite("gfx/ui/max_familiars.anm2");
// We move it slightly upwards so that it matches a standard collectible sprite from
// `newCollectibleSprite`.
maxFamiliarsSprite.Offset = Vector(0, -10);

const v = {
  run: {
    hasMaxFamiliars: false,
  },
};

export class ShowMaxFamiliars extends ConfigurableModFeature {
  configKey: keyof Config = "ShowMaxFamiliars";
  v = v;

  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const numFamiliars = countEntities(EntityType.FAMILIAR);
    v.run.hasMaxFamiliars = numFamiliars >= MAX_NUM_FAMILIARS;
  }

  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    if (v.run.hasMaxFamiliars) {
      this.drawIconSprite();
    }
  }

  drawIconSprite(): void {
    const hud = game.GetHUD();
    if (!hud.IsVisible()) {
      return;
    }

    const position = getTopLeftUIPositionShowMaxFamiliars();
    maxFamiliarsSprite.Render(position);
  }
}

export function getTopLeftUIPositionShowMaxFamiliars(): Vector {
  const topLeftUIPosition = getTopLeftUIPositionFreeDevilItem();
  const freeDevilItemOffset = shouldGetFreeDevilItemOnThisRun()
    ? ANOTHER_UI_ICON_OFFSET
    : VectorZero;

  return topLeftUIPosition.add(freeDevilItemOffset);
}

export function showingMaxFamiliarsIcon(): boolean {
  return config.ShowMaxFamiliars && v.run.hasMaxFamiliars;
}
