import g from "../../../globals";
import { isPostBossVoidPortal, removeGridEntity } from "../../../misc";

export function postGridEntityUpdateTrapdoor(gridEntity: GridEntity): void {
  if (!g.config.deleteVoidPortals) {
    return;
  }

  if (isPostBossVoidPortal(gridEntity)) {
    removeGridEntity(gridEntity);
  }
}
