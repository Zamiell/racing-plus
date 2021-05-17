import { ChallengeCustom } from "../challenges/enums";
import g from "../globals";
import { CollectibleTypeCustom, PickupVariantCustom } from "../types/enums";

const functionMap = new Map<
  PickupVariant,
  (
    subType: int,
    spawner: Entity,
  ) => [EntityType, PickupVariantCustom, int, int] | null
>();
export default functionMap;

// 10
functionMap.set(PickupVariant.PICKUP_HEART, (_subType, spawner) => {
  // Local variables
  const roomType = g.r.GetType();

  // Delete hearts in Devil Rooms that spawned from fires
  if (
    roomType === RoomType.ROOM_DEVIL &&
    spawner !== null &&
    spawner.Type === EntityType.ENTITY_FIREPLACE
  ) {
    Isaac.DebugString(
      "Preventing a heart from spawning from a fire in a Devil Room.",
    );
    return [
      EntityType.ENTITY_PICKUP,
      PickupVariantCustom.INVISIBLE_PICKUP,
      0,
      0,
    ];
  }

  return null;
});

// 100
functionMap.set(PickupVariant.PICKUP_COLLECTIBLE, (subType, _spawner) => {
  // Local variables
  const stage = g.l.GetStage();
  const roomIndexUnsafe = g.l.GetCurrentRoomIndex();
  const challenge = Isaac.GetChallenge();

  // Prevent the vanilla Polaroid and Negative from spawning
  // (Racing+ spawns those manually to speed up the Mom fight)
  if (
    g.run.vanillaPhotosSpawning &&
    (subType === CollectibleType.COLLECTIBLE_POLAROID ||
      subType === CollectibleType.COLLECTIBLE_NEGATIVE)
  ) {
    const photoText = CollectibleType.COLLECTIBLE_POLAROID
      ? "Polaroid"
      : "Negative";
    const text = `Preventing a vanilla ${photoText} from spawning.`;
    Isaac.DebugString(text);
    return [
      EntityType.ENTITY_PICKUP,
      PickupVariantCustom.INVISIBLE_PICKUP,
      0,
      0,
    ];
  }

  // In season 7, prevent the boss item from spawning in The Void after defeating Ultra Greed
  if (
    challenge === ChallengeCustom.R7_SEASON_7 &&
    subType !== CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT &&
    stage === 12 &&
    roomIndexUnsafe === g.run.customBossRoomIndex
  ) {
    Isaac.DebugString("Prevented a boss item from spawning after Ultra Greed.");
    return [
      EntityType.ENTITY_PICKUP,
      PickupVariantCustom.INVISIBLE_PICKUP,
      0,
      0,
    ];
  }

  return null;
});
