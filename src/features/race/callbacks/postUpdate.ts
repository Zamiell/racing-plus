export function main(): void {
  // checkFinalRoom();
}

/*
function checkFinalRoom() {
  if (!g.raceVars.finished) {
    return;
  }

  const roomIndex = getRoomIndex();
  const roomFrameCount = g.r.GetFrameCount();

  if (roomFrameCount <= 0) {
    return;
  }

  for (const button of g.run.level.buttons) {
    if (button.roomIndex === roomIndex) {
      sprites.init(`${button.type}-button`, `${button.type}-button`);

      // The buttons will cause the door to close, so re-open the door
      // (thankfully, the door will stay open since the room is already cleared)
      openAllDoors();
    }
  }
}

export function checkFinalButtons(gridEntity: GridEntity, i: int): void {
  if (!g.raceVars.finished) {
    return;
  }

  const roomIndex = misc.getRoomIndex();

  for (const button of g.run.level.buttons) {
    if (button.type === "victory-lap" && button.roomIndex === roomIndex) {
      if (
        gridEntity.GetSaveState().State === 3 &&
        gridEntity.Position.X === button.pos.X &&
        gridEntity.Position.Y === button.pos.Y
      ) {
        sprites.init(`${button.type}-button`, "");
        removeGridEntity(gridEntity)

        race.victoryLap();
      }
    }

    if (button.type === "dps" && button.roomIndex === roomIndex) {
      if (
        gridEntity.GetSaveState().State === 3 &&
        gridEntity.Position.X === button.pos.X &&
        gridEntity.Position.Y === button.pos.Y
      ) {
        sprites.init(`${button.type}-button`, "");
        removeGridEntity(gridEntity)

        // Disable this button
        button.roomIndex = 999999;

        PotatoDummy.Spawn();
      }
    }
  }
}
*/
