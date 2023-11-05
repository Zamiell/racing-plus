import type { EntityType } from "isaac-typescript-definitions";
import {
  CollectibleType,
  GridEntityXMLType,
  ModCallback,
  PickupVariant,
  RoomType,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  ReadonlyMap,
  ReadonlySet,
  anyPlayerHasCollectible,
  game,
  getCollectibleName,
  getRoomVariant,
  inRoomType,
  log,
  onFirstFloor,
  onRoomFrame,
  spawnCollectible,
} from "isaacscript-common";
import { EffectVariantCustom } from "../../../../enums/EffectVariantCustom";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

const TREASURE_ROOM_VARIANT_TO_SPIKE_GRID_INDEXES = new ReadonlyMap([
  // Item surrounded by 3 rocks and 1 spike.
  [11, new ReadonlySet([66, 68, 82])],

  // Left item surrounded by rocks.
  [39, new ReadonlySet([49, 63, 65, 79])],

  // Left item surrounded by pots/mushrooms/skulls.
  [42, new ReadonlySet([49, 63, 65, 79])],
]);

const TREASURE_ROOM_VARIANT_TO_NOTHING_GRID_INDEXES = new ReadonlyMap([
  // Left item surrounded by rocks.
  [39, new ReadonlySet([20, 47, 48, 62, 77, 78, 82, 95, 109])],

  // Left item surrounded by spikes.
  [41, new ReadonlySet([48, 50, 78, 80])],
]);

/**
 * This map is only populated with the Treasure Room variants that have collectibles that can be
 * surrounded by spikes.
 */
const TREASURE_ROOM_VARIANT_TO_COLLECTIBLE_SURROUNDED_BY_SPIKES_GRID_INDEX =
  new ReadonlyMap([
    // Item surrounded by 3 rocks and 1 spike.
    [11, 67],

    // Left item surrounded by rocks.
    [39, 64],

    // Left item surrounded by spikes.
    [41, 64],

    // Left item surrounded by pots/mushrooms/skulls.
    [42, 64],
  ]);

/**
 * We want the player to always be able to take an item on the first floor Treasure Room without
 * spending a bomb or being forced to walk on spikes.
 */
export class EasyFirstFloorItems extends ConfigurableModFeature {
  configKey: keyof Config = "EasyFirstFloorItems";

  // 71
  @Callback(ModCallback.PRE_ROOM_ENTITY_SPAWN)
  preRoomEntitySpawn(
    _entityTypeOrGridEntityXMLType: EntityType | GridEntityXMLType,
    _variant: int,
    _subType: int,
    gridIndex: int,
    _initSeed: Seed,
  ):
    | [type: EntityType | GridEntityXMLType, variant: int, subType: int]
    | undefined {
    if (!this.shouldEasyFirstFloorItemsApply()) {
      return undefined;
    }

    const roomVariant = getRoomVariant();

    const spikeGridIndexes =
      TREASURE_ROOM_VARIANT_TO_SPIKE_GRID_INDEXES.get(roomVariant);
    if (spikeGridIndexes !== undefined && spikeGridIndexes.has(gridIndex)) {
      return [GridEntityXMLType.SPIKES, 0, 0];
    }

    const nothingGridIndexes =
      TREASURE_ROOM_VARIANT_TO_NOTHING_GRID_INDEXES.get(roomVariant);
    if (nothingGridIndexes !== undefined && nothingGridIndexes.has(gridIndex)) {
      return [
        GridEntityXMLType.EFFECT,
        EffectVariantCustom.INVISIBLE_EFFECT,
        0,
      ];
    }

    return undefined;
  }

  /** Fix the bug where Damocles can cause collectibles to spawn on top of spikes. */
  @CallbackCustom(
    ModCallbackCustom.POST_PICKUP_INIT_FILTER,
    PickupVariant.COLLECTIBLE,
  )
  postPickupInitCollectible(pickup: EntityPickup): void {
    const collectible = pickup as EntityPickupCollectible;

    if (!this.shouldEasyFirstFloorItemsApply()) {
      return;
    }

    if (!anyPlayerHasCollectible(CollectibleType.DAMOCLES_PASSIVE)) {
      return;
    }

    // When the player has Damocles, the collectible will first spawn on the normal tile (in between
    // the spikes) on room frame -1. After being spawned, the collectible will have
    // `EntityFlag.ITEM_SHOULD_DUPLICATE`. Next, on room frame 0, the collectible will be moved one
    // tile to the left and another collectible will be spawned one tile to the right. For this
    // reason, checking for spikes underneath the collectible will not work. Instead, we remove the
    // collectible before it can be duplicated and respawn it one tile lower. (We cannot simply
    // change the position of the collectible because it will snap back to where it originally
    // spawned on the next update.)
    const roomVariant = getRoomVariant();
    const collectibleSurroundedBySpikesGridIndex =
      TREASURE_ROOM_VARIANT_TO_COLLECTIBLE_SURROUNDED_BY_SPIKES_GRID_INDEX.get(
        roomVariant,
      );
    if (collectibleSurroundedBySpikesGridIndex === undefined) {
      return;
    }

    const room = game.GetRoom();
    const gridIndex = room.GetGridIndex(collectible.Position);
    if (gridIndex !== collectibleSurroundedBySpikesGridIndex) {
      return;
    }

    const gridWidth = room.GetGridWidth();
    const newGridIndex = gridIndex + gridWidth;
    const newCollectible = spawnCollectible(
      collectible.SubType,
      newGridIndex,
      collectible.InitSeed,
    );

    // At this point, `collectible.OptionsPickupIndex` is equal to 0 for some reason, so we must
    // manually re-activate More Options.
    newCollectible.OptionsPickupIndex = 1;

    collectible.Remove();

    const collectibleName = getCollectibleName(collectible);
    log(
      `Moved collectible ${collectibleName} (${collectible.SubType}) from grid index ${collectibleSurroundedBySpikesGridIndex} to grid index ${newGridIndex} in a Treasure Room.`,
    );
  }

  shouldEasyFirstFloorItemsApply(): boolean {
    return onFirstFloor() && inRoomType(RoomType.TREASURE) && onRoomFrame(-1);
  }
}
