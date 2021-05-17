import { ZERO_VECTOR } from "../../constants";
import g from "../../globals";
import * as misc from "../../misc";
import { EffectVariantCustom } from "../../types/enums";
import { TRAPDOOR_OPEN_DISTANCE, TRAPDOOR_TOUCH_DISTANCE } from "./constants";
import * as fastTravelEntity from "./entity";

// Called from the "CheckEntities.Grid()" function
export function replace(entity: GridEntity, gridIndex: int): void {
  // Local variables
  const roomIndex = misc.getRoomIndex();
  const roomFrameCount = g.r.GetFrameCount();

  // Spawn a custom entity to emulate the original
  const crawlspace = Isaac.Spawn(
    EntityType.ENTITY_EFFECT,
    EffectVariantCustom.CRAWLSPACE_FAST_TRAVEL,
    0,
    entity.Position,
    ZERO_VECTOR,
    null,
  ).ToEffect();
  if (crawlspace === null) {
    error("Failed to spawn a fast-travel crawlspace.");
  }

  // This is needed so that the entity will not appear on top of the player
  crawlspace.DepthOffset = -100;

  if (roomFrameCount > 1) {
    const data = crawlspace.GetData();
    data.fresh = true; // Mark that it should be open even if the room is ! cleared
  }

  // The custom entity will ! respawn if ( we leave the room,
  // so we need to keep track of it for the remainder of the floor
  g.run.level.replacedCrawlspaces.push({
    room: roomIndex,
    pos: entity.Position,
  });

  // Figure out if it should spawn open or closed,
  // depending on if there are one  more players close to it or if the room is not yet cleared
  const playerClose = fastTravelEntity.isPlayerClose(
    crawlspace.Position,
    TRAPDOOR_OPEN_DISTANCE,
  );
  if (playerClose) {
    crawlspace.State = 1;
    crawlspace.GetSprite().Play("Closed", true);
    Isaac.DebugString("Spawned crawlspace (closed, state 1).");
  } else {
    crawlspace.GetSprite().Play("Open Animation", true);
    Isaac.DebugString("Spawned crawlspace (opened, state 0).");
  }

  // Remove the original entity
  entity.Sprite = Sprite(); // If we don't do this, it will still show for a frame
  g.r.RemoveGridEntity(gridIndex, 0, false); // entity.Destroy() does not work
}

// Called from the "CheckEntities.NonGrid()" function
export function checkPlayerTouching(effect: EntityEffect): void {
  // Do nothing if the trapdoor is closed
  if (effect.State !== 0) {
    return;
  }

  // Check to see if a player is touching the crawlspace
  for (let i = 0; i < g.g.GetNumPlayers(); i++) {
    const player = Isaac.GetPlayer(i);
    if (player === null) {
      continue;
    }

    // Players cannot interact with crawlspaces while playing certain animations
    if (
      !player.IsHoldingItem() &&
      !player.GetSprite().IsPlaying("Happy") && // Account for lucky pennies
      !player.GetSprite().IsPlaying("Jump") // Account for How to Jump
    ) {
      continue;
    }

    if (player.Position.Distance(effect.Position) <= TRAPDOOR_TOUCH_DISTANCE) {
      playerTouched(effect);
    }
  }
}

function playerTouched(effect: EntityEffect) {
  // Local variable
  const roomIndex = misc.getRoomIndex();
  const previousRoomIndex = g.l.GetPreviousRoomIndex();

  // Save the previous room information in case we return to a room outside the grid
  // (with a negative room index)
  if (previousRoomIndex < 0) {
    Isaac.DebugString(
      "Skipped saving the crawlspace previous room since it was negative.",
    );
  } else {
    g.run.crawlspace.prevRoom = previousRoomIndex;
    Isaac.DebugString(
      `Set crawlspace previous room to. ${g.run.crawlspace.prevRoom}`,
    );
  }

  // If we don't set this, we will return to the center of the room by default
  g.l.DungeonReturnPosition = effect.Position;

  // We need to keep track of which room we came from
  // (this is needed in case we are in a Boss Rush or another room with a negative room index)
  g.l.DungeonReturnRoomIndex = roomIndex;

  // Go to the crawlspace
  g.g.StartRoomTransition(
    GridRooms.ROOM_DUNGEON_IDX,
    Direction.DOWN,
    RoomTransition.TRANSITION_NONE,
  );
}

