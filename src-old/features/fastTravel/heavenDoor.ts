import { Vector.Zero } from "../../constants";
import g from "../../globals";
import * as misc from "../../misc";
import { EffectVariantCustom } from "../../types/enums";
import * as fastTravelEntity from "./entity";

export function replace(entity: Entity): void {
  // Local variables
  const roomIndex = misc.getRoomIndex();
  const roomType = g.r.GetType();
  const roomSeed = g.r.GetSpawnSeed();

  // Delete "natural" beams of light
  if (entity.SpawnerType !== EntityType.ENTITY_PLAYER) {
    entity.Remove();

    if (roomType === RoomType.ROOM_BOSS) {
      // This is the beam of light that spawns one frame after It Lives! (or Hush) is killed
      // (it spawns after one frame because of fast-clear; on vanilla it spawns after a long delay)
      // We don't want to replace it with anything because we do that manually later
      return;
    }
  }

  // Spawn a custom entity to emulate the original
  // (we use an InitSeed of the room seed instead of a random seed to indicate that this is a
  // freshly spawned entity)
  const heavenDoor = g.g
    .Spawn(
      EntityType.ENTITY_EFFECT,
      EffectVariantCustom.HEAVEN_DOOR_FAST_TRAVEL,
      entity.Position,
      Vector.Zero,
      null,
      0,
      roomSeed,
    )
    .ToEffect();
  if (heavenDoor === null) {
    error("Failed to spawn a heaven door.");
  }
  heavenDoor.DepthOffset = 15; // The default offset of 0 is too low and 15 is just about perfect

  // The custom entity will not respawn if we leave the room,
  // so we need to keep track of it for the remainder of the floor
  g.run.level.replacedHeavenDoors.push({
    room: roomIndex,
    pos: entity.Position,
  });

  // If the room is not cleared yet, spawn the heaven door and close it
  // Otherwise, spawn it open
  // (we do not have to bother checking to see if it is fresh,
  // because there is no way for players to create heaven doors)
  if (!fastTravelEntity.isRoomClear(null)) {
    heavenDoor.State = 1;
    heavenDoor.GetSprite().Play("Disappear", true);
  }

  // Remove the original entity
  entity.Remove();
}
