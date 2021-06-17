import g from "../../globals";
import {
  consoleCommand,
  getPlayers,
  getRoomIndex,
  gridToPos,
} from "../../misc";
import {
  RACE_ROOM_POSITION,
  RACE_ROOM_STAGE_ID,
  RACE_ROOM_VARIANT,
} from "./constants";

const sprites = {
  spriteTodo: null as Sprite | null,
};

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  emulateGapingMaws();
  drawSprites();
}

function emulateGapingMaws() {
  // Hold the player in place when in the Race Room (to emulate the Gaping Maws effect)
  // (this looks glitchy and jittery if it is done in the PostUpdate callback,
  // so do it here instead)
  if (!g.raceVars.started && inRaceRoom()) {
    for (const player of getPlayers()) {
      player.Position = RACE_ROOM_POSITION;
    }
  }
}

function drawSprites() {}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  gotoRaceRoom();
  setupRaceRoom();
}

function gotoRaceRoom() {
  if (!shouldGotoRaceRoom()) {
    return;
  }

  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  // If we not already on Cellar 1, go there
  // We use the Cellar because it is the cleanest floor
  if (stage !== 1 || stageType !== StageType.STAGETYPE_WOTL) {
    // Since we might be going to a new floor on frame 0,
    // we have to specify that the "newLevel()" function should run
    g.run.forceNextLevel = true;
    consoleCommand("stage 1a");
  }

  // For the race room, we use a room with no grid entities and a single Gaper
  // Since we might be going to a new room on frame 0,
  // we have to specify that the "newRoom()" function should run
  g.run.forceNextRoom = true;
  consoleCommand("goto d.5");
  // We will not actually be sent to the room until a frame passes,
  // so wait until the next PostNewRoom fires
}

function shouldGotoRaceRoom() {
  return (
    (g.race.status === "open" || g.race.status === "starting") &&
    // Only bring them to the race room if they are not in the middle of a run
    // e.g. the only room that they have entered is the starting room on Basement 1
    g.run.roomsEntered === 1
  );
}

function setupRaceRoom() {
  if (!shouldSetupRaceRoom()) {
    return;
  }

  const gapers = Isaac.FindByType(EntityType.ENTITY_GAPER);
  for (const gaper of gapers) {
    gaper.Remove();
  }
  g.r.SetClear(true);

  // We want to trap the player in the room, so delete all 4 doors
  for (let i = 0; i <= 3; i++) {
    g.r.RemoveDoor(i);
  }

  // Put the player next to the bottom door
  for (const player of getPlayers()) {
    player.Position = RACE_ROOM_POSITION;
  }

  // Put familiars next to the bottom door, if any
  const familiars = Isaac.FindByType(EntityType.ENTITY_FAMILIAR);
  for (const familiar of familiars) {
    familiar.Position = RACE_ROOM_POSITION;
  }

  // Spawn two Gaping Maws (235.0)
  const positions = [
    [5, 5],
    [7, 5],
  ];
  for (const [x, y] of positions) {
    Isaac.Spawn(
      EntityType.ENTITY_GAPING_MAW,
      0,
      0,
      gridToPos(x, y),
      Vector.Zero,
      null,
    );
  }
  g.sfx.Stop(SoundEffect.SOUND_SUMMON_POOF);

  // Disable the MinimapAPI to emulate what happens with the vanilla map
  if (MinimapAPI !== null) {
    MinimapAPI.Config.Disable = true;
  }
}

function shouldSetupRaceRoom() {
  return (
    (g.race.status === "open" || g.race.status === "starting") && inRaceRoom()
  );
}

export function inRaceRoom(): boolean {
  const roomDesc = g.l.GetCurrentRoomDesc();
  const roomData = roomDesc.Data;
  const roomStageID = roomData.StageID;
  const roomVariant = roomData.Variant;
  const roomIndex = getRoomIndex();

  return (
    roomStageID === RACE_ROOM_STAGE_ID &&
    roomVariant === RACE_ROOM_VARIANT &&
    roomIndex === GridRooms.ROOM_DEBUG_IDX
  );
}

export function resetSprites(): void {
  for (const key of Object.keys(sprites)) {
    const property = key as keyof typeof sprites;
    sprites[property] = null;
  }
}

export function initSprites(): void {
  // if (g.race.status === "" format)
}
