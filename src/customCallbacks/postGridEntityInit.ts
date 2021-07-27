import g from "../globals";
import { getGridEntities } from "../misc";
import postGridEntityInitFunctions from "./postGridEntityInitFunctions";

export function postNewRoom(): void {
  for (const gridEntity of getGridEntities()) {
    checkNewGridEntity(gridEntity);
  }
}

export function postGridEntityUpdate(gridEntity: GridEntity): void {
  checkNewGridEntity(gridEntity);
}

function checkNewGridEntity(gridEntity: GridEntity) {
  const gridIndex = gridEntity.GetGridIndex();
  const saveState = gridEntity.GetSaveState();
  const storedType = g.run.room.initializedGridEntities.get(gridIndex);
  if (storedType !== saveState.Type) {
    g.run.room.initializedGridEntities.set(gridIndex, saveState.Type);
    postGridEntityInit(gridEntity);
  }
}

function postGridEntityInit(gridEntity: GridEntity) {
  const saveState = gridEntity.GetSaveState();
  const postGridEntityInitFunction = postGridEntityInitFunctions.get(
    saveState.Type,
  );
  if (postGridEntityInitFunction !== undefined) {
    postGridEntityInitFunction(gridEntity);
  }
}
