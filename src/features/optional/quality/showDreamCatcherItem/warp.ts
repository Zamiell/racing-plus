import {
  anyPlayerHasCollectible,
  changeRoom,
  getEffectiveStage,
  getEffects,
  getPlayerHealth,
  getPlayers,
  getRoomGridIndexesForType,
  getRooms,
  getRoomSafeGridIndex,
  log,
} from "isaacscript-common";
import g from "../../../../globals";
import { DreamCatcherWarpState } from "../../../../types/DreamCatcherWarpState";
import { shouldRemoveEndGamePortals } from "../../../mandatory/nerfCardReading";
import { decrementRoomsEntered } from "../../../utils/roomsEntered";
import { spawnHoles } from "../../major/fastTravel/setNewState";
import { setMinimapVisible } from "./minimap";
import v from "./v";

const STAIRWAY_GRID_INDEX = 25;

export function checkStartDreamCatcherWarp(): void {
  const isGreedMode = g.g.IsGreedMode();
  const onTheAscent = g.g.GetStateFlag(GameStateFlag.STATE_BACKWARDS_PATH);
  const startingRoomGridIndex = g.l.GetStartingRoomIndex();
  const isFirstVisit = g.r.IsFirstVisit();
  const roomSafeGridIndex = getRoomSafeGridIndex();
  const effectiveStage = getEffectiveStage();

  if (v.level.warpState !== DreamCatcherWarpState.INITIAL) {
    return;
  }

  if (!anyPlayerHasCollectible(CollectibleType.COLLECTIBLE_DREAM_CATCHER)) {
    return;
  }

  // We only need to visit rooms upon reaching a new floor for the first time
  if (
    roomSafeGridIndex !== startingRoomGridIndex ||
    !isFirstVisit ||
    effectiveStage === 1
  ) {
    return;
  }

  // Disable this feature in Greed Mode, since that is outside of the scope of normal speedruns
  if (isGreedMode) {
    return;
  }

  // Disable this feature on the Ascent, since that is outside of the scope of normal speedruns
  if (onTheAscent) {
    return;
  }

  startWarp();
}

function startWarp() {
  v.level.warpRoomGridIndexes = getRoomGridIndexesForType(
    RoomType.ROOM_TREASURE,
    RoomType.ROOM_BOSS,
  );

  if (v.level.warpRoomGridIndexes.length === 0) {
    return;
  }

  setMinimapVisible(false);

  // After using Glowing Hour Glass, the minimap will be bugged
  // We can work around this by manually recording all of the minimap state beforehand,
  // and then restoring it later
  v.level.displayFlagsMap = getMinimapDisplayFlagsMap();

  // Once we warp away, any Card Reading portals will be destroyed, so record what they are
  // (Glowing Hour Glass does not properly restore Card Reading portals)
  const cardReadingPortals = getEffects(EffectVariant.PORTAL_TELEPORT);
  for (const cardReadingPortal of cardReadingPortals) {
    const tuple: [int, Vector] = [
      cardReadingPortal.SubType,
      cardReadingPortal.Position,
    ];
    v.level.cardReadingPortalDescriptions.push(tuple);
  }

  // Using the Glowing Hour Glass can remove health that was granted by the seeded floors feature
  // To work around this, manually store the health and restore it later
  const player = Isaac.GetPlayer();
  v.level.health = getPlayerHealth(player);

  log(
    `Dream Catcher - Starting warp sequence (with ${v.level.warpRoomGridIndexes.length} rooms).`,
  );
  v.level.warpState = DreamCatcherWarpState.WARPING;

  warpToNextDreamCatcherRoom();
}

function getMinimapDisplayFlagsMap() {
  const displayFlags = new Map<int, int>();
  for (const roomDesc of getRooms()) {
    if (roomDesc.SafeGridIndex < 0) {
      continue;
    }

    displayFlags.set(roomDesc.SafeGridIndex, roomDesc.DisplayFlags);
  }

  return displayFlags;
}

export function warpToNextDreamCatcherRoom(): void {
  const players = getPlayers();

  const roomGridIndex = v.level.warpRoomGridIndexes.shift();
  if (roomGridIndex !== undefined) {
    log(`Dream Catcher - Warping to room: ${roomGridIndex}`);
    changeRoom(roomGridIndex);
    decrementRoomsEntered(); // This should not count as entering a room
    return;
  }

  log("Dream Catcher - Finished warping.");

  // At this point, the player will show the animation of holding the Glowing Hour Glass above their
  // head
  // However, there does not seem to be a way to cancel this

  // If the player has The Stairway, moving away from the room would delete the ladder,
  // so respawn it if necessary
  if (anyPlayerHasCollectible(CollectibleType.COLLECTIBLE_STAIRWAY)) {
    const position = g.r.GetGridPosition(STAIRWAY_GRID_INDEX);
    Isaac.Spawn(
      EntityType.ENTITY_EFFECT,
      EffectVariant.TALL_LADDER,
      LadderSubType.STAIRWAY,
      position,
      Vector.Zero,
      undefined,
    );
  }

  // If the player has Card Reading, moving away from the room would delete the portals,
  // so respawn them if necessary
  if (!shouldRemoveEndGamePortals()) {
    for (const portalDescription of v.level.cardReadingPortalDescriptions) {
      const [subType, position] = portalDescription;
      Isaac.Spawn(
        EntityType.ENTITY_EFFECT,
        EffectVariant.PORTAL_TELEPORT,
        subType,
        position,
        Vector.Zero,
        undefined,
      );
    }
  }

  // Using the Glowing Hour Glass will remove the half soul heart that the Dream Catcher granted
  // (this is not just an artifact of the warping; it does this on vanilla too if you use Glowing
  // Hour Glass after walking into a new room)
  // Thus, add it back manually
  for (const player of players) {
    if (player.HasCollectible(CollectibleType.COLLECTIBLE_DREAM_CATCHER)) {
      player.AddSoulHearts(1);
    }
  }

  // Since we warped away from the starting room, the custom fast-travel pitfalls will be gone
  // Manually respawn them
  spawnHoles(players);

  // We cannot reposition the player in the PostNewRoom callback for some reason,
  // so mark to do it on the next render frame
  v.level.warpState = DreamCatcherWarpState.REPOSITIONING_PLAYER;
}
