// We want the player to always be able to take an item on the first floor Treasure Room without
// spending a bomb or being forced to walk on spikes

import { getEffectiveStage, getRoomVariant } from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import { EffectVariantCustom } from "../../../types/EffectVariantCustom";

// ModCallbacks.MC_PRE_ROOM_ENTITY_SPAWN (71)
export function preRoomEntitySpawn(
  gridIndex: int,
): [EntityType, int, int] | void {
  if (!config.easyFirstFloorItems) {
    return undefined;
  }

  const effectiveStage = getEffectiveStage();
  const roomType = g.r.GetType();
  const roomFrameCount = g.r.GetFrameCount();
  const roomVariant = getRoomVariant();

  if (
    roomFrameCount !== -1 ||
    effectiveStage !== 1 ||
    roomType !== RoomType.ROOM_TREASURE
  ) {
    return undefined;
  }

  switch (roomVariant) {
    // Item surrounded by 3 rocks and 1 spike
    case 11: {
      const rockIndexes = [66, 68, 82];
      for (const rockIndex of rockIndexes) {
        if (rockIndex === gridIndex) {
          return [1930, 0, 0]; // Spikes
        }
      }

      return undefined;
    }

    // Left item surrounded by rocks
    case 39: {
      const rockReplaceIndexes = [49, 63, 65, 79];
      for (const rockIndex of rockReplaceIndexes) {
        if (rockIndex === gridIndex) {
          return [1930, 0, 0]; // Spikes
        }
      }

      const rockDeleteIndexes = [20, 47, 48, 62, 77, 78, 82, 95, 109];
      for (const rockIndex of rockDeleteIndexes) {
        if (rockIndex === gridIndex) {
          // In this callback, 999 is equal to 1000 (i.e. EntityType.ENTITY_EFFECT)
          return [999, EffectVariantCustom.INVISIBLE_EFFECT, 0];
        }
      }

      return undefined;
    }

    // Left item surrounded by spikes
    case 41: {
      const spikeIndexes = [48, 50, 78, 80];
      for (const spikeIndex of spikeIndexes) {
        if (spikeIndex === gridIndex) {
          // In this callback, 999 is equal to 1000 (i.e. EntityType.ENTITY_EFFECT)
          return [999, EffectVariantCustom.INVISIBLE_EFFECT, 0];
        }
      }

      return undefined;
    }

    // Left item surrounded by pots/mushrooms/skulls
    case 42: {
      const potIndexes = [49, 63, 65, 79];
      for (const potIndex of potIndexes) {
        if (potIndex === gridIndex) {
          return [1930, 0, 0]; // Spikes
        }
      }

      return undefined;
    }

    default: {
      return undefined;
    }
  }
}
