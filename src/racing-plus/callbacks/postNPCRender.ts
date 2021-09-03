import fastClearPostNPCRender from "../features/optional/major/fastClear/callbacks/postNPCRender";

export function main(npc: EntityNPC): void {
  if (npc.Type === EntityType.ENTITY_BIG_HORN) {
    const pos = Isaac.WorldToRenderPosition(npc.Position);
    Isaac.RenderText(`STATE: ${npc.State}`, pos.X, pos.Y, 1, 1, 1, 1);
  }

  fastClearPostNPCRender(npc);
}
