import g from "./globals";
import { EntityTypeCustom } from "./types/enums";

export function postEntityKill(_entity: Entity): void {
  // The room clear delay NPC may accidentally die if Lua code kills all NPCs in a room
  // If this occurs, just spawn a new one
  Isaac.DebugString(
    "Room Clear Delay NPC death detected - spawning a new one.",
  );
  // spawn();
}

export function spawn(): void {
  const npc = Isaac.Spawn(
    EntityTypeCustom.ENTITY_ROOM_CLEAR_DELAY_NPC,
    0,
    0,
    Vector.Zero,
    Vector.Zero,
    null,
  );
  npc.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE;
  npc.ClearEntityFlags(EntityFlag.FLAG_APPEAR);
  g.sfx.Stop(SoundEffect.SOUND_SUMMON_POOF);
}
