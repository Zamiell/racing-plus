import {
  EntityType,
  GridEntityXMLType,
  ModCallback,
  RoomType,
} from "isaac-typescript-definitions";
import {
  Callback,
  game,
  getRoomVariant,
  inRoomType,
  onFirstFloor,
  ReadonlySet,
} from "isaacscript-common";
import { EffectVariantCustom } from "../../../../enums/EffectVariantCustom";
import { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

/**
 * We want the player to always be able to take an item on the first floor Treasure Room without
 * spending a bomb or being forced to walk on spikes.
 */
export class EasyFirstFloorItems extends ConfigurableModFeature {
  configKey: keyof Config = "EasyFirstFloorItems";

  // 71
  @Callback(ModCallback.PRE_ROOM_ENTITY_SPAWN)
  preRoomEntitySpawn(
    gridIndex: int,
  ): [EntityType | GridEntityXMLType, int, int] | undefined {
    const room = game.GetRoom();
    const roomFrameCount = room.GetFrameCount();
    const roomVariant = getRoomVariant();

    if (
      !onFirstFloor() ||
      !inRoomType(RoomType.TREASURE) ||
      roomFrameCount !== -1
    ) {
      return undefined;
    }

    switch (roomVariant) {
      // Item surrounded by 3 rocks and 1 spike.
      case 11: {
        const rockReplaceIndexes = new ReadonlySet([66, 68, 82]);
        if (rockReplaceIndexes.has(gridIndex)) {
          return [GridEntityXMLType.SPIKES, 0, 0];
        }

        return undefined;
      }

      // Left item surrounded by rocks.
      case 39: {
        const rockReplaceIndexes = new ReadonlySet([49, 63, 65, 79]);
        if (rockReplaceIndexes.has(gridIndex)) {
          return [GridEntityXMLType.SPIKES, 0, 0];
        }

        const rockDeleteIndexes = new ReadonlySet([
          20, 47, 48, 62, 77, 78, 82, 95, 109,
        ]);
        if (rockDeleteIndexes.has(gridIndex)) {
          // In this callback, 999 is equal to 1000 (i.e. EntityType.EFFECT).
          return [999, EffectVariantCustom.INVISIBLE_EFFECT, 0];
        }

        return undefined;
      }

      // Left item surrounded by spikes.
      case 41: {
        const spikeIndexes = new ReadonlySet([48, 50, 78, 80]);
        if (spikeIndexes.has(gridIndex)) {
          // In this callback, 999 is equal to 1000 (i.e. EntityType.EFFECT).
          return [999, EffectVariantCustom.INVISIBLE_EFFECT, 0];
        }

        return undefined;
      }

      // Left item surrounded by pots/mushrooms/skulls.
      case 42: {
        const potIndexes = new ReadonlySet([49, 63, 65, 79]);
        if (potIndexes.has(gridIndex)) {
          return [GridEntityXMLType.SPIKES, 0, 0];
        }

        return undefined;
      }

      default: {
        return undefined;
      }
    }
  }
}
