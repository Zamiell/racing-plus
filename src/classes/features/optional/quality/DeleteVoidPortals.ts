import { GridEntityType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  isPostBossVoidPortal,
  ModCallbackCustom,
  removeGridEntity,
} from "isaacscript-common";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

export class DeleteVoidPortals extends ConfigurableModFeature {
  configKey: keyof Config = "DeleteVoidPortals";

  @CallbackCustom(
    ModCallbackCustom.POST_GRID_ENTITY_UPDATE,
    GridEntityType.TRAPDOOR,
  )
  postGridEntityUpdateTrapdoor(gridEntity: GridEntity): void {
    if (isPostBossVoidPortal(gridEntity)) {
      removeGridEntity(gridEntity, false);
    }
  }
}
