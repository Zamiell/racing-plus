import {
  forceNewLevelCallback,
  forceNewRoomCallback,
  getPlayers,
  getRoomIndex,
  getRoomStageID,
  getRoomVariant,
  gridToPos,
  removeAllEntities,
} from "isaacscript-common";
import g from "../../globals";
import { consoleCommand, initSprite } from "../../util";
import {
  RACE_ROOM_POSITION,
  RACE_ROOM_STAGE_ID,
  RACE_ROOM_VARIANT,
} from "./constants";

const GFX_PATH = "gfx/race/race-room";
const X_SPACING = 110;
const Y_SPACING = 10;

const sprites = {
  // Top half
  wait: null as Sprite | null, // "Wait for the race to begin!"
  myStatus: null as Sprite | null,
  numReady: null as Sprite | null,
  slash: null as Sprite | null,
  numEntrants: null as Sprite | null,

  // Bottom half
  ranked: null as Sprite | null,
  rankedIcon: null as Sprite | null,
  format: null as Sprite | null,
  formatIcon: null as Sprite | null,
  goal: null as Sprite | null,
  goalIcon: null as Sprite | null,
};

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  if (!inRaceRoom()) {
    return;
  }

  emulateGapingMaws();
  drawSprites();
}

function emulateGapingMaws() {
  // Hold the player in place when in the Race Room (to emulate the Gaping Maws effect)
  // (this looks glitchy and jittery if it is done in the PostUpdate callback,
  // so do it here instead)
  for (const player of getPlayers()) {
    player.Position = RACE_ROOM_POSITION;
  }
}

function drawSprites() {
  for (const [key, sprite] of Object.entries(sprites)) {
    if (sprite !== null) {
      const spriteName = key as keyof typeof sprites;
      const position = getPosition(spriteName);
      sprite.RenderLayer(0, position);
    }
  }
}

function getPosition(spriteName: keyof typeof sprites) {
  const centerPos = g.r.GetCenterPos();
  const renderPosition = Isaac.WorldToRenderPosition(centerPos);

  switch (spriteName) {
    case "wait": {
      return Vector(renderPosition.X, renderPosition.Y - 80);
    }

    case "myStatus": {
      return Vector(renderPosition.X, renderPosition.Y - 40);
    }

    case "numReady": {
      return Vector(renderPosition.X - 20, renderPosition.Y - 15);
    }

    case "slash": {
      return Vector(renderPosition.X, renderPosition.Y - 15);
    }

    case "numEntrants": {
      return Vector(renderPosition.X + 20, renderPosition.Y - 15);
    }

    case "ranked": {
      return Vector(renderPosition.X - X_SPACING, renderPosition.Y + Y_SPACING);
    }

    case "rankedIcon": {
      return Vector(
        renderPosition.X - X_SPACING,
        renderPosition.Y + Y_SPACING + 23,
      );
    }

    case "format": {
      return Vector(renderPosition.X + X_SPACING, renderPosition.Y + Y_SPACING);
    }

    case "formatIcon": {
      return Vector(
        renderPosition.X + X_SPACING,
        renderPosition.Y + Y_SPACING + 23,
      );
    }

    case "goal": {
      return Vector(renderPosition.X - 25, renderPosition.Y + 95);
    }

    case "goalIcon": {
      return Vector(renderPosition.X + 25, renderPosition.Y + 95);
    }

    default: {
      error(`Race room sprites named "${spriteName}" are unsupported.`);
      return Vector.Zero;
    }
  }
}

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
    // we have to specify that the PostNewLevel callback should fire
    forceNewLevelCallback();
    consoleCommand("stage 1a");
  }

  // For the race room, we use a room with no grid entities and a single Gaper
  // Since we might be going to a new room on frame 0,
  // we have to specify that the PostNewRoom callback should fire
  forceNewRoomCallback();
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
  removeAllEntities(gapers);
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
    const gapingMaw = Isaac.Spawn(
      EntityType.ENTITY_GAPING_MAW,
      0,
      0,
      gridToPos(x, y),
      Vector.Zero,
      null,
    );
    gapingMaw.ClearEntityFlags(EntityFlag.FLAG_APPEAR); // Make them appear instantly
  }

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
  const roomStageID = getRoomStageID();
  const roomVariant = getRoomVariant();
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
  if (g.race.status !== "open") {
    return;
  }

  // Top half
  sprites.wait = initSprite(`${GFX_PATH}/wait.anm2`);
  initMyStatusSprite();
  initNumReadySprite();
  sprites.slash = initSprite(`${GFX_PATH}/slash.anm2`);
  initNumEntrantsSprite();

  // Bottom half
  const isRanked = g.race.ranked || !g.race.solo;
  const ranked = isRanked ? "ranked" : "unranked";
  sprites.ranked = initSprite(`${GFX_PATH}/ranked/${ranked}.anm2`);
  sprites.rankedIcon = initSprite(`${GFX_PATH}/ranked/${ranked}-icon.anm2`);
  sprites.format = initSprite(`${GFX_PATH}/formats/${g.race.format}.anm2`);
  sprites.formatIcon = initSprite(
    `${GFX_PATH}/formats/${g.race.format}-icon.anm2`,
  );
  sprites.goal = initSprite(`${GFX_PATH}/goal.anm2`);
  sprites.goalIcon = initSprite(`${GFX_PATH}/goals/${g.race.goal}.anm2`);
}

function initMyStatusSprite() {
  sprites.myStatus = initSprite(
    `${GFX_PATH}/my-status/${g.race.myStatus}.anm2`,
  );
}

function initNumReadySprite() {
  sprites.numReady = initNumSprite(g.race.numReady);
}

function initNumEntrantsSprite() {
  sprites.numEntrants = initNumSprite(g.race.numEntrants);
}

function initNumSprite(num: int) {
  const anm2Name = num > 50 ? "unknown" : num.toString();
  return initSprite(`${GFX_PATH}/ready/${anm2Name}.anm2`);
}

export function statusChanged(): void {
  if (g.race.status === "starting") {
    sprites.wait = null;
    sprites.myStatus = null;
    sprites.numReady = null;
    sprites.slash = null;
    sprites.numEntrants = null;
  }
}

export function myStatusChanged(): void {
  if (g.race.status === "open") {
    initMyStatusSprite();
  }
}

export function numReadyChanged(): void {
  if (g.race.status === "open") {
    initNumReadySprite();
  }
}

export function numEntrantsChanged(): void {
  if (g.race.status === "open") {
    initNumEntrantsSprite();
  }
}
