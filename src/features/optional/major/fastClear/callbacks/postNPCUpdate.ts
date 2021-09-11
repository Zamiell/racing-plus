import { config } from "../../../../../modConfigMenu";

// Fix the bug where a Dangle spawned from a Brownie will be faded
export function dingle(npc: EntityNPC): void {
  if (!config.fastClear) {
    return;
  }

  // We only care about Dangles that are freshly spawned
  if (
    npc.Variant === DingleVariant.DANGLE &&
    npc.State === NpcState.STATE_INIT
  ) {
    npc.SetColor(Color.Default, 1000, 0, true, true);
  }
}
