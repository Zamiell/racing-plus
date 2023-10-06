import type { DamageFlag } from "isaac-typescript-definitions";
import {
  CollectibleType,
  EffectVariant,
  GridEntityType,
  HeavenLightDoorSubType,
  ModCallback,
  PickupVariant,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  VectorZero,
  game,
  getAllPlayers,
  inStartingRoom,
  isSelfDamage,
  onOrAfterGameFrame,
} from "isaacscript-common";
import { FastTravelState } from "../../../../enums/FastTravelState";
import { mod } from "../../../../mod";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";
import { bigChestPostPickupInitBigChest } from "./fastTravel/bigChest";
import { blackSpritePostRender } from "./fastTravel/blackSprite";
import { checkStateCompletePostRender } from "./fastTravel/checkStateComplete";
import { FAST_TRAVEL_FEATURE_NAME } from "./fastTravel/constants";
import {
  crawlSpacePostGridEntityInitCrawlSpace,
  crawlSpacePostGridEntityRemoveCrawlSpace,
  crawlSpacePostGridEntityStateChangedTeleporter,
  crawlSpacePostGridEntityUpdateCrawlSpace,
  crawlSpacePostNewRoomReordered,
  crawlSpacePostPEffectUpdateReordered,
} from "./fastTravel/crawlSpace";
import {
  heavenDoorPostEffectInitHeavenDoor,
  heavenDoorPostEffectUpdateHeavenDoor,
  heavenDoorPreSpawnClearAward,
} from "./fastTravel/heavenDoor";
import {
  finishGoingToNewFloor,
  setNewFastTravelState,
} from "./fastTravel/setNewState";
import { spawnPerfectionPreSpawnClearAward } from "./fastTravel/spawnPerfection";
import {
  trapdoorPostGridEntityInitTrapdoor,
  trapdoorPostGridEntityRemoveTrapdoor,
  trapdoorPostGridEntityUpdateTrapdoor,
} from "./fastTravel/trapdoor";
import { v } from "./fastTravel/v";

export class FastTravel extends ConfigurableModFeature {
  configKey: keyof Config = "FastClear";
  v = v;

  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    if (v.level.resumeGameFrame === null) {
      return;
    }

    if (onOrAfterGameFrame(v.level.resumeGameFrame)) {
      v.level.resumeGameFrame = null;
      finishGoingToNewFloor();
    }
  }

  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    checkStateCompletePostRender();
    blackSpritePostRender();
    this.keepPlayerInPosition();
  }

  /**
   * If a player is using a Mega Blast and uses a fast-travel entity, then they will slide in the
   * direction of the blast. Prevent this from happening by snapping them to the grid on every
   * render frame.
   */
  keepPlayerInPosition(): void {
    if (
      v.run.state !== FastTravelState.FADING_TO_BLACK &&
      v.run.state !== FastTravelState.FADING_IN
    ) {
      return;
    }

    for (const player of getAllPlayers()) {
      const room = game.GetRoom();
      const gridIndex = room.GetGridIndex(player.Position);
      const gridPosition = room.GetGridPosition(gridIndex);
      player.Position = gridPosition;
      player.Velocity = VectorZero;
    }
  }

  /**
   * Manually fix the softlock that occurs with fast-travel when using Glowing Hour Glass in the
   * first room of a floor.
   */
  @Callback(ModCallback.POST_USE_ITEM, CollectibleType.GLOWING_HOUR_GLASS)
  postUseItemGlowingHourGlass(): boolean | undefined {
    const room = game.GetRoom();
    const isFirstVisit = room.IsFirstVisit();

    if (inStartingRoom() && isFirstVisit) {
      mod.runNextRoom(() => {
        v.run.state = FastTravelState.DISABLED;
      });
    }

    return undefined;
  }

  // 34, 340
  @Callback(ModCallback.POST_PICKUP_INIT, PickupVariant.BIG_CHEST)
  postPickupInit(pickup: EntityPickup): void {
    bigChestPostPickupInitBigChest(pickup);
  }

  // 70
  @Callback(ModCallback.PRE_SPAWN_CLEAR_AWARD)
  preSpawnClearAward(): boolean | undefined {
    v.room.clearFrame = game.GetFrameCount();
    heavenDoorPreSpawnClearAward();
    spawnPerfectionPreSpawnClearAward();

    return undefined;
  }

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
    ModCallbackCustom.POST_EFFECT_INIT_FILTER,
    EffectVariant.HEAVEN_LIGHT_DOOR,
    HeavenLightDoorSubType.HEAVEN_DOOR,
  )
  postEffectInitHeavenDoor(effect: EntityEffect): void {
    heavenDoorPostEffectInitHeavenDoor(effect);
  }

  @CallbackCustom(
    ModCallbackCustom.POST_EFFECT_UPDATE_FILTER,
    EffectVariant.HEAVEN_LIGHT_DOOR,
    HeavenLightDoorSubType.HEAVEN_DOOR,
  )
  postEffectUpdateHeavenDoor(effect: EntityEffect): void {
    heavenDoorPostEffectUpdateHeavenDoor(effect);
  }

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, true)
  postGameStartedReorderedTrue(): void {
    // Cancel fast-travel if we save & quit in the middle of the jumping animation.
    if (v.run.state === FastTravelState.FADING_TO_BLACK) {
      setNewFastTravelState(FastTravelState.DISABLED);
      mod.enableAllInputs(FAST_TRAVEL_FEATURE_NAME);
    }
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

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    crawlSpacePostNewRoomReordered();
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    crawlSpacePostPEffectUpdateReordered(player);
  }
}
