import {
  EntityFlag,
  GameStateFlag,
  GridEntityType,
  LevelStage,
  RoomType,
  StageType,
  TeleporterState,
} from "isaac-typescript-definitions";
import {
  changeRoom,
  game,
  getBlueWombDoor,
  inStartingRoom,
  isRoomInsideGrid,
  log,
  onRepentanceStage,
  removeDoor,
  setStage,
  spawnNPC,
  spawnTeleporter,
  VectorZero,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../../enums/ChallengeCustom";
import { EntityTypeCustom } from "../../../../enums/EntityTypeCustom";
import g from "../../../../globals";
import { getNumRoomsEntered } from "../../../utils/numRoomsEntered";
import { isOnFirstCharacter } from "../../speedrun";
import { resetSeason3StartingRoomSprites } from "../startingRoomSprites";
import {
  season3HasDogmaGoal,
  season3HasHushGoal,
  season3HasMegaSatanGoal,
} from "../v";

const DOGMA_ROOM_GRID_INDEX = 109;
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
    // Take them directly to Home to avoid wasting time.
    setStage(LevelStage.HOME, StageType.WRATH_OF_THE_LAMB);
    changeRoom(DOGMA_ROOM_GRID_INDEX);
    spawnRoomClearDelayNPC();
  }
}

/**
 * If we clear the room, a random pickup will spawn, which may interfere with picking up the
 * checkpoint/trophy. Since we spawn the Big Chest based on when Dogma dies, we can safely spawn a
 * room clear delay NPC to prevent the normal room clear from ever happening.
 *
 * Using a room clear delay effect for this purpose does not work.
 */
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
