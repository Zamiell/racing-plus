import g from "../../../globals";

export function postEntityKill(entity: Entity): void {
  if (!g.config.fastClear3) {
    return;
  }

  const npc = entity.ToNPC();
  if (npc === null) {
    return;
  }

  npc.CanShutDoors = false;
}
