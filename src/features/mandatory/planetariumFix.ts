import { RoomType } from "isaac-typescript-definitions";
import {
  changeRoom,
  disableAllSound,
  enableAllSound,
  getRoomGridIndex,
  getRoomGridIndexesForType,
  log,
  runNextGameFrame,
  saveDataManager,
} from "isaacscript-common";
import { ChallengeCustom } from "../../enums/ChallengeCustom";
import g from "../../globals";
import { setFastTravelResumeGameFrame } from "../optional/major/fastTravel/v";
import { inSeededRace } from "../race/v";
import { decrementNumRoomsEntered } from "../utils/numRoomsEntered";

const FEATURE_NAME = "planetariumFix";

enum PlanetariumFixWarpState {
  INITIAL,
  WARPING,
  FINISHED,
}

const v = {
  level: {
    warpState: PlanetariumFixWarpState.INITIAL,
    startingRoomGridIndex: null as int | null,
    warpRoomGridIndexes: [] as int[],
    disableMusic: false,
  },
};

export function init(): void {
  saveDataManager(FEATURE_NAME, v);
}

export function shouldApplyPlanetariumFix(): boolean {
  const challenge = Isaac.GetChallenge();
  if (!inSeededRace() && challenge !== ChallengeCustom.SEASON_2) {
    return false;
  }

  v.level.warpRoomGridIndexes = getRoomGridIndexesForType(
    RoomType.TREASURE,
    RoomType.PLANETARIUM,
  );
  return v.level.warpRoomGridIndexes.length > 0;
}

/**
 * Planetariums have a greater chance of occurring if a Treasure Room is skipped, which can cause a
 * divergence in seeded races. In order to mitigate this, we force all players to visit every
 * Treasure Room and Planetarium in seeded races.
 */
export function planetariumFix(): void {
  const roomGridIndex = getRoomGridIndex();

  v.level.startingRoomGridIndex = roomGridIndex;
  v.level.warpState = PlanetariumFixWarpState.WARPING;
  disableAllSound(FEATURE_NAME);
  warpToNextRoom();
}

function warpToNextRoom() {
  const roomGridIndex = v.level.warpRoomGridIndexes.shift();
  if (roomGridIndex !== undefined) {
    log(`Planetarium Fix - Warping to room: ${roomGridIndex}`);
    changeRoom(roomGridIndex);
    const roomType = g.r.GetType();
    log(
      `Planetarium Fix - Arrived at room: ${roomGridIndex} (room type: ${roomType})`,
    );
    decrementNumRoomsEntered(); // This should not count as entering a room.
    return;
  }

  if (v.level.startingRoomGridIndex !== null) {
    log("Planetarium Fix - Warping back to where we started from.");
    changeRoom(v.level.startingRoomGridIndex);
  }

  log("Planetarium Fix - Finished warping.");
  enableAllSound(FEATURE_NAME);
  const gameFrameCount = g.g.GetFrameCount();
  setFastTravelResumeGameFrame(gameFrameCount);
}

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (v.level.warpState !== PlanetariumFixWarpState.WARPING) {
    return;
  }

  // The game requires that you are in the room for at least a frame before the Planetarium odds
  // will change.
  runNextGameFrame(() => {
    warpToNextRoom();
  });
}

export function isPlanetariumFixWarping(): boolean {
  return v.level.warpState === PlanetariumFixWarpState.WARPING;
}
