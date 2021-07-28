import g from "../../../globals";
import { isPostBossVoidPortal } from "../../../util";
import { removeGridEntity } from "../../../utilGlobals";

export function postGridEntityUpdateTrapdoor(gridEntity: GridEntity): void {
  if (!g.config.deleteVoidPortals) {
    return;
  }

  if (isPostBossVoidPortal(gridEntity)) {
    removeGridEntity(gridEntity);
  }
}
