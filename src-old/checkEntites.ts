/*
// Check all the grid entities in the room
// (called from the PostUpdate callback)
export function grid(): void {
  const roomIndex = misc.getRoomIndex();
  const stage = g.l.GetStage();
  const startingRoomIndex = g.l.GetStartingRoomIndex();
  const gridSize = g.r.GetGridSize();

  for (let i = 1; i <= gridSize; i++) {
    const gridEntity = g.r.GetGridEntity(i);
    if (gridEntity === null) {
      continue;
    }

    const saveState = gridEntity.GetSaveState();
    switch (saveState.Type) {
      // 20
      case GridEntityType.GRID_PRESSURE_PLATE: {
        changeCharOrder.checkButtonPressed(gridEntity);
        racePostUpdate.checkFinalButtons(gridEntity, i);
        season6.checkVetoButton(gridEntity);
        break;
      }

      default: {
        break;
      }
    }
  }
}
