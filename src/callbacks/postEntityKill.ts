import * as fastClearPostEntityKill from "../features/optional/major/fastClear/callbacks/postEntityKill";
import g from "../globals";
import { openAllDoors } from "../misc";

export function main(entity: Entity): void {
  fastClearPostEntityKill.main(entity);

  const npc = entity.ToNPC();
  if (npc !== null) {
    const gameFrameCount = g.g.GetFrameCount();
    // npc.AddEntityFlags(EntityFlag.FLAG_FRIENDLY);
    // Isaac.DebugString(`Added friendly flag on frame: ${gameFrameCount}`);
    npc.Remove();
    Isaac.DebugString(`Removed NPC on frame: ${gameFrameCount}`);
    if (npc.IsBoss()) {
      openAllDoors();
      Isaac.DebugString(`Opened doors on frame: ${gameFrameCount}`);
    }
  }
}
