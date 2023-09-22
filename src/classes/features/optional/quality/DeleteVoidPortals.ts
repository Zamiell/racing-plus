import { GridEntityType, TrapdoorVariant } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  isPostBossVoidPortal,
  removeGridEntity,
} from "isaacscript-common";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

export class DeleteVoidPortals extends ConfigurableModFeature {
  configKey: keyof Config = "DeleteVoidPortals";

  @CallbackCustom(
    ModCallbackCustom.POST_GRID_ENTITY_UPDATE,
    GridEntityType.TRAPDOOR,
    TrapdoorVariant.VOID_PORTAL,
  )
  postGridEntityUpdateVoidPortal(gridEntity: GridEntity): void {
    if (isPostBossVoidPortal(gridEntity)) {
      removeGridEntity(gridEntity, false);
    }
  }
}
