import g from "../globals";

export enum FastDropTarget {
  BOTH,
  TRINKET,
  POCKET,
}

export function main(target: FastDropTarget): void {
  // Fast-drop is disabled during when the player is holding an item above their head
  if (!g.p.IsItemQueueEmpty()) {
    return;
  }

  // Trinkets (this does handle the Tick properly)
  if (target === FastDropTarget.BOTH || target === FastDropTarget.TRINKET) {
    const pos3 = g.r.FindFreePickupSpawnPosition(g.p.Position, 0, true);
    g.p.DropTrinket(pos3, false);
    const pos4 = g.r.FindFreePickupSpawnPosition(g.p.Position, 0, true);
    g.p.DropTrinket(pos4, false);
  }

  // Pocket items (cards, pills, runes, etc.)
  if (target === FastDropTarget.BOTH || target === FastDropTarget.POCKET) {
    const pos1 = g.r.FindFreePickupSpawnPosition(g.p.Position, 0, true);
    g.p.DropPoketItem(0, pos1);
    const pos2 = g.r.FindFreePickupSpawnPosition(g.p.Position, 0, true);
    g.p.DropPoketItem(1, pos2);
  }
}
