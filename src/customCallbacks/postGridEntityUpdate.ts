import g from "../globals";
import postGridEntityUpdateFunctions from "./postGridEntityUpdateFunctions";

export function postUpdate(): void {
  const gridSize = g.r.GetGridSize();

  for (let gridIndex = 1; gridIndex <= gridSize; gridIndex++) {
    const gridEntity = g.r.GetGridEntity(gridIndex);
    if (gridEntity !== null) {
      const saveState = gridEntity.GetSaveState();
      const postGridEntityUpdateFunction = postGridEntityUpdateFunctions.get(
        saveState.Type,
      );
      if (postGridEntityUpdateFunction !== undefined) {
        postGridEntityUpdateFunction(gridEntity, gridIndex);
      }
    }
  }
}
