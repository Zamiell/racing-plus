import { GridEntityType, TrapdoorVariant } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  isPostBossVoidPortal,
  removeGridEntity,
} from "isaacscript-common";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

export class RemoveVoidPortals extends ConfigurableModFeature {
  configKey: keyof Config = "RemoveVoidPortals";

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
