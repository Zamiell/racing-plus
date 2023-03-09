import { DamageFlag, GridEntityType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  isSelfDamage,
  ModCallbackCustom,
} from "isaacscript-common";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";
import {
  crawlSpacePostGridEntityInitCrawlSpace,
  crawlSpacePostGridEntityRemoveCrawlSpace,
  crawlSpacePostGridEntityStateChangedTeleporter,
  crawlSpacePostGridEntityUpdateCrawlSpace,
  crawlSpacePostPEffectUpdateReordered,
} from "./fastTravel/crawlSpace";
import {
  trapdoorPostGridEntityInitTrapdoor,
  trapdoorPostGridEntityRemoveTrapdoor,
  trapdoorPostGridEntityUpdateTrapdoor,
} from "./fastTravel/trapdoor";
import { v } from "./fastTravel/v";

export class FastTravel extends ConfigurableModFeature {
  configKey: keyof Config = "FastClear";
  v = v;

  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(
    _player: EntityPlayer,
    _amount: float,
    damageFlags: BitFlags<DamageFlag>,
    _source: EntityRef,
    _countdownFrames: int,
  ): boolean | undefined {
    if (!isSelfDamage(damageFlags)) {
      v.level.tookDamage = true;
      v.run.perfection.floorsWithoutDamage = 0;
    }

    return undefined;
  }

  @CallbackCustom(
    ModCallbackCustom.POST_GRID_ENTITY_INIT,
    GridEntityType.TRAPDOOR,
  )
  postGridEntityInitTrapdoor(gridEntity: GridEntity): void {
    trapdoorPostGridEntityInitTrapdoor(gridEntity);
  }

  @CallbackCustom(
    ModCallbackCustom.POST_GRID_ENTITY_INIT,
    GridEntityType.CRAWL_SPACE,
  )
  postGridEntityInitCrawlSpace(gridEntity: GridEntity): void {
    crawlSpacePostGridEntityInitCrawlSpace(gridEntity);
  }

  @CallbackCustom(
    ModCallbackCustom.POST_GRID_ENTITY_REMOVE,
    GridEntityType.TRAPDOOR,
  )
  postGridEntityRemoveTrapdoor(gridIndex: int): void {
    trapdoorPostGridEntityRemoveTrapdoor(gridIndex);
  }

  @CallbackCustom(
    ModCallbackCustom.POST_GRID_ENTITY_REMOVE,
    GridEntityType.CRAWL_SPACE,
  )
  postGridEntityRemoveCrawlSpace(gridIndex: int): void {
    crawlSpacePostGridEntityRemoveCrawlSpace(gridIndex);
  }

  @CallbackCustom(
    ModCallbackCustom.POST_GRID_ENTITY_UPDATE,
    GridEntityType.TRAPDOOR,
  )
  postGridEntityUpdateTrapdoor(gridEntity: GridEntity): void {
    trapdoorPostGridEntityUpdateTrapdoor(gridEntity);
  }

  @CallbackCustom(
    ModCallbackCustom.POST_GRID_ENTITY_UPDATE,
    GridEntityType.CRAWL_SPACE,
  )
  postGridEntityUpdateCrawlSpace(gridEntity: GridEntity): void {
    crawlSpacePostGridEntityUpdateCrawlSpace(gridEntity);
  }

  @CallbackCustom(
    ModCallbackCustom.POST_GRID_ENTITY_STATE_CHANGED,
    GridEntityType.TELEPORTER,
  )
  postGridEntityStateChangedTeleporter(
    gridEntity: GridEntity,
    oldState: int,
    newState: int,
  ): void {
    crawlSpacePostGridEntityStateChangedTeleporter(
      gridEntity,
      oldState,
      newState,
    );
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    crawlSpacePostPEffectUpdateReordered(player);
  }
}
