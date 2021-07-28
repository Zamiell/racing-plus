import { getGridEntities } from "../utilGlobals";
import * as postGridEntityInit from "./postGridEntityInit";
import postGridEntityUpdateFunctions from "./postGridEntityUpdateFunctions";

export function postUpdate(): void {
  for (const gridEntity of getGridEntities()) {
    postGridEntityInit.postGridEntityUpdate(gridEntity);

    const saveState = gridEntity.GetSaveState();
    const postGridEntityUpdateFunction = postGridEntityUpdateFunctions.get(
      saveState.Type,
    );
    if (postGridEntityUpdateFunction !== undefined) {
      postGridEntityUpdateFunction(gridEntity);
    }
  }
}
