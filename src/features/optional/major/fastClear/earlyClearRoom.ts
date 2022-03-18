import {
  getEffectiveStage,
  getNPCs,
  inBeastRoom,
  inBossRoomOf,
  isAllPressurePlatesPushed,
  log,
  openAllDoors,
} from "isaacscript-common";
import g from "../../../../globals";
import { inSpeedrun } from "../../../speedrun/speedrun";
import {
  CREEP_VARIANTS_TO_KILL,
  EARLY_CLEAR_ROOM_TYPE_BLACKLIST,
} from "./constants";
import * as postItLivesOrHushPath from "./postItLivesOrHushPath";
import v from "./v";

const EXTRA_FAST_CLEAR_DEBUG = false;

// ModCallbacks.MC_POST_UPDATE (1)
export function postUpdate(): void {
  checkEarlyClearRoom();
}

function checkEarlyClearRoom() {
  const gameFrameCount = g.g.GetFrameCount();
  const roomFrameCount = g.r.GetFrameCount();
  const roomType = g.r.GetType();
  const roomClear = g.r.IsClear();

  if (EXTRA_FAST_CLEAR_DEBUG) {
    Isaac.DebugString(
      `GETTING HERE - FAST-CLEAR - 1 - gameFrameCount: ${gameFrameCount}`,
    );
  }

  // Do nothing if we already cleared the room
  if (v.room.fastClearedRoom) {
    return;
  }

  if (EXTRA_FAST_CLEAR_DEBUG) {
    Isaac.DebugString(
      `GETTING HERE - FAST-CLEAR - 2 - gameFrameCount: ${gameFrameCount}`,
    );
  }

  // Under certain conditions, the room can be clear of enemies on the first frame
  // Thus, the earliest possible frame that fast-clear should apply is on frame 1
  if (roomFrameCount < 1) {
    return;
  }

  if (EXTRA_FAST_CLEAR_DEBUG) {
    Isaac.DebugString(
      `GETTING HERE - FAST-CLEAR - 3 - gameFrameCount: ${gameFrameCount}`,
    );
  }

  // Certain types of rooms are exempt from the fast-clear feature
  if (EARLY_CLEAR_ROOM_TYPE_BLACKLIST.has(roomType)) {
    return;
  }

  if (EXTRA_FAST_CLEAR_DEBUG) {
    Isaac.DebugString(
      `GETTING HERE - FAST-CLEAR - 4 - gameFrameCount: ${gameFrameCount}`,
    );
  }

  // The Great Gideon is exempt from the fast-clear feature
  // (since it can cause the boss item to spawn on a pit from a Rock Explosion)
  if (inBossRoomOf(BossID.GREAT_GIDEON)) {
    return;
  }

  if (EXTRA_FAST_CLEAR_DEBUG) {
    Isaac.DebugString(
      `GETTING HERE - FAST-CLEAR - 5 - gameFrameCount: ${gameFrameCount}`,
    );
  }

  // The Beast fight is exempt from the fast-clear feature
  // (since it will prevent the trophy logic from working correctly)
  if (inBeastRoom()) {
    return;
  }

  if (EXTRA_FAST_CLEAR_DEBUG) {
    Isaac.DebugString(
      `GETTING HERE - FAST-CLEAR - 6 - gameFrameCount: ${gameFrameCount}, v.room.delayClearUntilGameFrame: ${v.room.delayClearUntilGameFrame}`,
    );
  }

  // If a frame has passed since an enemy died, reset the delay counter
  if (
    v.room.delayClearUntilGameFrame !== null &&
    gameFrameCount >= v.room.delayClearUntilGameFrame
  ) {
    v.room.delayClearUntilGameFrame = null;
  }

  if (EXTRA_FAST_CLEAR_DEBUG) {
    Isaac.DebugString(
      `GETTING HERE - FAST-CLEAR - 7 - gameFrameCount: ${gameFrameCount}, v.room.delayClearUntilGameFrame: ${
        v.room.delayClearUntilGameFrame
      }, v.room.aliveEnemies.size: ${
        v.room.aliveEnemies.size
      }, roomClear: ${roomClear}, isAllPressurePlatesPushed: ${isAllPressurePlatesPushed()}`,
    );
  }

  // Check on every frame to see if we need to open the doors
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
  const gameFrameCount = g.g.GetFrameCount();
  const roomType = g.r.GetType();
  const effectiveStage = getEffectiveStage();

  v.room.fastClearedRoom = true;
  log(`Fast-clearing the room on game frame: ${gameFrameCount}`);

  // The "TriggerClear()" method must be before other logic because extra doors can be spawned by
  // clearing the room
  g.r.TriggerClear();
  g.r.SetClear(true);

  openAllDoors();
  killExtraEntities();
  postItLivesOrHushPath.fastClear();

  // Paths to Repentance floors will not appear in custom challenges that have a goal of Blue Baby
  // Thus, spawn the path manually if we are on a custom challenge
  // We only spawn them the Downpour/Dross doors to avoid this bug:
  // https://clips.twitch.tv/WittyUnsightlyStarStrawBeary-LsPINfzBGVT593oZ
  // (seed G8KS NX4C)
  if (
    inSpeedrun() &&
    roomType === RoomType.ROOM_BOSS &&
    (effectiveStage === 1 || effectiveStage === 2)
  ) {
    g.r.TrySpawnSecretExit(true, true);
  }
}

function killExtraEntities() {
  killDeathsHeads();
  killFleshDeathsHeads();
  killCreep();
}

function killDeathsHeads() {
  const deathsHeads = getNPCs(
    EntityType.ENTITY_DEATHS_HEAD,
    undefined,
    undefined,
    true,
  );
  for (const deathsHead of deathsHeads) {
    // Death's Dank Head is a "normal" enemy in that it does not rely on other enemies in the room
    // to be alive
    // (it is the only variant that has this behavior)
    if (deathsHead.Variant === DeathsHeadVariant.DANK_DEATHS_HEAD) {
      continue;
    }

    // Activate the death state
    deathsHead.State = NpcState.STATE_DEATH;
    // (we can't do "deathsHead.Kill()" because then it immediately vanishes)
    deathsHead.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE;
    // (players should be able to run through them as they are dying;
    // this matches the vanilla behavior)
  }
}

function killFleshDeathsHeads() {
  const fleshDeathsHeads = getNPCs(
    EntityType.ENTITY_FLESH_DEATHS_HEAD,
    undefined,
    undefined,
    true,
  );
  for (const fleshDeathsHead of fleshDeathsHeads) {
    // Activating the death state won't make the tears explode out of it,
    // so just kill it and spawn another one, which will immediately die
    fleshDeathsHead.Visible = false;
    fleshDeathsHead.Kill();
    const newHead = g.g
      .Spawn(
        fleshDeathsHead.Type,
        fleshDeathsHead.Variant,
        fleshDeathsHead.Position,
        fleshDeathsHead.Velocity,
        fleshDeathsHead.Parent,
        fleshDeathsHead.SubType,
        fleshDeathsHead.InitSeed,
      )
      .ToNPC();
    if (newHead !== undefined) {
      newHead.State = NpcState.STATE_DEATH;
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
