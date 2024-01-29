import { EntityFlag, EntityType, GridRoom } from "isaac-typescript-definitions";
import {
  asNumber,
  game,
  getFamiliars,
  getNPCs,
  getPlayers,
  getRoomGridIndex,
  getRoomStageID,
  getRoomVariant,
  getScreenCenterPos,
  newSprite,
  onStage,
  onStageType,
  removeAllDoors,
  removeEntities,
  spawnNPC,
} from "isaacscript-common";
import { RaceStatus } from "../../enums/RaceStatus";
import { g } from "../../globals";
import { mod } from "../../mod";
import { consoleCommand } from "../../utils";
import {
  RACE_ROOM_LEVEL as RACE_ROOM_LEVEL_STAGE,
  RACE_ROOM_POSITION,
  RACE_ROOM_STAGE_ARGUMENT,
  RACE_ROOM_STAGE_ID,
  RACE_ROOM_STAGE_TYPE,
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
  // Hold the player in place when in the Race Room (to emulate the Gaping Maws effect). This looks
  // glitchy and jittery if it is done in the `POST_UPDATE` callback, so we do it here instead.
  for (const player of getPlayers()) {
    player.Position = RACE_ROOM_POSITION;
  }
}

function drawSprites() {
  const hud = game.GetHUD();

  if (!hud.IsVisible()) {
    return;
  }

  // We do not have to check if the game is paused because the pause menu will be drawn on top of
  // the race room sprites.

  for (const [key, sprite] of Object.entries(sprites)) {
    if (sprite !== null) {
      const position = getPosition(key as keyof typeof sprites);
      sprite.Render(position);
    }
  }
}

function getPosition(spriteName: keyof typeof sprites): Readonly<Vector> {
  const screenCenterPos = getScreenCenterPos();

  switch (spriteName) {
    case "wait": {
      return screenCenterPos.add(Vector(0, -80));
    }

    case "myStatus": {
      return screenCenterPos.add(Vector(0, -40));
    }

    case "numReady": {
      return screenCenterPos.add(Vector(-20, -15));
    }

    case "slash": {
      return screenCenterPos.add(Vector(0, -15));
    }

    case "numEntrants": {
      return screenCenterPos.add(Vector(20, -15));
    }

    case "ranked": {
      return screenCenterPos.add(Vector(X_SPACING * -1, Y_SPACING));
    }

    case "rankedIcon": {
      return screenCenterPos.add(Vector(X_SPACING * -1, Y_SPACING + 23));
    }

    case "format": {
      return screenCenterPos.add(Vector(X_SPACING, Y_SPACING));
    }

    case "formatIcon": {
      return screenCenterPos.add(Vector(X_SPACING, Y_SPACING + 23));
    }

    case "goal": {
      return screenCenterPos.add(Vector(-25, 95));
    }

    case "goalIcon": {
      return screenCenterPos.add(Vector(25, 95));
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

  // If we not already on the right floor, go there.
  if (!onStage(RACE_ROOM_LEVEL_STAGE) || !onStageType(RACE_ROOM_STAGE_TYPE)) {
    // Since we might be going to a new floor on frame 0, we have to specify that the
    // `POST_NEW_LEVEL` callback should fire.
    mod.forceNewLevelCallback();
    consoleCommand(`stage ${RACE_ROOM_STAGE_ARGUMENT}`);
  }

  // Since we might be going to a new room on frame 0, we have to specify that the `POST_NEW_ROOM`
  // callback should fire.
  mod.forceNewRoomCallback();
  consoleCommand(`goto d.${RACE_ROOM_VARIANT}`);

  // We will not actually be sent to the room until a frame passes, so wait until the next
  // `POST_NEW_ROOM` fires.
}

function shouldGotoRaceRoom() {
  return (
    (g.race.status === RaceStatus.OPEN ||
      g.race.status === RaceStatus.STARTING) &&
    // Only bring them to the race room if they are not in the middle of a run.
    // (e.g. the only room that they have entered is the starting room on Basement 1)
    mod.inFirstRoom()
  );
}

function setupRaceRoom() {
  if (!shouldSetupRaceRoom()) {
    return;
  }

  const room = game.GetRoom();

  const npcs = getNPCs();
  removeEntities(npcs);
  room.SetClear(true);
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
    const position = room.GetGridPosition(gridIndex);
    const gapingMaw = spawnNPC(EntityType.GAPING_MAW, 0, 0, position);
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
    roomGridIndex === asNumber(GridRoom.DEBUG)
  );
}

export function resetSprites(): void {
  for (const keyString of Object.keys(sprites)) {
    const key = keyString as keyof typeof sprites;
    sprites[key] = null;
  }
}

export function initSprites(): void {
  if (g.race.status !== RaceStatus.OPEN) {
    return;
  }

  // Top half
  sprites.wait = newSprite(`${GFX_PATH}/wait.anm2`);
  initMyStatusSprite();
  initNumReadySprite();
  sprites.slash = newSprite(`${GFX_PATH}/slash.anm2`);
  initNumEntrantsSprite();

  // Bottom half
  const isRanked = g.race.ranked || !g.race.solo;
  const ranked = isRanked ? "ranked" : "unranked";
  sprites.ranked = newSprite(`${GFX_PATH}/ranked/${ranked}.anm2`);
  sprites.rankedIcon = newSprite(`${GFX_PATH}/ranked/${ranked}-icon.anm2`);
  sprites.format = newSprite(`${GFX_PATH}/formats/${g.race.format}.anm2`);
  sprites.formatIcon = newSprite(
    `${GFX_PATH}/formats/${g.race.format}-icon.anm2`,
  );
  sprites.goal = newSprite(`${GFX_PATH}/goal.anm2`);
  sprites.goalIcon = newSprite(`${GFX_PATH}/goals/${g.race.goal}.anm2`);
}

function initMyStatusSprite() {
  sprites.myStatus = newSprite(`${GFX_PATH}/my-status/${g.race.myStatus}.anm2`);
}

function initNumReadySprite() {
  sprites.numReady = initNumSprite(g.race.numReady);
}

function initNumEntrantsSprite() {
  sprites.numEntrants = initNumSprite(g.race.numEntrants);
}

function initNumSprite(num: int) {
  const anm2Name = num > 50 ? "unknown" : num.toString();
  return newSprite(`${GFX_PATH}/ready/${anm2Name}.anm2`);
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
