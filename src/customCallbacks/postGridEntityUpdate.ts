import { getGridEntities } from "../misc";
import postGridEntityUpdateFunctions from "./postGridEntityUpdateFunctions";

export function postUpdate(): void {
  for (const gridEntity of getGridEntities()) {
    const saveState = gridEntity.GetSaveState();
    const postGridEntityUpdateFunction = postGridEntityUpdateFunctions.get(
      saveState.Type,
    );
    if (postGridEntityUpdateFunction !== undefined) {
      postGridEntityUpdateFunction(gridEntity);
    }
  }
}
