import {
  CollectibleType,
  EffectVariant,
  GameStateFlag,
  RoomType,
  TallLadderSubType,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  anyPlayerHasCollectible,
  changeRoom,
  copyArray,
  game,
  getAllPlayers,
  getEffects,
  getFloorDisplayFlags,
  getPlayers,
  getRoomGridIndex,
  getRoomGridIndexesForType,
  inStartingRoom,
  log,
  onFirstFloor,
  spawnEffect,
} from "isaacscript-common";
import { DreamCatcherWarpState } from "../../../../../enums/DreamCatcherWarpState";
import { mod } from "../../../../../mod";
import { shouldRemoveEndGamePortals } from "../../../mandatory/gameplay/NerfCardReading";
import { seededFloorsAfter } from "../../../mandatory/misc/SeededFloors";
import { spawnHoles } from "../../major/fastTravel/setNewState";
import { DREAM_CATCHER_FEATURE_NAME } from "./constants";
import type { CardReadingPortalDescription } from "./v";
import { v } from "./v";

const STAIRWAY_GRID_INDEX = 25;

export function showDreamCatcherCheckStartWarp(): void {
  const isGreedMode = game.IsGreedMode();
  const onTheAscent = game.GetStateFlag(GameStateFlag.BACKWARDS_PATH);
  const room = game.GetRoom();
  const isFirstVisit = room.IsFirstVisit();

  if (v.level.warpState !== DreamCatcherWarpState.INITIAL) {
    return;
  }

  if (!anyPlayerHasCollectible(CollectibleType.DREAM_CATCHER)) {
    return;
  }

  // We only need to visit rooms upon reaching a new floor for the first time.
  if (onFirstFloor() || !inStartingRoom() || !isFirstVisit) {
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
  v.level.warpRoomGridIndexes = copyArray(
    getRoomGridIndexesForType(RoomType.TREASURE, RoomType.BOSS),
  );

  if (v.level.warpRoomGridIndexes.length === 0) {
    return;
  }

  // After using Glowing Hourglass, eternal hearts from Maggy's Faith will result in full heart
  // containers, so we take them away.
  const players = getAllPlayers();
  for (const player of players) {
    player.AddEternalHearts(-1);
  }

  // After using Glowing Hourglass, the minimap will be bugged. We can work around this by manually
  // recording the minimap state now, and then restore it later. (The bug only happens with the
  // vanilla minimap.)
  if (MinimapAPI === undefined) {
    v.level.floorDisplayFlags = getFloorDisplayFlags();
  }

  // Once we warp away, any Card Reading portals will be destroyed, so record what they are.
  // (Glowing Hourglass does not properly restore Card Reading portals.)
  const cardReadingPortals = getEffects(EffectVariant.PORTAL_TELEPORT);
  for (const cardReadingPortal of cardReadingPortals) {
    const cardReadingPortalDescription = {
      subType: cardReadingPortal.SubType,
      position: cardReadingPortal.Position,
    } as const satisfies CardReadingPortalDescription;
    v.level.cardReadingPortalDescriptions.push(cardReadingPortalDescription);
  }

  log(
    `Dream Catcher - Starting warp sequence (with ${v.level.warpRoomGridIndexes.length} rooms).`,
  );
  v.level.warpState = DreamCatcherWarpState.WARPING;

  const hud = game.GetHUD();
  hud.SetVisible(false);

  mod.disableAllSound(DREAM_CATCHER_FEATURE_NAME);

  // Start by reloading the current room. This prevents bugs with the Glowing Hourglass later on.
  // For example, Bloody Gust stat modifications will remain in place from the previous floor if we
  // warp away and then use Glowing Hourglass for some reason.
  const roomGridIndex = getRoomGridIndex();
  changeRoom(roomGridIndex);
}

export function showDreamCatcherWarpToNextRoom(): void {
  const room = game.GetRoom();
  const players = getPlayers();

  const roomGridIndex = v.level.warpRoomGridIndexes.shift();
  if (roomGridIndex !== undefined) {
    log(`Dream Catcher - Warping to room: ${roomGridIndex}`);
    changeRoom(roomGridIndex);
    mod.deleteLastRoomDescription(); // This should not count as entering a room.
    return;
  }

  log("Dream Catcher - Finished warping.");

  // At this point, the player will briefly show the animation of holding the Glowing Hourglass
  // above their head. However, there does not seem to be a way to cancel this.

  // If the player has The Stairway, moving away from the room would delete the ladder, so respawn
  // it if necessary.
  if (anyPlayerHasCollectible(CollectibleType.STAIRWAY)) {
    const position = room.GetGridPosition(STAIRWAY_GRID_INDEX);
    spawnEffect(
      EffectVariant.TALL_LADDER,
      TallLadderSubType.STAIRWAY,
      position,
    );
  }

  // If the player has Card Reading, moving away from the room would delete the portals, so respawn
  // them if necessary.
  if (!shouldRemoveEndGamePortals()) {
    for (const cardReadingPortalDescription of v.level
      .cardReadingPortalDescriptions) {
      const { subType, position } = cardReadingPortalDescription;
      spawnEffect(EffectVariant.PORTAL_TELEPORT, subType, position);
    }
  }

  // Since we warped away from the starting room, the custom fast-travel pitfalls will be gone.
  // Manually respawn them.
  spawnHoles(players);

  // Using the Glowing Hourglass will reset any health or inventory modifications that were set by
  // the seeded floors feature. To work around this, re-run the "after" function.
  seededFloorsAfter();

  for (const player of players) {
    // Using the Glowing Hourglass will grant a golden bomb/key if the player had one on the
    // previous floor.
    player.RemoveGoldenBomb();
    player.RemoveGoldenKey();

    // We need to restore the eternal hearts that we took away earlier.
    if (player.HasTrinket(TrinketType.MAGGYS_FAITH)) {
      player.AddEternalHearts(1);
    }
  }

  // We cannot reposition the player in the `POST_NEW_ROOM` callback for some reason, so mark to do
  // it on the next render frame.
  v.level.warpState = DreamCatcherWarpState.REPOSITIONING_PLAYER;
}
