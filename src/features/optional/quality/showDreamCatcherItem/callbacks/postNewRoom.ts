import {
  anyPlayerHasCollectible,
  arrayInArray,
  changeRoom,
  ensureAllCases,
  getBosses,
  getCollectibles,
  getEffectiveStage,
  getEffects,
  getPlayers,
  getRoomGridIndexesForType,
  getRooms,
  getRoomSafeGridIndex,
  inStartingRoom,
  log,
  runNextGameFrame,
  runNextRenderFrame,
  stopAllSoundEffects,
  useActiveItemTemp,
} from "isaacscript-common";
import g from "../../../../../globals";
import { config } from "../../../../../modConfigMenu";
import { DreamCatcherWarpState } from "../../../../../types/DreamCatcherWarpState";
import { shouldRemoveEndGamePortals } from "../../../../mandatory/nerfCardReading";
import { decrementRoomsEntered } from "../../../../util/roomsEntered";
import { spawnHoles } from "../../../major/fastTravel/setNewState";
import * as sprites from "../sprites";
import v from "../v";

const STAIRWAY_GRID_INDEX = 25;

export function showDreamCatcherItemPostNewRoom(): void {
  if (!config.showDreamCatcherItem) {
    return;
  }

  // This feature requires that fast-travel is enabled
  // This is because using the Glowing Hour Glass will not work after warping to the Treasure Room
  // (because the screen is still fading in from the stage animation)
  if (!config.fastTravel) {
    return;
  }

  if (!anyPlayerHasCollectible(CollectibleType.COLLECTIBLE_DREAM_CATCHER)) {
    return;
  }

  sprites.set();
  checkWarpState();
}

function checkWarpState() {
  switch (v.level.warpState) {
    case DreamCatcherWarpState.INITIAL: {
      checkWarpStateInitial();
      break;
    }

    case DreamCatcherWarpState.WARPING: {
      checkWarpStateWarping();
      break;
    }

    case DreamCatcherWarpState.REPOSITIONING_PLAYER: {
      // This state is handled in the PostRender callback
      break;
    }

    case DreamCatcherWarpState.FINISHED: {
      // Do nothing
      break;
    }

    default: {
      ensureAllCases(v.level.warpState);
    }
  }
}

function checkWarpStateInitial() {
  const isGreedMode = g.g.IsGreedMode();
  const onTheAscent = g.g.GetStateFlag(GameStateFlag.STATE_BACKWARDS_PATH);
  const startingRoomGridIndex = g.l.GetStartingRoomIndex();
  const isFirstVisit = g.r.IsFirstVisit();
  const roomSafeGridIndex = getRoomSafeGridIndex();
  const effectiveStage = getEffectiveStage();

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

  // Minimap API is bugged such that it does not properly reset when Glowing Hour Glass is used
  // Thus, we need to record the level's display flags and manually reset it when we are done
  // warping
  if (MinimapAPI !== undefined) {
    v.level.displayFlagsMap = getMinimapDisplayFlagsMap();
  }

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

  log(
    `Dream Catcher - Starting warp sequence (with ${v.level.warpRoomGridIndexes.length} rooms).`,
  );
  v.level.warpState = DreamCatcherWarpState.WARPING;
  warpToNextRoom();
}

function getMinimapDisplayFlagsMap() {
  const displayFlags = new Map<int, int>();
  for (const roomDesc of getRooms()) {
    displayFlags.set(roomDesc.SafeGridIndex, roomDesc.DisplayFlags);
  }

  return displayFlags;
}

function checkWarpStateWarping() {
  if (inStartingRoom()) {
    warpToNextRoom();
  } else {
    gatherInfoAndGlowingHourGlass();
  }
}

