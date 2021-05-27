import g from "../../../globals";
import { isPostBossVoidPortal } from "../../../misc";

export function postGridEntityUpdateTrapdoor(
  gridEntity: GridEntity,
  i: int,
): void {
  if (!g.config.deleteVoidPortals) {
    return;
  }

  if (isPostBossVoidPortal(gridEntity)) {
    g.r.RemoveGridEntity(i, 0, false); // gridEntity.Destroy() does not work
  }
}
