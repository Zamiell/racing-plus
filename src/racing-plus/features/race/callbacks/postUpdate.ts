import { getRoomIndex } from "isaacscript-common";
import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import { findFreePosition } from "../../../utilGlobals";
import * as trophy from "../../mandatory/trophy";
import * as seededDeath from "../seededDeath";
import RaceGoal from "../types/RaceGoal";
import RacerStatus from "../types/RacerStatus";
import RaceStatus from "../types/RaceStatus";

export default function racePostUpdate(): void {
  if (!config.clientCommunication) {
    return;
  }

  spawnBossRushTrophy();
  checkFinalRoom();
  seededDeath.postUpdate();
}

function spawnBossRushTrophy() {
  const roomIndex = getRoomIndex();
  const bossRushDone = g.g.GetStateFlag(GameStateFlag.STATE_BOSSRUSH_DONE);

  if (
    !trophy.trophyHasSpawned() &&
    g.race.status === RaceStatus.IN_PROGRESS &&
    g.race.myStatus === RacerStatus.RACING &&
    g.race.goal === RaceGoal.BOSS_RUSH &&
    !g.raceVars.finished &&
    roomIndex === GridRooms.ROOM_BOSSRUSH_IDX &&
    bossRushDone
  ) {
    const centerPos = g.r.GetCenterPos();
    const position = findFreePosition(centerPos); // Some Boss Rush layouts have pits
    trophy.spawn(position);
  }
}

function checkFinalRoom() {
  /*
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
  */
}

/*
// Change to get here from the gridEntityUpdate function maybe?
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