// Called from the PostUpdate callback
export function checkExit(): void {
  // Local variables
  const playerGridIndex = g.r.GetGridIndex(g.p.Position);

  if (
    g.r.GetType() === RoomType.ROOM_DUNGEON &&
    playerGridIndex === 2 // If the player is standing on top of the ladder
  ) {
    // You have to set LeaveDoor before every teleport or else it will send you to the wrong room
    g.l.LeaveDoor = -1;

    g.g.StartRoomTransition(
      g.l.DungeonReturnRoomIndex,
      Direction.UP,
      RoomTransition.TRANSITION_NONE,
    );
  }
}

// Fix the softlock with Boss Rushes and crawlspaces
// (called from the PostUpdate callback)
export function checkSoftlock(): void {
  // Local variables
  const previousRoomIndex = g.l.GetPreviousRoomIndex(); // We need the unsafe version here
  const roomType = g.r.GetType();

  if (previousRoomIndex !== GridRooms.ROOM_DUNGEON_IDX) {
    return;
  }

  switch (roomType) {
    case RoomType.ROOM_DEVIL:
    case RoomType.ROOM_ANGEL: {
      checkSoftlockDevilAngel();
      break;
    }

    case RoomType.ROOM_BOSSRUSH: {
      checkSoftlockBossRush();
      break;
    }

    default: {
      break;
    }
  }
}

function checkSoftlockDevilAngel() {
  // Local variables
  const playerGridIndex = g.r.GetGridIndex(g.p.Position);

  switch (playerGridIndex) {
    // Top door
    case 7: {
      g.run.crawlspace.direction = Direction.UP;
      g.g.StartRoomTransition(
        g.run.crawlspace.prevRoom,
        Direction.UP,
        RoomTransition.TRANSITION_NONE,
      );
      Isaac.DebugString(
        `Exited Devil/Angel Room, moving up to room: ${g.run.crawlspace.prevRoom}`,
      );
      break;
    }

    // Right door
    case 74: {
      g.run.crawlspace.direction = Direction.RIGHT;
      g.g.StartRoomTransition(
        g.run.crawlspace.prevRoom,
        Direction.RIGHT,
        RoomTransition.TRANSITION_NONE,
      );
      Isaac.DebugString(
        `Exited Devil/Angel Room, moving right to room: ${g.run.crawlspace.prevRoom}`,
      );
      break;
    }

    // Bottom door
    case 127: {
      g.run.crawlspace.direction = Direction.DOWN;
      g.g.StartRoomTransition(
        g.run.crawlspace.prevRoom,
        Direction.DOWN,
        RoomTransition.TRANSITION_NONE,
      );
      Isaac.DebugString(
        `Exited Devil Devil/Angel Room, moving down to room: ${g.run.crawlspace.prevRoom}`,
      );
      break;
    }

    // Left door
    case 60: {
      g.run.crawlspace.direction = Direction.LEFT;
      g.g.StartRoomTransition(
        g.run.crawlspace.prevRoom,
        Direction.LEFT,
        RoomTransition.TRANSITION_NONE,
      );
      Isaac.DebugString(
        `Exited Devil/Angel Room, moving left to room. ${g.run.crawlspace.prevRoom}`,
      );
      break;
    }

    default: {
      break;
    }
  }
}

