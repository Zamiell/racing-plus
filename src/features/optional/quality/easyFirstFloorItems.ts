// We want the player to always be able to take an item on the first floor Treasure Room without
// spending a bomb or being forced to walk on spikes

import g from "../../../globals";

export function preRoomEntitySpawn(
  gridIndex: int,
): [EntityType, int, int] | void {
  if (!g.config.easyFirstFloorItems) {
    return undefined;
  }

  const stage = g.l.GetStage();
  const roomDesc = g.l.GetCurrentRoomDesc();
  const roomData = roomDesc.Data;
  const roomVariant = roomData.Variant;
  const roomType = g.r.GetType();
  const roomFrameCount = g.r.GetFrameCount();

  // We only care about replacing things when the room is first loading
  if (roomFrameCount !== -1) {
    return undefined;
  }

  if (stage !== 1) {
    return undefined;
  }

  if (roomType !== RoomType.ROOM_TREASURE) {
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

      break;
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
          // Equal to 1000.0, which is a blank effect, which is essentially nothing
          return [999, 0, 0];
        }
      }

      break;
    }

    // Left item surrounded by spikes
    case 41: {
      const spikeIndexes = [48, 50, 78, 80];
      for (const spikeIndex of spikeIndexes) {
        if (spikeIndex === gridIndex) {
          // Equal to 1000.0, which is a blank effect, which is essentially nothing
          return [999, 0, 0];
        }
      }

      break;
    }

    // Left item surrounded by pots/mushrooms/skulls
    case 42: {
      const potIndexes = [49, 63, 65, 79];
      for (const potIndex of potIndexes) {
        if (potIndex === gridIndex) {
          return [1930, 0, 0]; // Spikes
        }
      }

      break;
    }

    default: {
      break;
    }
  }

  return undefined;
}
