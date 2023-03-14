import { RoomType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  changeRoom,
  copyArray,
  game,
  getRoomGridIndex,
  getRoomGridIndexesForType,
  log,
  ModCallbackCustom,
} from "isaacscript-common";
import { inSeededRace } from "../../../../features/race/v";
import { mod } from "../../../../mod";
import { onSeason } from "../../../../speedrun/utilsSpeedrun";
import { MandatoryModFeature } from "../../../MandatoryModFeature";
import { setFastTravelResumeGameFrame } from "../../optional/major/fastTravel/v";

enum PlanetariumFixWarpState {
  INITIAL,
  WARPING,
  FINISHED,
}

const PLANETARIUM_FIX_FEATURE_NAME = "PlanetariumFix";

const v = {
  level: {
    warpState: PlanetariumFixWarpState.INITIAL,
    warpRoomGridIndexes: [] as int[],
    disableMusic: false,
  },
};

export class PlanetariumFix extends MandatoryModFeature {
  v = v;

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    if (v.level.warpState !== PlanetariumFixWarpState.WARPING) {
      return;
    }

    // The game requires that you are in the room for at least a frame before the Planetarium odds
    // will change.
    mod.runNextGameFrame(() => {
      warpToNextRoom();
    });
  }
}

export function shouldApplyPlanetariumFix(): boolean {
  if (!inSeededRace() && !onSeason(2)) {
    return false;
  }

  const roomIndexes = getRoomGridIndexesForType(
    RoomType.TREASURE,
    RoomType.PLANETARIUM,
  );
  return roomIndexes.length > 0;
}

/**
 * Planetariums have a greater chance of occurring if a Treasure Room is skipped, which can cause a
 * divergence in seeded races. In order to mitigate this, we force all players to visit every
 * Treasure Room and Planetarium in seeded races.
 */
export function planetariumFixBeginWarp(): void {
  const hud = game.GetHUD();
  const roomGridIndex = getRoomGridIndex();

  v.level.warpState = PlanetariumFixWarpState.WARPING;
  v.level.warpRoomGridIndexes = copyArray(
    getRoomGridIndexesForType(RoomType.TREASURE, RoomType.PLANETARIUM),
  );

  // Append the room that we are in, so that we can warp back at the end. (We need to warp back
  // because the room that initiates stage travel will influence the destination floor.)
  v.level.warpRoomGridIndexes.push(roomGridIndex);

  hud.SetVisible(false); // It looks confusing if the minimap changes as we warp around.
  mod.disableAllSound(PLANETARIUM_FIX_FEATURE_NAME);
  warpToNextRoom();
}

function warpToNextRoom() {
  const room = game.GetRoom();

  const roomGridIndex = v.level.warpRoomGridIndexes.shift();
  if (roomGridIndex !== undefined) {
    log(`Planetarium Fix - Warping to room: ${roomGridIndex}`);
    changeRoom(roomGridIndex);
    const roomType = room.GetType();
    log(
      `Planetarium Fix - Arrived at room: ${roomGridIndex} (room type: ${roomType})`,
    );
    mod.deleteLastRoomDescription(); // This should not count as entering a room.
    return;
  }

  log("Planetarium Fix - Finished warping.");

  // We only re-enable the hud once we have reached the new floor.
  mod.enableAllSound(PLANETARIUM_FIX_FEATURE_NAME);
  const gameFrameCount = game.GetFrameCount();
  setFastTravelResumeGameFrame(gameFrameCount);
}

export function isPlanetariumFixWarping(): boolean {
  return v.level.warpState === PlanetariumFixWarpState.WARPING;
}
