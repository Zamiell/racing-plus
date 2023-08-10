import {
  BossID,
  DeathsHeadVariant,
  EffectVariant,
  EntityCollisionClass,
  EntityType,
  NPCState,
} from "isaac-typescript-definitions";
import {
  asNumber,
  game,
  getEntities,
  getNPCs,
  getRoomData,
  getRoomName,
  inBeastRoom,
  inBossRoomOf,
  isAllPressurePlatesPushed,
  log,
  openAllDoors,
  removeAllEffects,
  spawnNPC,
} from "isaacscript-common";
import { replacePhotosPostFastClear } from "../../../mandatory/misc/ReplacePhotos";
import { spawnRepentanceDoorPostFastClear } from "../../../speedrun/SpawnRepentanceDoor";
import { season3PostFastClear } from "../../../speedrun/season3/fastClear";
import {
  CREEP_VARIANTS_TO_KILL,
  EARLY_CLEAR_ROOM_TYPE_BLACKLIST,
} from "./constants";
import { postItLivesOrHushPathPostFastClear } from "./postItLivesOrHushPath";
import { v } from "./v";

// ModCallback.POST_UPDATE (1)
export function earlyClearRoomPostUpdate(): void {
  checkEarlyClearRoom();
}

function checkEarlyClearRoom() {
  const gameFrameCount = game.GetFrameCount();
  const room = game.GetRoom();
  const roomFrameCount = room.GetFrameCount();
  const roomType = room.GetType();
  const roomClear = room.IsClear();

  // Do nothing if we already cleared the room.
  if (v.room.fastClearedRoom) {
    return;
  }

  // Under certain conditions, the room can be clear of enemies on the first frame. Thus, the
  // earliest possible frame that fast-clear should apply is on frame 1.
  if (roomFrameCount < 1) {
    return;
  }

  // Certain types of rooms are exempt from the fast-clear feature.
  if (EARLY_CLEAR_ROOM_TYPE_BLACKLIST.has(roomType)) {
    return;
  }

  // The Great Gideon is exempt from the fast-clear feature (since it can cause the boss item to
  // spawn on a pit from a Rock Explosion).
  if (inBossRoomOf(BossID.GREAT_GIDEON)) {
    return;
  }

  // The Beast fight is exempt from the fast-clear feature (since it will prevent the trophy logic
  // from working correctly).
  if (inBeastRoom()) {
    return;
  }

  // If a frame has passed since an enemy died, reset the delay counter.
  if (
    v.room.delayClearUntilGameFrame !== null &&
    gameFrameCount >= v.room.delayClearUntilGameFrame
  ) {
    v.room.delayClearUntilGameFrame = null;
  }

  // Check on every frame to see if we need to open the doors.
  if (
    v.room.aliveEnemies.size === 0 &&
    v.room.delayClearUntilGameFrame === null &&
    !roomClear &&
    isAllPressurePlatesPushed()
  ) {
    earlyClearRoom();
  }
}

function earlyClearRoom() {
  const gameFrameCount = game.GetFrameCount();
  const room = game.GetRoom();
  const roomData = getRoomData();
  const roomID = `${roomData.Type}.${roomData.Variant}.${roomData.Subtype}`;
  const roomName = getRoomName();

  v.room.fastClearedRoom = true;
  log(
    `Fast-clearing room ${roomID} (${roomName}) on game frame: ${gameFrameCount}`,
  );

  // The `Room.TriggerClear` method must be before other logic because extra doors can be spawned by
  // clearing the room.
  room.TriggerClear();
  room.SetClear(true);

  openAllDoors();
  killExtraEntities();

  postFastClear();
}

export function postFastClear(): void {
  // Mandatory
  replacePhotosPostFastClear();

  // Major
  postItLivesOrHushPathPostFastClear();

  // Speedrun
  spawnRepentanceDoorPostFastClear();
  season3PostFastClear();
}

function killExtraEntities() {
  killDeathsHeads();
  killFleshDeathsHeads();
  killCreep();

  // The fart wave attack from Clog can cause a softlock since the wave creates poops and the poops
  // can overwrite the trapdoor grid entity.
  removeAllEffects(EffectVariant.FART_WAVE);
}

function killDeathsHeads() {
  const deathsHeads = getNPCs(
    EntityType.DEATHS_HEAD,
    undefined,
    undefined,
    true,
  );
  for (const deathsHead of deathsHeads) {
    // Death's Dank Head is a "normal" enemy in that it does not rely on other enemies in the room
    // to be alive. (It is the only variant that has this behavior.)
    if (deathsHead.Variant === asNumber(DeathsHeadVariant.DANK_DEATHS_HEAD)) {
      continue;
    }

    // Activate the death state. (We can't use the `Entity.Kill` method because it would immediately
    // vanish.)
    deathsHead.State = NPCState.DEATH;

    // Players should be able to run through them as they are dying; this matches the vanilla
    // behavior.
    deathsHead.EntityCollisionClass = EntityCollisionClass.NONE;
  }
}

function killFleshDeathsHeads() {
  const fleshDeathsHeads = getNPCs(
    EntityType.FLESH_DEATHS_HEAD,
    undefined,
    undefined,
    true,
  );
  for (const fleshDeathsHead of fleshDeathsHeads) {
    // Activating the death state won't make the tears explode out of it, so just kill it and spawn
    // another one, which will immediately die.
    fleshDeathsHead.Visible = false;
    fleshDeathsHead.Kill();
    const newHead = spawnNPC(
      EntityType.FLESH_DEATHS_HEAD,
      fleshDeathsHead.Variant,
      fleshDeathsHead.SubType,
      fleshDeathsHead.Position,
      fleshDeathsHead.Velocity,
      fleshDeathsHead.Parent,
      fleshDeathsHead.InitSeed,
    );
    newHead.State = NPCState.DEATH;
  }
}

function killCreep() {
  const creeps = getEntities(EntityType.EFFECT, -1, -1, true);
  for (const creep of creeps) {
    if (CREEP_VARIANTS_TO_KILL.has(creep.Variant as EffectVariant)) {
      creep.Kill();
    }
  }
}
