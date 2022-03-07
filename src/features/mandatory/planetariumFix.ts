import {
  changeRoom,
  disableAllSound,
  enableAllSound,
  getRoomGridIndexesForType,
  log,
  runNextGameFrame,
  saveDataManager,
} from "isaacscript-common";
import g from "../../globals";
import { ChallengeCustom } from "../../types/ChallengeCustom";
import { setFastTravelResumeGameFrame } from "../optional/major/fastTravel/v";
import { inSeededRace } from "../race/v";
import { decrementRoomsEntered } from "../utils/roomsEntered";

const FEATURE_NAME = "planetariumFix";

enum PlanetariumFixWarpState {
  INITIAL,
  WARPING,
  FINISHED,
}

const v = {
  level: {
    warpRoomGridIndexes: [] as int[],
    warpState: PlanetariumFixWarpState.INITIAL,
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
    RoomType.ROOM_TREASURE,
    RoomType.ROOM_PLANETARIUM,
  );
  return v.level.warpRoomGridIndexes.length > 0;
}

/**
 * Planetariums have a greater chance of occurring if a Treasure Room is skipped, which can cause a
 * divergence in seeded races. In order to mitigate this, we force all players to visit every
 * Treasure Room and Planetarium in seeded races.
 */
export function planetariumFix(): void {
  v.level.warpState = PlanetariumFixWarpState.WARPING;
  disableAllSound(FEATURE_NAME);
  warpToNextRoom();
}

function warpToNextRoom() {
  const roomGridIndex = v.level.warpRoomGridIndexes.shift();
  if (roomGridIndex !== undefined) {
    log(`Planetarium Fix - Warping to room: ${roomGridIndex}`);
    changeRoom(roomGridIndex);
    decrementRoomsEntered(); // This should not count as entering a room
    return;
  }

  log("Planetarium Fix - Finished warping.");
  enableAllSound(FEATURE_NAME);
  const gameFrameCount = g.g.GetFrameCount();
  setFastTravelResumeGameFrame(gameFrameCount);
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (v.level.warpState !== PlanetariumFixWarpState.WARPING) {
    return;
  }

  // The game requires that you are in the room for at least a frame before the Planetarium odds
  // will change
  runNextGameFrame(() => {
    warpToNextRoom();
  });
}

export function isPlanetariumFixWarping(): boolean {
  return v.level.warpState === PlanetariumFixWarpState.WARPING;
}
