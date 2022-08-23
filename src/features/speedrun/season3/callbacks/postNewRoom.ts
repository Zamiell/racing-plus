import {
  GameStateFlag,
  GridEntityType,
  LevelStage,
  RoomType,
  TeleporterState,
} from "isaac-typescript-definitions";
import {
  game,
  getBlueWombDoor,
  inStartingRoom,
  isRoomInsideGrid,
  onRepentanceStage,
  removeDoor,
  spawnTeleporter,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../../enums/ChallengeCustom";
import g from "../../../../globals";
import { getNumRoomsEntered } from "../../../utils/numRoomsEntered";
import { isOnFirstCharacter } from "../../speedrun";
import { resetSeason3StartingRoomSprites } from "../startingRoomSprites";
import {
  season3HasDogmaGoal,
  season3HasHushGoal,
  season3HasMegaSatanGoal,
} from "../v";

const LEFT_OF_CENTER_GRID_INDEX = 65;

const LEFT_OF_TOP_DOOR_GRID_INDEX = 20;

export function season3PostNewRoom(): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_3) {
    return;
  }

  const numRoomsEntered = getNumRoomsEntered();
  if (numRoomsEntered !== 1) {
    resetSeason3StartingRoomSprites();
  }

  checkMegaSatanTeleporter();
  checkDadsNoteRoom();
  checkBlueWombRoom();
}

function checkMegaSatanTeleporter() {
  const stage = g.l.GetStage();
  const isFirstVisit = g.r.IsFirstVisit();

  if (stage !== LevelStage.DARK_ROOM_CHEST || !inStartingRoom()) {
    return;
  }

  // Handle spawning the teleporter.
  if (isFirstVisit && season3HasMegaSatanGoal() && !isOnFirstCharacter()) {
    // We don't want to spawn the teleporter exactly where the top door would be because that is the
    // position that they will return to if they e.g. die in the Mega Satan fight with Dead Cat.
    spawnTeleporter(LEFT_OF_TOP_DOOR_GRID_INDEX);
  }

  // If we return to the starting room after the teleporter has already been activated, then we have
  // to manually change the state to allow the player to return to the Mega Satan room.
  const gridEntity = g.r.GetGridEntity(LEFT_OF_TOP_DOOR_GRID_INDEX);
  if (gridEntity !== undefined) {
    const gridEntityType = gridEntity.GetType();
    if (gridEntityType === GridEntityType.TELEPORTER) {
      gridEntity.State = TeleporterState.NORMAL;
    }
  }
}

function checkDadsNoteRoom() {
  const backwardsPathInit = game.GetStateFlag(
    GameStateFlag.BACKWARDS_PATH_INIT,
  );
  const stage = g.l.GetStage();
  const roomType = g.r.GetType();
  const repentanceStage = onRepentanceStage();
  const roomInsideGrid = isRoomInsideGrid();

  if (
    season3HasDogmaGoal() &&
    stage === LevelStage.DEPTHS_2 &&
    repentanceStage &&
    roomType === RoomType.BOSS &&
    roomInsideGrid &&
    backwardsPathInit
  ) {
    /*
    removeAllCollectibles(); // Remove Dad's Note.

    // We can't spawn Dogma in the center of the room, because then it will overlap with the TV and
    // will glitch out on the next frame.
    const position = g.r.GetGridPosition(LEFT_OF_CENTER_GRID_INDEX);
    spawnNPC(EntityType.DOGMA, 0, 0, position);

    spawnRoomClearDelayNPC();

    // The Dad's Note room will always have rocks in each of the four corners. Their presence makes
    // the fight a lot harder, so remove them.
    removeAllRocks();
    */
    // Take them directly to Home to avoid wasting time.
  }
}

/**
 * If we clear the room, the vanilla photos will spawn, because the game thinks it is a Mom boss
 * room. Since we spawn the checkpoint based on when Dogma dies, we can safely spawn a room clear
 * delay NPC to prevent the normal room clear from ever happening.
 *
 * Using a room clear delay effect for this purpose does not work.
 */
/*
function spawnRoomClearDelayNPC() {
  const roomClearDelayNPC = spawnNPC(
    EntityTypeCustom.ROOM_CLEAR_DELAY_NPC,
    0,
    0,
    VectorZero,
  );
  roomClearDelayNPC.ClearEntityFlags(EntityFlag.APPEAR);
  log('Spawned the "Room Clear Delay NPC" custom entity (for Dogma).');
}
*/

/** Guard against the player accidentally going to Hush. */
function checkBlueWombRoom() {
  if (season3HasHushGoal()) {
    return;
  }

  const blueWombDoor = getBlueWombDoor();
  if (blueWombDoor !== undefined) {
    removeDoor(blueWombDoor);
  }
}
