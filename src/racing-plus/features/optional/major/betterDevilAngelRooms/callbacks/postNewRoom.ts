import { inAngelShop } from "isaacscript-common";
import g from "../../../../../globals";
import { config } from "../../../../../modConfigMenu";
import { setRoomCleared } from "../../../../../utilGlobals";
import angel from "../angel";
import devil from "../devil";
import v from "../v";

const ENTITIES_TO_NOT_REMOVE = new Set<EntityType>([
  EntityType.ENTITY_DARK_ESAU,
]);

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

  // Angel shops do not need to be seeded
  if (inAngelShop()) {
    return;
  }

  if (roomShape !== RoomShape.ROOMSHAPE_1x1) {
    error("Seeding non-1x1 rooms is not supported.");
  }

  if (!isFirstVisit) {
    removeDecorationSprites();
    respawnPersistentEntities();
    return;
  }

  v.level.roomBuilt = true;

  removePickupsAndSlotsAndNPCs();
  setRoomCleared();

  if (v.run.intentionallyLeaveEmpty) {
    v.run.intentionallyLeaveEmpty = false;
    fillRoomWithDecorations();
    return;
  }

  if (roomType === RoomType.ROOM_DEVIL) {
    devil();
  } else if (roomType === RoomType.ROOM_ANGEL) {
    angel();
  }

  fillRoomWithDecorations();
}

// Every time we re-enter the room, the sprites for all of the decorations will come back,
// so we have to remove them again
function removeDecorationSprites() {
  for (const gridIndex of v.level.spawnedDecorationGridIndexes) {
    const gridEntity = g.r.GetGridEntity(gridIndex);
    if (gridEntity !== undefined) {
      removeSprite(gridEntity);
    }
  }
}

// Some entities do not properly respawn when the room is re-entered
function respawnPersistentEntities() {
  for (const persistentEntity of v.level.persistentEntities) {
    const position = g.r.GetGridPosition(persistentEntity.gridIndex);
    Isaac.Spawn(
      persistentEntity.type,
      persistentEntity.variant,
      persistentEntity.subType,
      position,
      Vector.Zero,
      undefined,
    );
  }
}

// We do this here instead of in the PreRoomEntitySpawn callback so that they will not re-appear
// when we re-enter the room
function removePickupsAndSlotsAndNPCs() {
  for (const entity of Isaac.GetRoomEntities()) {
    if (ENTITIES_TO_NOT_REMOVE.has(entity.Type)) {
      continue;
    }

    const npc = entity.ToNPC();
    if (
      entity.Type === EntityType.ENTITY_PICKUP ||
      entity.Type === EntityType.ENTITY_SLOT ||
      (npc !== undefined &&
        !npc.HasEntityFlags(EntityFlag.FLAG_CHARM) &&
        !npc.HasEntityFlags(EntityFlag.FLAG_FRIENDLY) &&
        !npc.HasEntityFlags(EntityFlag.FLAG_PERSISTENT))
    ) {
      entity.ClearEntityFlags(EntityFlag.FLAG_APPEAR);
      entity.Remove();

      // When fire places are removed, they will leave behind a "path" that will prevent future grid
      // entities from being spawned on the same tile
      // Thus, reset the path for this tile if this is a fire place
      if (entity.Type === EntityType.ENTITY_FIREPLACE) {
        const gridIndex = g.r.GetGridIndex(entity.Position);
        g.r.SetGridPath(gridIndex, 0);
      }
    }
  }
}

function fillRoomWithDecorations() {
  const gridSize = g.r.GetGridSize();

  // In the PreRoomEntitySpawn callback, we prevented every entity from spawning
  // However, if we exit and re-enter the room, all the vanilla entities will spawn again
  // In order to prevent this from happening, we can spawn a grid entity on every tile that does not
  // already have a grid entity
  // The natural grid entity to choose for this purpose is a decoration, since it is non-interacting
  // Another option besides decorations would be to use a pressure plates with a state of 1,
  // which is a state that is normally unused by the game and makes it invisible + persistent
  // However, pickups will not be able to spawn on pressure plates, which lead to various bugs
  // (e.g. pickups spawning on top of pits)
  for (let gridIndex = 0; gridIndex < gridSize; gridIndex++) {
    const existingGridEntity = g.r.GetGridEntity(gridIndex);
    if (existingGridEntity !== null) {
      continue;
    }

    const position = g.r.GetGridPosition(gridIndex);
    const decoration = Isaac.GridSpawn(
      GridEntityType.GRID_DECORATION,
      0,
      position,
      true,
    );

    removeSprite(decoration);
    v.level.spawnedDecorationGridIndexes.push(gridIndex);
  }
}

function removeSprite(gridEntity: GridEntity) {
  const sprite = gridEntity.GetSprite();
  sprite.ReplaceSpritesheet(0, "gfx/none.png");
  sprite.LoadGraphics();
}
