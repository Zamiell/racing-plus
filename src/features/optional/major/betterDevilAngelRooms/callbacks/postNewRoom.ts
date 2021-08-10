import { getDoors, log } from "isaacscript-common";
import g from "../../../../../globals";
import { config } from "../../../../../modConfigMenu";
import angel from "../angel";
import devil from "../devil";

const ENTITIES_TO_NOT_REMOVE = [EntityType.ENTITY_DARK_ESAU];
const MIN_GRID_INDEX = 0;
const MAX_GRID_INDEX = 134;

export default function betterDevilAngelRoomsPostNewRoom(): void {
  if (!config.betterDevilAngelRooms) {
    return;
  }

  const roomType = g.r.GetType();
  const roomShape = g.r.GetRoomShape();
  const isFirstVisit = g.r.IsFirstVisit();

  if (
    roomType !== RoomType.ROOM_DEVIL && // 14
    roomType !== RoomType.ROOM_ANGEL // 15
  ) {
    return;
  }

  if (roomShape !== RoomShape.ROOMSHAPE_1x1) {
    error("Seeding non-1x1 rooms is not supported.");
  }

  if (!isFirstVisit) {
    return;
  }

  removePickupsAndSlotsAndNPCs();
  setCleared();
  fillRoomWithPressurePlates();

  if (roomType === RoomType.ROOM_DEVIL) {
    devil();
  } else if (roomType === RoomType.ROOM_ANGEL) {
    angel();
  }
}

// We do this here instead of in the PreRoomEntitySpawn callback so that they will not re-appear
// when we re-enter the room
function removePickupsAndSlotsAndNPCs() {
  for (const entity of Isaac.GetRoomEntities()) {
    if (ENTITIES_TO_NOT_REMOVE.includes(entity.Type)) {
      continue;
    }

    const npc = entity.ToNPC();
    if (
      entity.Type === EntityType.ENTITY_PICKUP ||
      entity.Type === EntityType.ENTITY_SLOT ||
      (npc !== null &&
        !npc.HasEntityFlags(EntityFlag.FLAG_CHARM) &&
        !npc.HasEntityFlags(EntityFlag.FLAG_FRIENDLY) &&
        !npc.HasEntityFlags(EntityFlag.FLAG_PERSISTENT))
    ) {
      entity.ClearEntityFlags(EntityFlag.FLAG_APPEAR);
      entity.Remove();

      // When fire places are removed, they will leave behind a "path" that will prevent future grid
      // entities from being spawned on the same square
      // Thus, reset the path for this square if this is a fire place
      if (entity.Type === EntityType.ENTITY_FIREPLACE) {
        const gridIndex = g.r.GetGridIndex(entity.Position);
        g.r.SetGridPath(gridIndex, 0);
      }
    }
  }
}

// If the vanilla version of the room had an enemy in it, then the doors will start closed
// Manually fix this
function setCleared() {
  const roomClear = g.r.IsClear();

  // There were no vanilla enemies in the room
  if (roomClear) {
    return;
  }

  g.r.SetClear(true);
  for (const door of getDoors()) {
    door.State = DoorState.STATE_OPEN;
    const sprite = door.GetSprite();
    sprite.Play("Opened", true);

    // If there was a vanilla Krampus in the room,
    // then the door would be barred in addition to being closed
    // Ensure that the bar is not visible
    door.ExtraVisible = false;

    log(
      "Manually opened a Devil Room or Angel Room door (since there are not supposed to be enemies in the room).",
    );
  }
  g.sfx.Stop(SoundEffect.SOUND_DOOR_HEAVY_OPEN);
}

function fillRoomWithPressurePlates() {
  const gridSize = g.r.GetGridSize();

  // In the PreRoomEntitySpawn callback, we prevented every entity from spawning
  // However, if we exit and re-enter the room, all the vanilla entities will spawn again
  // In order to prevent this from happening, we can spawn a grid entity on every square,
  // which the game will remember
  // The natural grid entity to choose for this purpose would be a decoration,
  // since it is non-interacting
  // After spawning a decoration, we can manually remove the sprite
  // The problem with this method is that the sprite will have to be re-removed every time the
  // player re-enters the move, so you must also track the decorations that you spawn
  // A simpler method is to spawn a pressure plate instead of a decoration, and set its state to 1
  // (a state of 1 is unused by the game)
  // The game will remember that the pressure plate is supposed to spawn on the grid,
  // but it will render it invisible
  // Thus, fill the room with pressure plates and set their state
  for (let gridIndex = 0; gridIndex < gridSize; gridIndex++) {
    if (!isWall(gridIndex)) {
      const position = g.r.GetGridPosition(gridIndex);
      const button = Isaac.GridSpawn(
        GridEntityType.GRID_PRESSURE_PLATE,
        PressurePlateVariant.REWARD_PLATE,
        position,
        true,
      );

      // State 2 is unused and will prevent the button from being pressed
      // (state 1 also has this property,
      // but state 1 will not be be remembered by the game when re-entering the room)
      button.State = 2;

      // The sprite has to be manually removed
      // (but it will not need to be removed upon subsequent visits to the room)
      const sprite = button.GetSprite();
      sprite.ReplaceSpritesheet(0, "gfx/none.png");
      sprite.LoadGraphics();
    }
  }
}

function isWall(gridIndex: int) {
  if (gridIndex < MIN_GRID_INDEX) {
    error(
      `The isWall function does not support grid indexes below ${MIN_GRID_INDEX}.`,
    );
  }

  if (gridIndex > MAX_GRID_INDEX) {
    error(
      `The isWall function does not support grid indexes above ${MAX_GRID_INDEX}.`,
    );
  }

  return (
    // Top wall
    (gridIndex >= 0 && gridIndex <= 14) ||
    // Bottom wall
    (gridIndex >= 120 && gridIndex <= 134) ||
    // Left wall
    gridIndex % 15 === 0 ||
    // Right wall
    (gridIndex + 1) % 15 === 0
  );
}
