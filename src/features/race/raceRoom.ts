import {
  EntityFlag,
  EntityType,
  GridRoom,
  StageType,
} from "isaac-typescript-definitions";
import {
  forceNewLevelCallback,
  forceNewRoomCallback,
  getEffectiveStage,
  getFamiliars,
  getNPCs,
  getPlayers,
  getRoomGridIndex,
  getRoomStageID,
  getRoomVariant,
  removeAllDoors,
  removeEntities,
  spawn,
} from "isaacscript-common";
import { RaceStatus } from "../../enums/RaceStatus";
import g from "../../globals";
import { initSprite } from "../../sprite";
import { consoleCommand } from "../../utils";
import { getRoomsEntered } from "../utils/roomsEntered";
import {
  RACE_ROOM_POSITION,
  RACE_ROOM_STAGE_ARGUMENT,
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

// ModCallback.POST_RENDER (2)
export function postRender(): void {
  if (!inRaceRoom()) {
    return;
  }

  emulateGapingMaws();
  drawSprites();
}

function emulateGapingMaws() {
  // Hold the player in place when in the Race Room (to emulate the Gaping Maws effect).
  // This looks glitchy and jittery if it is done in the PostUpdate callback,
  // so we do it here instead.
  for (const player of getPlayers()) {
    player.Position = RACE_ROOM_POSITION;
  }
}

function drawSprites() {
  const hud = g.g.GetHUD();

  if (!hud.IsVisible()) {
    return;
  }

  // We do not have to check if the game is paused because the pause menu will be drawn on top of
  // the race room sprites.

  for (const [key, sprite] of Object.entries(sprites)) {
    if (sprite !== null) {
      const position = getPosition(key as keyof typeof sprites);
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
      return error(`Race room sprites named "${spriteName}" are unsupported.`);
    }
  }
}

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  gotoRaceRoom();
  setupRaceRoom();
}

function gotoRaceRoom() {
  if (!shouldGotoRaceRoom()) {
    return;
  }

  const effectiveStage = getEffectiveStage();
  const stageType = g.l.GetStageType();

  // If we not already on the right floor, go there.
  if (effectiveStage !== 1 || stageType !== StageType.WRATH_OF_THE_LAMB) {
    // Since we might be going to a new floor on frame 0,
    // we have to specify that the PostNewLevel callback should fire.
    forceNewLevelCallback();
    consoleCommand(`stage ${RACE_ROOM_STAGE_ARGUMENT}`);
  }

  // Since we might be going to a new room on frame 0,
  // we have to specify that the PostNewRoom callback should fire.
  forceNewRoomCallback();
  consoleCommand(`goto d.${RACE_ROOM_VARIANT}`);

  // We will not actually be sent to the room until a frame passes,
  // so wait until the next PostNewRoom fires.
}

function shouldGotoRaceRoom() {
  const roomsEntered = getRoomsEntered();

  return (
    (g.race.status === RaceStatus.OPEN ||
      g.race.status === RaceStatus.STARTING) &&
    // Only bring them to the race room if they are not in the middle of a run.
    // (e.g. the only room that they have entered is the starting room on Basement 1)
    roomsEntered === 1
  );
}

function setupRaceRoom() {
  if (!shouldSetupRaceRoom()) {
    return;
  }

  const npcs = getNPCs();
  removeEntities(npcs);
  g.r.SetClear(true);
  removeAllDoors();

  // Put the player next to the bottom door.
  for (const player of getPlayers()) {
    player.Position = RACE_ROOM_POSITION;
  }

  // Put familiars next to the bottom door, if any.
  for (const familiar of getFamiliars()) {
    familiar.Position = RACE_ROOM_POSITION;
  }

  // Spawn two Gaping Maws.
  for (const gridIndex of [96, 98]) {
    const position = g.r.GetGridPosition(gridIndex);
    const gapingMaw = spawn(EntityType.GAPING_MAW, 0, 0, position);
    gapingMaw.ClearEntityFlags(EntityFlag.APPEAR); // Make them appear instantly
  }

  // Disable the MinimapAPI to emulate what happens with the vanilla map.
  if (MinimapAPI !== undefined) {
    MinimapAPI.Config.Disable = true;
  }
}

function shouldSetupRaceRoom() {
  return (
    (g.race.status === RaceStatus.OPEN ||
      g.race.status === RaceStatus.STARTING) &&
    inRaceRoom()
  );
}

export function inRaceRoom(): boolean {
  const roomStageID = getRoomStageID();
  const roomVariant = getRoomVariant();
  const roomGridIndex = getRoomGridIndex();

  return (
    roomStageID === RACE_ROOM_STAGE_ID &&
    roomVariant === RACE_ROOM_VARIANT &&
    roomGridIndex === GridRoom.DEBUG
  );
}

export function resetSprites(): void {
  for (const key of Object.keys(sprites)) {
    // @ts-expect-error The key will always be valid here.
    sprites[key] = null;
  }
}

export function initSprites(): void {
  if (g.race.status !== RaceStatus.OPEN) {
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
  if (g.race.status === RaceStatus.STARTING) {
    sprites.wait = null;
    sprites.myStatus = null;
    sprites.numReady = null;
    sprites.slash = null;
    sprites.numEntrants = null;
  }
}

export function myStatusChanged(): void {
  if (g.race.status === RaceStatus.OPEN) {
    initMyStatusSprite();
  }
}

export function numReadyChanged(): void {
  if (g.race.status === RaceStatus.OPEN) {
    initNumReadySprite();
  }
}

export function numEntrantsChanged(): void {
  if (g.race.status === RaceStatus.OPEN) {
    initNumEntrantsSprite();
  }
}

export function goingToRaceRoom(): boolean {
  const effectiveStage = getEffectiveStage();
  const roomsEntered = getRoomsEntered();

  return (
    g.race.status === RaceStatus.OPEN &&
    effectiveStage === 1 &&
    (roomsEntered === 0 || roomsEntered === 1)
  );
}
