import {
  EntityFlag,
  EntityType,
  GameStateFlag,
  LevelStage,
  RoomType,
} from "isaac-typescript-definitions";
import {
  game,
  getBlueWombDoor,
  getRoomGridIndex,
  isRoomInsideGrid,
  log,
  onRepentanceStage,
  removeAllCollectibles,
  removeAllRocks,
  removeDoor,
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
import v, {
  season3HasDogmaGoal,
  season3HasHushGoal,
  season3HasMegaSatanGoal,
} from "../v";

const LEFT_OF_CENTER_GRID_INDEX = 65;
const TOP_CENTER_GRID_INDEX = 22;

export function season3PostNewRoom(): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_3) {
    return;
  }

  const numRoomsEntered = getNumRoomsEntered();
  if (numRoomsEntered !== 1) {
    resetSeason3StartingRoomSprites();
  }

  checkSpawnMegaSatanTeleporter();
  checkDadsNoteRoom();
  checkBlueWombRoom();
}

function checkSpawnMegaSatanTeleporter() {
  const stage = g.l.GetStage();
  const isFirstVisit = g.r.IsFirstVisit();
  const startingRoomGridIndex = g.l.GetStartingRoomIndex();
  const roomGridIndex = getRoomGridIndex();

  if (
    stage === LevelStage.DARK_ROOM_CHEST &&
    roomGridIndex === startingRoomGridIndex &&
    isFirstVisit &&
    season3HasMegaSatanGoal() &&
    !isOnFirstCharacter()
  ) {
    spawnTeleporter(TOP_CENTER_GRID_INDEX);
    v.room.megaSatanTeleporterSpawned = true;
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
    !v.run.killedDogma &&
    season3HasDogmaGoal() &&
    stage === LevelStage.DEPTHS_2 &&
    repentanceStage &&
    roomType === RoomType.BOSS &&
    roomInsideGrid &&
    backwardsPathInit
  ) {
    removeAllCollectibles(); // Remove Dad's Note.

    // We can't spawn Dogma in the center of the room, because then it will overlap with the TV and
    // will glitch out on the next frame.
    const position = g.r.GetGridPosition(LEFT_OF_CENTER_GRID_INDEX);
    spawnNPC(EntityType.DOGMA, 0, 0, position);

    spawnRoomClearDelayNPC();

    // The Dad's Note room will always have rocks in each of the four corners. Their presence makes
    // the fight a lot harder, so remove them.
    removeAllRocks();
  }
}

/**
 * If we clear the room, the vanilla photos will spawn, because the game thinks it is a Mom boss
 * room. Since we spawn the checkpoint based on when Dogma dies, we can safely spawn a room clear
 * delay NPC to prevent the normal room clear from ever happening.
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
