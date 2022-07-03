import {
  CollectibleType,
  EffectVariant,
  GameStateFlag,
  LadderSubType,
  RoomType,
} from "isaac-typescript-definitions";
import {
  anyPlayerHasCollectible,
  changeRoom,
  disableAllSound,
  getEffectiveStage,
  getEffects,
  getFloorDisplayFlags,
  getPlayers,
  getRoomGridIndexesForType,
  inStartingRoom,
  log,
  onSetSeed,
  spawnEffect,
} from "isaacscript-common";
import { DreamCatcherWarpState } from "../../../../enums/DreamCatcherWarpState";
import g from "../../../../globals";
import { shouldRemoveEndGamePortals } from "../../../mandatory/nerfCardReading";
import * as seededFloors from "../../../mandatory/seededFloors";
import { decrementNumRoomsEntered } from "../../../utils/numRoomsEntered";
import { spawnHoles } from "../../major/fastTravel/setNewState";
import v, { DREAM_CATCHER_FEATURE_NAME } from "./v";

const STAIRWAY_GRID_INDEX = 25;

export function checkStartDreamCatcherWarp(): void {
  const isGreedMode = g.g.IsGreedMode();
  const onTheAscent = g.g.GetStateFlag(GameStateFlag.BACKWARDS_PATH);
  const isFirstVisit = g.r.IsFirstVisit();
  const effectiveStage = getEffectiveStage();

  if (v.level.warpState !== DreamCatcherWarpState.INITIAL) {
    return;
  }

  if (!anyPlayerHasCollectible(CollectibleType.DREAM_CATCHER)) {
    return;
  }

  // We only need to visit rooms upon reaching a new floor for the first time.
  if (!inStartingRoom() || !isFirstVisit || effectiveStage === 1) {
    return;
  }

  // Disable this feature in Greed Mode, since that is outside of the scope of normal speedruns.
  if (isGreedMode) {
    return;
  }

  // Disable this feature on the Ascent, since that is outside of the scope of normal speedruns.
  if (onTheAscent) {
    return;
  }

  startWarp();
}

function startWarp() {
  v.level.warpRoomGridIndexes = getRoomGridIndexesForType(
    RoomType.TREASURE,
    RoomType.BOSS,
  );

  if (v.level.warpRoomGridIndexes.length === 0) {
    return;
  }

  // After using Glowing Hour Glass, the minimap will be bugged. We can work around this by manually
  // recording all of the minimap state beforehand, and then restoring it later.
  v.level.floorDisplayFlags = getFloorDisplayFlags();

  // Once we warp away, any Card Reading portals will be destroyed, so record what they are.
  // (Glowing Hour Glass does not properly restore Card Reading portals.)
  const cardReadingPortals = getEffects(EffectVariant.PORTAL_TELEPORT);
  for (const cardReadingPortal of cardReadingPortals) {
    const tuple: [int, Vector] = [
      cardReadingPortal.SubType,
      cardReadingPortal.Position,
    ];
    v.level.cardReadingPortalDescriptions.push(tuple);
  }

  log(
    `Dream Catcher - Starting warp sequence (with ${v.level.warpRoomGridIndexes.length} rooms).`,
  );
  v.level.warpState = DreamCatcherWarpState.WARPING;

  const hud = g.g.GetHUD();
  hud.SetVisible(false);

  disableAllSound(DREAM_CATCHER_FEATURE_NAME);

  warpToNextDreamCatcherRoom();
}

export function warpToNextDreamCatcherRoom(): void {
  const players = getPlayers();

  const roomGridIndex = v.level.warpRoomGridIndexes.shift();
  if (roomGridIndex !== undefined) {
    log(`Dream Catcher - Warping to room: ${roomGridIndex}`);
    changeRoom(roomGridIndex);
    decrementNumRoomsEntered(); // This should not count as entering a room.
    return;
  }

  log("Dream Catcher - Finished warping.");

  // At this point, the player will briefly show the animation of holding the Glowing Hour Glass
  // above their head. However, there does not seem to be a way to cancel this.

  // If the player has The Stairway, moving away from the room would delete the ladder, so respawn
  // it if necessary.
  if (anyPlayerHasCollectible(CollectibleType.STAIRWAY)) {
    const position = g.r.GetGridPosition(STAIRWAY_GRID_INDEX);
    spawnEffect(EffectVariant.TALL_LADDER, LadderSubType.STAIRWAY, position);
  }

  // If the player has Card Reading, moving away from the room would delete the portals, so respawn
  // them if necessary.
  if (!shouldRemoveEndGamePortals()) {
    for (const portalDescription of v.level.cardReadingPortalDescriptions) {
      const [subType, position] = portalDescription;
      spawnEffect(EffectVariant.PORTAL_TELEPORT, subType, position);
    }
  }

  // Since we warped away from the starting room, the custom fast-travel pitfalls will be gone.
  // Manually respawn them.
  spawnHoles(players);

  // Using the Glowing Hour Glass will reset any health or inventory modifications that were set by
  // the seeded floors feature. To work around this, re-run the "after" function.
  seededFloors.after();

  // Using the Glowing Hour Glass will revert any heart containers that were granted by an eternal
  // heart upon reaching this floor. Manually apply any eternal hearts.
  for (const player of players) {
    const eternalHearts = player.GetEternalHearts();
    if (eternalHearts > 0) {
      player.AddEternalHearts(eternalHearts * -1);
      player.AddMaxHearts(2, true);
      player.AddHearts(2);
    }
  }

  // Using the Glowing Hour Glass will remove the half soul heart that the Dream Catcher granted.
  // (This is not just an artifact of the warping; it does this on vanilla too if you use Glowing
  // Hour Glass after walking into a new room.) Thus, add it back manually. For some reason, this is
  // not needed if the `seededFloors.after` function performed modifications.
  if (!onSetSeed()) {
    for (const player of players) {
      if (player.HasCollectible(CollectibleType.DREAM_CATCHER)) {
        player.AddSoulHearts(1);
      }
    }
  }

  // We cannot reposition the player in the PostNewRoom callback for some reason, so mark to do it
  // on the next render frame.
  v.level.warpState = DreamCatcherWarpState.REPOSITIONING_PLAYER;
}
