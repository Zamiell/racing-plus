import g from "../../../../../globals";
import clearRoom from "../clearRoom";

export function main(): void {
  if (!g.fastClear) {
    return;
  }

  checkClearRoom();
  deleteAngels();
}

function checkClearRoom() {
  const gameFrameCount = g.g.GetFrameCount();
  const roomClear = g.r.IsClear();
  const roomFrameCount = g.r.GetFrameCount();

  // Disable fast-clear in Greed Mode
  if (g.g.Difficulty >= Difficulty.DIFFICULTY_GREED) {
    return;
  }

  // Disable fast-clear if we are on the "PAC1F1CM" seed / Easter Egg
  if (g.seeds.HasSeedEffect(SeedEffect.SEED_PACIFIST)) {
    return;
  }

  // If a frame has passed since an enemy died, reset the delay counter
  if (
    g.run.fastClear.delayFrame !== 0 &&
    gameFrameCount >= g.run.fastClear.delayFrame
  ) {
    g.run.fastClear.delayFrame = 0;
  }

  // Check on every frame to see if we need to open the doors
  if (
    g.run.fastClear.aliveEnemiesCount === 0 &&
    g.run.fastClear.delayFrame === 0 &&
    !roomClear &&
    checkAllPressurePlatesPushed() &&
    // Under certain conditions, the room can be clear of enemies on the first frame
    roomFrameCount > 1 &&
    !g.run.fastClear.deferClearForGhost
  ) {
    clearRoom();
  }
}

function checkAllPressurePlatesPushed() {
  // If we are in a puzzle room, check to see if all of the plates have been pressed
  if (g.run.fastClear.buttonsAllPushed || !g.r.HasTriggerPressurePlates()) {
    return true;
  }

  // Check all the grid entities in the room
  const gridSize = g.r.GetGridSize();
  for (let i = 1; i <= gridSize; i++) {
    const gridEntity = g.r.GetGridEntity(i);
    if (gridEntity !== null) {
      const saveState = gridEntity.GetSaveState();
      if (
        saveState.Type === GridEntityType.GRID_PRESSURE_PLATE &&
        saveState.State !== 3
      ) {
        return false;
      }
    }
  }

  g.run.fastClear.buttonsAllPushed = true;
  return true;
}

function deleteAngels() {
  for (const entityType of [
    EntityType.ENTITY_URIEL, // 271
    EntityType.ENTITY_GABRIEL, // 272
  ]) {
    const deathAnimationLength = 24;
    deleteDyingEntity(entityType, deathAnimationLength);
  }
}

function deleteDyingEntity(entityType: EntityType, deathAnimationLength: int) {
  const gameFrameCount = g.g.GetFrameCount();
  const entities = Isaac.FindByType(entityType, -1, -1, false, false);
  for (const entity of entities) {
    // This is for deleting entities that drop items
    // We want to delete the entity on the frame before they drop the item
    // (this cannot be in the NPCUpdate callback because that does not fire when an NPC is in the
    // death animation)
    const data = entity.GetData();
    const killedFrame = data.killedFrame as int | undefined;
    if (
      killedFrame !== undefined &&
      gameFrameCount >= killedFrame + deathAnimationLength - 1
    ) {
      entity.Remove();
    }
  }
}
