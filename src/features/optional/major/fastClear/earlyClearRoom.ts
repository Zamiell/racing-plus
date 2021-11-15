import { getGridEntities, log, openAllDoors } from "isaacscript-common";
import g from "../../../../globals";
import {
  CREEP_VARIANTS_TO_KILL,
  EARLY_CLEAR_ROOM_TYPE_BLACKLIST,
} from "./constants";
import v from "./v";

// ModCallbacks.MC_POST_UPDATE (1)
export function postUpdate(): void {
  checkEarlyClearRoom();
}

export function checkEarlyClearRoom(): void {
  const gameFrameCount = g.g.GetFrameCount();
  const roomFrameCount = g.r.GetFrameCount();
  const roomType = g.r.GetType();
  const roomClear = g.r.IsClear();

  // Do nothing if we already cleared the room
  if (v.run.earlyClearedRoom) {
    return;
  }

  // Under certain conditions, the room can be clear of enemies on the first frame
  // Thus, the earliest possible frame that fast-clear should apply is on frame 1
  if (roomFrameCount < 1) {
    return;
  }

  // Certain types of rooms are exempt from the fast-clear feature
  if (EARLY_CLEAR_ROOM_TYPE_BLACKLIST.has(roomType)) {
    return;
  }

  // If a frame has passed since an enemy died, reset the delay counter
  if (
    v.run.delayClearUntilFrame !== null &&
    gameFrameCount >= v.run.delayClearUntilFrame
  ) {
    v.run.delayClearUntilFrame = null;
  }

  // Check on every frame to see if we need to open the doors
  if (
    v.run.aliveEnemies.size === 0 &&
    v.run.delayClearUntilFrame === null &&
    !roomClear &&
    checkAllPressurePlatesPushed()
  ) {
    earlyClearRoom();
  }
}

function checkAllPressurePlatesPushed() {
  const hasPressurePlates = g.r.HasTriggerPressurePlates();

  if (!hasPressurePlates || v.room.buttonsAllPushed) {
    return true;
  }

  // We are in a room with pressure plates, so check to see if they have all been pressed
  for (const gridEntity of getGridEntities(
    GridEntityType.GRID_PRESSURE_PLATE,
  )) {
    const gridEntityDesc = gridEntity.GetSaveState();
    if (gridEntityDesc.State !== PressurePlateState.PRESSURE_PLATE_PRESSED) {
      return false;
    }
  }

  v.room.buttonsAllPushed = true;
  return true;
}

function earlyClearRoom() {
  v.run.earlyClearedRoom = true;
  log("Early clearing the room (fast-clear).");

  openAllDoors();
  killExtraEntities();
  g.r.TriggerClear();
  g.r.SetClear(true);
}

function killExtraEntities() {
  killDeathsHeads();
  killFleshDeathsHeads();
  killCreep();
}

function killDeathsHeads() {
  // We need to specify variant 0 because we do not want to target Dank Death's Heads
  const deathsHeads = Isaac.FindByType(
    EntityType.ENTITY_DEATHS_HEAD,
    -1,
    -1,
    false,
    true,
  );
  for (const deathsHead of deathsHeads) {
    // Death's Dank Head is a "normal" enemy in that it does not rely on other enemies in the room
    // to be alive
    if (deathsHead.Variant === DeathsHeadVariant.DANK_DEATHS_HEAD) {
      continue;
    }

    // Activate the death state
    const npc = deathsHead.ToNPC();
    if (npc !== undefined) {
      npc.State = 18; // There is no enum for the Death's Head death state
    }
  }
}

function killFleshDeathsHeads() {
  const fleshDeathsHeads = Isaac.FindByType(
    EntityType.ENTITY_FLESH_DEATHS_HEAD,
    -1,
    -1,
    false,
    true,
  );
  for (const entity of fleshDeathsHeads) {
    // Activating the death state won't make the tears explode out of it,
    // so just kill it and spawn another one, which will immediately die
    entity.Visible = false;
    entity.Kill();
    const newHead = g.g
      .Spawn(
        entity.Type,
        entity.Variant,
        entity.Position,
        entity.Velocity,
        entity.Parent,
        entity.SubType,
        entity.InitSeed,
      )
      .ToNPC();
    if (newHead !== undefined) {
      newHead.State = 18; // There is no enum for the Flesh Death's Head death state
    }
  }
}

function killCreep() {
  const creepEntities = Isaac.FindByType(
    EntityType.ENTITY_EFFECT,
    -1,
    -1,
    false,
    true,
  );
  for (const entity of creepEntities) {
    if (CREEP_VARIANTS_TO_KILL.has(entity.Variant)) {
      entity.Kill();
    }
  }
}
