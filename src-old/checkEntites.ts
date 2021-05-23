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
      // 17
      case GridEntityType.GRID_TRAPDOOR: {
        if (
          saveState.VarData === 1 && // Void Portals have a VarData of 1
          (stage !== 11 || roomIndex !== startingRoomIndex)
        ) {
          // Delete all Void Portals (that are not on the starting room of The Chest / Dark Room)
          gridEntity.Sprite = Sprite(); // If we don't do this, it will still show for a frame
          g.r.RemoveGridEntity(i, 0, false); // gridEntity.Destroy() does not work
        } else {
          fastTravel.trapdoor.replace(gridEntity, i);
        }

        break;
      }

      // 18
      case GridEntityType.GRID_STAIRS: {
        fastTravel.crawlspace.replace(gridEntity, i);
        break;
      }

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

// Check all the non-grid entities in the room
// (called from the PostUpdate callback)
function nonGrid() {
  // Go through all the entities
  for (const entity of Isaac.GetRoomEntities()) {
    const entityFunc = checkEntitiesFunctions.get(entity.Type);
    if (entityFunc !== undefined) {
      entityFunc(entity);
    }
  }
}
*/