function warpToNextRoom() {
  const roomGridIndex = v.level.warpRoomGridIndexes.shift();
  if (roomGridIndex !== undefined) {
    log(`Dream Catcher - Warping to room: ${roomGridIndex}`);
    changeRoom(roomGridIndex);
    decrementRoomsEntered(); // This should not count as entering a room
    return;
  }

  log("Dream Catcher - Finished warping.");

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

  // Reset the map display flags for MinimapAPI
  restoreMinimapAPIDisplayFlags(v.level.displayFlagsMap);

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
  const players = getPlayers();
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

function restoreMinimapAPIDisplayFlags(displayFlagsMap: Map<int, int>) {
  if (MinimapAPI === undefined) {
    return;
  }

  for (const [roomGridIndex, displayFlags] of displayFlagsMap.entries()) {
    const roomDesc = MinimapAPI.GetRoomByIdx(roomGridIndex);
    if (roomDesc !== undefined) {
      roomDesc.DisplayFlags = displayFlags;
    }
  }
}

function gatherInfoAndGlowingHourGlass() {
  // We have arrived in a new Treasure Room or Boss Room
  const roomType = g.r.GetType();
  if (roomType === RoomType.ROOM_TREASURE) {
    for (const collectibleType of getRoomCollectibles()) {
      v.level.collectibles.push(collectibleType);
    }
  } else if (roomType === RoomType.ROOM_BOSS) {
    for (const boss of getRoomBosses()) {
      v.level.bosses.push(boss);
    }
  }

  // Hide the boss HP bar, which will show up for a few frames and betray that we traveled to the
  // Boss Room
  for (const boss of getBosses()) {
    boss.AddEntityFlags(EntityFlag.FLAG_DONT_COUNT_BOSS_HP);
  }

  // Cancel any sound effects relating to the room
  stopAllSoundEffects();
  runNextRenderFrame(() => {
    stopAllSoundEffects();
  });

  // In order to reset all of the state properly, we need to use Glowing Hour Glass
  // (because it is not possible to modify the Planetarium chances via Lua)
  // This has the disadvantage of having to wait 10 frames before the previous room is entered
  // Additionally, we also have to wait a game frame after entering the new room before triggering
  // the Glowing Hour Glass, or the UI will permanently disappear for some reason
  runNextGameFrame(() => {
    log("Dream Catcher - Using Glowing Hour Glass.");
    const player = Isaac.GetPlayer();
    useActiveItemTemp(player, CollectibleType.COLLECTIBLE_GLOWING_HOUR_GLASS);

    // Cancel the "use item" animation to speed up returning to the starting room
    const sprite = player.GetSprite();
    sprite.Stop();

    // Cancel the Glowing Hour Glass sound effect and any sound effects relating to the room
    stopAllSoundEffects();
    runNextRenderFrame(() => {
      stopAllSoundEffects();
    });
  });
}

function getRoomCollectibles() {
  const collectibleTypes: CollectibleType[] = [];

  for (const collectible of getCollectibles()) {
    collectibleTypes.push(collectible.SubType);
  }

  return collectibleTypes;
}

/** Returns an array of: [entityType, variant] */
function getRoomBosses(): Array<[int, int]> {
  const bosses: Array<[int, int]> = [];
  for (const boss of getBosses()) {
    if (!isBossException(boss.Type, boss.Variant)) {
      const bossArray: [int, int] = [boss.Type, boss.Variant];
      if (!arrayInArray(bossArray, bosses)) {
        bosses.push(bossArray);
      }
    }
  }

  return bosses;
}

function isBossException(type: EntityType, variant: int) {
  switch (type) {
    // 45
    case EntityType.ENTITY_MOM: {
      return variant === MomVariant.STOMP;
    }

    // 79
    case EntityType.ENTITY_GEMINI: {
      return (
        variant === GeminiVariant.GEMINI_BABY ||
        variant === GeminiVariant.STEVEN_BABY ||
        variant === GeminiVariant.BLIGHTED_OVUM_BABY ||
        variant === GeminiVariant.UMBILICAL_CORD
      );
    }

    default: {
      return false;
    }
  }
}
