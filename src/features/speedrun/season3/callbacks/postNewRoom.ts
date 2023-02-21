import {
  DoorSlot,
  EntityFlag,
  GameStateFlag,
  LevelStage,
  RoomType,
  SoundEffect,
  StageType,
} from "isaac-typescript-definitions";
import {
  changeRoom,
  DOGMA_ROOM_GRID_INDEX,
  game,
  getBlueWombDoor,
  inBeastRoom,
  inStartingRoom,
  isRoomInsideGrid,
  log,
  onRepentanceStage,
  removeDoor,
  setStage,
  sfxManager,
  spawnNPC,
  VectorZero,
} from "isaacscript-common";
import { season3ResetStartingRoomSprites } from "../../../../classes/features/speedrun/season3/startingRoomSprites";
import {
  season3HasDogmaGoal,
  season3HasHushGoal,
  season3HasMegaSatanGoal,
} from "../../../../classes/features/speedrun/season3/v";
import { EntityTypeCustom } from "../../../../enums/EntityTypeCustom";
import { g } from "../../../../globals";
import { isDreamCatcherWarping } from "../../../optional/quality/showDreamCatcherItem/v";
import { getNumRoomsEntered } from "../../../utils/numRoomsEntered";
import { isOnFirstCharacter, onSeason } from "../../speedrun";

export function season3PostNewRoom(): void {
  if (!onSeason(3)) {
    return;
  }

  const numRoomsEntered = getNumRoomsEntered();
  if (numRoomsEntered !== 1) {
    season3ResetStartingRoomSprites();
  }

  checkSpawnMegaSatanDoor();
  checkDadsNoteRoom();
  checkBeastRoom();
  checkBlueWombRoom();
}

function checkSpawnMegaSatanDoor() {
  const stage = g.l.GetStage();

  if (stage !== LevelStage.DARK_ROOM_CHEST || !inStartingRoom()) {
    return;
  }

  if (!season3HasMegaSatanGoal() || isOnFirstCharacter()) {
    return;
  }

  g.r.TrySpawnMegaSatanRoomDoor(true); // It has to be forced in order to work.
  const topDoor = g.r.GetDoor(DoorSlot.UP_0);
  if (topDoor !== undefined) {
    const player = Isaac.GetPlayer();
    topDoor.TryUnlock(player, true);
    sfxManager.Stop(SoundEffect.UNLOCK);
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
    backwardsPathInit &&
    !isDreamCatcherWarping()
  ) {
    // Take them directly to Home to avoid wasting time.
    setStage(LevelStage.HOME, StageType.WRATH_OF_THE_LAMB);
    changeRoom(DOGMA_ROOM_GRID_INDEX);
    spawnRoomClearDelayNPC();
  }
}

/**
 * Sometimes, Dogma will not play its death animation for an unknown reason. If this happens, the
 * player will be teleported to The Beast room. Try to detect this and teleport them back.
 */
function checkBeastRoom() {
  if (inBeastRoom()) {
    // We do not need to change the stage, as doing that would delete the spawned Checkpoint.
    changeRoom(DOGMA_ROOM_GRID_INDEX);
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