function checkSoftlockBossRush() {
  // Local variables
  const playerGridIndex = g.r.GetGridIndex(g.p.Position);

  switch (playerGridIndex) {
    // Top left door
    case 7: {
      g.run.crawlspace.direction = Direction.UP;
      g.g.StartRoomTransition(
        g.run.crawlspace.prevRoom,
        Direction.UP,
        RoomTransition.TRANSITION_NONE,
      );
      Isaac.DebugString(
        `Exited Boss Rush, moving up to room: ${g.run.crawlspace.prevRoom}`,
      );
      break;
    }

    // Right top door
    case 139: {
      g.run.crawlspace.direction = Direction.RIGHT;
      g.g.StartRoomTransition(
        g.run.crawlspace.prevRoom,
        Direction.RIGHT,
        RoomTransition.TRANSITION_NONE,
      );
      Isaac.DebugString(
        `Exited Boss Rush, moving right to room: ${g.run.crawlspace.prevRoom}`,
      );
      break;
    }

    // Bottom left door
    case 427: {
      g.run.crawlspace.direction = Direction.DOWN;
      g.g.StartRoomTransition(
        g.run.crawlspace.prevRoom,
        Direction.DOWN,
        RoomTransition.TRANSITION_NONE,
      );
      Isaac.DebugString(
        `Exited Boss Rush, moving down to room: ${g.run.crawlspace.prevRoom}`,
      );
      break;
    }

    // Left top door
    case 112: {
      g.run.crawlspace.direction = Direction.LEFT;
      g.g.StartRoomTransition(
        g.run.crawlspace.prevRoom,
        Direction.LEFT,
        RoomTransition.TRANSITION_NONE,
      );
      Isaac.DebugString(
        `Exited Boss Rush, moving left to room: ${g.run.crawlspace.prevRoom}`,
      );
      break;
    }

    default: {
      break;
    }
  }
}

// Called in the PostNewRoom callback
export function checkMiscBugs(): void {
  // Local variables
  const roomIndex = misc.getRoomIndex();
  const prevRoomIndex = g.l.GetPreviousRoomIndex(); // We need the unsafe version here

  // For some reason, we won't go back to location of the crawlspace if we entered from a room
  // outside of the grid, so we need to move there manually
  // (in the Boss Rush, this will look glitchy because the game originally sends us next to a Boss
  // Rush door, but there is no way around this; even if we change player.Position on every frame in
  // the PostRender callback, the glitchy warp will still occur)
  if (
    roomIndex < 0 &&
    roomIndex !== GridRooms.ROOM_DUNGEON_IDX &&
    // We don't want to teleport if we are returning to a crawlspace from a Black Market
    roomIndex !== GridRooms.ROOM_BLACK_MARKET_IDX &&
    // We don't want to teleport in a Black Market
    prevRoomIndex === GridRooms.ROOM_DUNGEON_IDX
  ) {
    g.p.Position = g.l.DungeonReturnPosition;
    Isaac.DebugString(
      "Exited a crawlspace in an off-grid room; crawlspace teleport complete.",
    );
  }

  // For some reason, if we exit and re-enter a crawlspace from a room outside of the grid,
  // we won't spawn on the ladder, so move there manually
  // (this causes no visual hiccups like the above code does)
  if (
    roomIndex === GridRooms.ROOM_DUNGEON_IDX &&
    g.l.DungeonReturnRoomIndex < 0 &&
    !g.run.crawlspace.blackMarket
  ) {
    // This is the standard starting location at the top of the ladder
    g.p.Position = Vector(120, 160);
    Isaac.DebugString(
      "Entered crawlspace from a room outside the grid; ladder teleport complete.",
    );
  }

  // When returning to the boss room from a Boss Rush with a crawlspace in it,
  // we might not end up in a spot where the player expects,
  // so move to the most logical position manually
  if (g.run.crawlspace.direction !== -1) {
    let gridPosition: int;
    switch (g.run.crawlspace.direction) {
      // 0
      case Direction.LEFT: {
        // Returning from the right door
        gridPosition = 73;
        break;
      }

      // 1
      case Direction.UP: {
        // Returning from the bottom door
        gridPosition = 112;
        break;
      }

      // 2
      case Direction.RIGHT: {
        // Returning from the left door
        gridPosition = 61;
        break;
      }

      // 3
      case Direction.DOWN: {
        // Returning from the top door
        gridPosition = 22;
        break;
      }

      default: {
        error("Invalid crawlspace direction.");
      }
    }

    g.p.Position = g.r.GetGridPosition(gridPosition);
    g.run.crawlspace.direction = -1;
  }

  // Keep track of whether we are in a Black Market so that we don't teleport the player if they
  // return to the crawlspace
  g.run.crawlspace.blackMarket = roomIndex === GridRooms.ROOM_BLACK_MARKET_IDX;
}
