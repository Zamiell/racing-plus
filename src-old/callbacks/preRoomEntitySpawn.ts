import * as seededRooms from "../features/seededRooms";
import g from "../globals";

export function main(
  entityType: EntityType | int,
  variant: EntityVariantForAC,
  subType: int,
  gridIndex: int,
  seed: int,
): [EntityType, int, int] | null {
  let newTable: [EntityType, int, int] | null;

  newTable = basement1EasyItems(gridIndex);
  if (newTable !== null) {
    return newTable;
  }

  newTable = seededRooms.preEntitySpawn(entityType, variant, subType, seed);
  if (newTable !== null) {
    return newTable;
  }

  return null;
}

// We want the player to always be able to take an item in the Basement 1 Treasure Room without
// spending a bomb or being forced to walk on spikes
function basement1EasyItems(gridIndex: int): [EntityType, int, int] | null {
  // Local variables
  const stage = g.l.GetStage();
  const roomDesc = g.l.GetCurrentRoomDesc();
  const roomVariant = roomDesc.Data.Variant;
  const roomType = g.r.GetType();
  const roomFrameCount = g.r.GetFrameCount();

  // We only care about replacing things when the room is first loading
  if (roomFrameCount !== -1) {
    return null;
  }

  if (stage !== 1) {
    return null;
  }

  if (roomType !== RoomType.ROOM_TREASURE) {
    return null;
  }

  switch (roomVariant) {
    // Item surrounded by 3 rocks and 1 spike
    case 12: {
      const rockIndexes = [66, 68, 82];
      for (const rockIndex of rockIndexes) {
        if (rockIndex === gridIndex) {
          return [1930, 0, 0]; // Spikes
        }
      }

      break;
    }

    // Left item surrounded by rocks
    case 19: {
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
    case 21: {
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
    case 22: {
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

  return null;
}
