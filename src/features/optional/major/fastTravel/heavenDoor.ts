import g from "../../../../globals";
import { getRoomIndex } from "../../../../misc";
import { EffectVariantCustom } from "../../../../types/enums";
import * as fastTravel from "./fastTravel";

export function postEffectInit(effect: EntityEffect): void {
  replace(effect);
}

export function replace(effect: EntityEffect): void {
  const roomIndex = getRoomIndex();

  // Remove the original entity
  effect.Remove();

  // Spawn a custom entity to emulate the original
  fastTravel.spawn(
    EffectVariantCustom.HEAVEN_DOOR_FAST_TRAVEL,
    effect.Position,
    shouldSpawnOpen,
  );

  // The custom entity will not respawn if we leave the room,
  // so we need to keep track of it for the remainder of the floor
  g.run.level.fastTravel.replacedHeavenDoors.push({
    room: roomIndex,
    position: effect.Position,
  });
}

export function shouldSpawnOpen(): boolean {
  // If the room is not cleared yet, close the beam of light
  return !g.r.IsClear();
}
