import {
  CollectibleType,
  EntityType,
  GridEntityType,
  LevelStage,
  PressurePlateState,
  PressurePlateVariant,
} from "isaac-typescript-definitions";
import {
  game,
  getClosestPlayer,
  getRoomListIndex,
  inMegaSatanRoom,
  openAllDoors,
  spawnGridEntityWithVariant,
  spawnNPC,
  VectorZero,
} from "isaacscript-common";
import { g } from "../../globals";
import { initGlowingCollectibleSprite } from "../../sprite";
import { setFadingToBlack } from "../optional/major/fastTravel/setNewState";
import v from "./v";

const SPRITE_OFFSET_SHOPKEEPER = Vector(0, -20);
const SPRITE_OFFSET_COLLECTIBLE = Vector(0, -40);

const DPSSprite = Sprite();
DPSSprite.Load("gfx/017.001_Shopkeeper.anm2", true);
DPSSprite.Play("Shopkeeper 1", true);

const victoryLapSprite = initGlowingCollectibleSprite(
  CollectibleType.FORGET_ME_NOW,
);

// ModCallback.POST_RENDER (2)
export function postRender(): void {
  drawSprites();
}

function drawSprites() {
  const isPaused = game.IsPaused();
  const hud = game.GetHUD();

  if (!hud.IsVisible()) {
    return;
  }

  // We don't care if the sprites show when the game is paused, but we do not want the sprites to
  // show during room slide animations.
  if (isPaused) {
    return;
  }

  const roomListIndex = getRoomListIndex();

  if (
    v.level.dpsButton !== null &&
    v.level.dpsButton.roomListIndex === roomListIndex &&
    !v.level.dpsButton.pressed
  ) {
    DPSSprite.Render(
      g.r.WorldToScreenPosition(v.level.dpsButton.spritePosition),
      VectorZero,
      VectorZero,
    );
  }

  if (
    v.level.victoryLapButton !== null &&
    v.level.victoryLapButton.roomListIndex === roomListIndex &&
    !v.level.victoryLapButton.pressed
  ) {
    victoryLapSprite.Render(
      g.r.WorldToScreenPosition(v.level.victoryLapButton.spritePosition),
      VectorZero,
      VectorZero,
    );
  }
}

export function spawnEndOfRaceButtons(): void {
  const stage = g.l.GetStage();

  if (stage !== LevelStage.DARK_ROOM_CHEST) {
    return;
  }

  spawnDPSButton();
  spawnVictoryLapButton();
}

function spawnDPSButton() {
  const roomListIndex = getRoomListIndex();

  let gridIndex = 32; // Top-left
  if (inMegaSatanRoom()) {
    // The normal position is out of bounds inside of the Mega Satan room.
    gridIndex = 107;
  }

  const button = spawnGridEntityWithVariant(
    GridEntityType.PRESSURE_PLATE,
    PressurePlateVariant.PRESSURE_PLATE,
    gridIndex,
  );
  if (button === undefined) {
    error("Failed to spawn the DPS button.");
  }
  const spritePosition = button.Position.add(SPRITE_OFFSET_SHOPKEEPER);

  v.level.dpsButton = {
    roomListIndex,
    gridIndex,
    spritePosition,
    pressed: false,
  };
}

export function spawnVictoryLapButton(center?: boolean): void {
  const roomListIndex = getRoomListIndex();

  let gridIndex = 42; // Top right
  if (inMegaSatanRoom()) {
    // The normal position is out of bounds inside of the Mega Satan room.
    gridIndex = 117;
  }

  if (center === true) {
    const centerPos = g.r.GetCenterPos();
    gridIndex = g.r.GetGridIndex(centerPos);
  }

  const button = spawnGridEntityWithVariant(
    GridEntityType.PRESSURE_PLATE,
    PressurePlateVariant.PRESSURE_PLATE,
    gridIndex,
  );
  if (button === undefined) {
    error("Failed to spawn the Victory Lap button.");
  }
  const spritePosition = button.Position.add(SPRITE_OFFSET_COLLECTIBLE);

  v.level.victoryLapButton = {
    roomListIndex,
    gridIndex,
    spritePosition,
    pressed: false,
  };
}

// ModCallback.POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (!g.raceVars.finished) {
    return;
  }

  const roomListIndex = getRoomListIndex();

  if (
    (v.level.dpsButton !== null &&
      v.level.dpsButton.roomListIndex === roomListIndex) ||
    (v.level.victoryLapButton !== null &&
      v.level.victoryLapButton.roomListIndex === roomListIndex)
  ) {
    // The buttons will cause the door to close, so re-open the door. (The door will stay open since
    // the room is already cleared.)
    openAllDoors();
  }
}

// ModCallbackCustom.POST_PRESSURE_PLATE_UPDATE
export function postPressurePlateUpdate(
  gridEntity: GridEntityPressurePlate,
): void {
  checkDPSButtonPressed(gridEntity);
  checkVictoryLapButtonPressed(gridEntity);
}

function checkDPSButtonPressed(gridEntity: GridEntityPressurePlate) {
  if (v.level.dpsButton === null || v.level.dpsButton.pressed) {
    return;
  }

  const roomListIndex = getRoomListIndex();
  const gridIndex = gridEntity.GetGridIndex();

  if (
    roomListIndex !== v.level.dpsButton.roomListIndex ||
    gridIndex !== v.level.dpsButton.gridIndex ||
    gridEntity.State !== PressurePlateState.PRESSURE_PLATE_PRESSED
  ) {
    return;
  }

  v.level.dpsButton.pressed = true;
  touchedDPSButton();
}

function touchedDPSButton() {
  const centerPos = g.r.GetCenterPos();
  spawnNPC(EntityType.DUMMY, 0, 0, centerPos);
}

function checkVictoryLapButtonPressed(gridEntity: GridEntityPressurePlate) {
  if (v.level.victoryLapButton === null || v.level.victoryLapButton.pressed) {
    return;
  }

  const roomListIndex = getRoomListIndex();
  const gridIndex = gridEntity.GetGridIndex();

  if (
    roomListIndex !== v.level.victoryLapButton.roomListIndex ||
    gridIndex !== v.level.victoryLapButton.gridIndex ||
    gridEntity.State !== PressurePlateState.PRESSURE_PLATE_PRESSED
  ) {
    return;
  }

  v.level.victoryLapButton.pressed = true;
  const player = getClosestPlayer(gridEntity.Position);
  touchedVictoryLapButton(gridEntity, player);
}

function touchedVictoryLapButton(gridEntity: GridEntity, player: EntityPlayer) {
  v.run.numVictoryLaps++;

  // Call the fast-travel function directly to emulate the player having touched a heaven door.
  setFadingToBlack(player, gridEntity.Position, true);
}
