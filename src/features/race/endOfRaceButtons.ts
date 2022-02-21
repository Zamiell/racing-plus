import {
  getClosestPlayer,
  getRoomListIndex,
  getRoomSafeGridIndex,
  openAllDoors,
  spawnGridEntityWithVariant,
} from "isaacscript-common";
import g from "../../globals";
import { initGlowingItemSprite } from "../../sprite";
import { setFadingToBlack } from "../optional/major/fastTravel/setNewState";
import { isSlideAnimationActive } from "../util/detectSlideAnimation";
import v from "./v";

const SPRITE_OFFSET_SHOPKEEPER = Vector(0, -20);
const SPRITE_OFFSET_COLLECTIBLE = Vector(0, -40);

const DPSSprite = Sprite();
DPSSprite.Load("gfx/017.001_Shopkeeper.anm2", true);
DPSSprite.Play("Shopkeeper 1", true);

const victoryLapSprite = initGlowingItemSprite(
  CollectibleType.COLLECTIBLE_FORGET_ME_NOW,
);

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  if (isSlideAnimationActive()) {
    return;
  }

  if (ModConfigMenu !== undefined && ModConfigMenu.IsVisible) {
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
      Vector.Zero,
      Vector.Zero,
    );
  }

  if (
    v.level.victoryLapButton !== null &&
    v.level.victoryLapButton.roomListIndex === roomListIndex &&
    !v.level.victoryLapButton.pressed
  ) {
    victoryLapSprite.Render(
      g.r.WorldToScreenPosition(v.level.victoryLapButton.spritePosition),
      Vector.Zero,
      Vector.Zero,
    );
  }
}

export function spawnEndOfRaceButtons(): void {
  const stage = g.l.GetStage();

  if (stage !== 11) {
    return;
  }

  spawnDPSButton();
  spawnVictoryLapButton();
}

function spawnDPSButton() {
  const roomListIndex = getRoomListIndex();
  const roomSafeGridIndex = getRoomSafeGridIndex();

  let gridIndex = 32; // Top-left
  if (roomSafeGridIndex === GridRooms.ROOM_MEGA_SATAN_IDX) {
    // The normal position is out of bounds inside of the Mega Satan room
    gridIndex = 107;
  }

  const button = spawnGridEntityWithVariant(
    GridEntityType.GRID_PRESSURE_PLATE,
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
  const roomSafeGridIndex = getRoomSafeGridIndex();

  let gridIndex = 42; // Top right
  if (roomSafeGridIndex === GridRooms.ROOM_MEGA_SATAN_IDX) {
    // The normal position is out of bounds inside of the Mega Satan room
    gridIndex = 117;
  }

  if (center === true) {
    const centerPos = g.r.GetCenterPos();
    gridIndex = g.r.GetGridIndex(centerPos);
  }

  const button = spawnGridEntityWithVariant(
    GridEntityType.GRID_PRESSURE_PLATE,
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

// ModCallbacks.MC_POST_NEW_ROOM (19)
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
    // The buttons will cause the door to close, so re-open the door
    // (the door will stay open since the room is already cleared)
    openAllDoors();
  }
}

// ModCallbacksCustom.MC_POST_GRID_ENTITY_UPDATE
// GridEntityType.GRID_PRESSURE_PLATE (20)
export function postGridEntityUpdatePressurePlate(
  gridEntity: GridEntity,
): void {
  checkDPSButtonPressed(gridEntity);
  checkVictoryLapButtonPressed(gridEntity);
}

function checkDPSButtonPressed(gridEntity: GridEntity) {
  if (v.level.dpsButton === null || v.level.dpsButton.pressed) {
    return;
  }

  const roomListIndex = getRoomListIndex();
  const gridIndex = gridEntity.GetGridIndex();
  const gridDescription = gridEntity.GetSaveState();

  if (
    roomListIndex !== v.level.dpsButton.roomListIndex ||
    gridIndex !== v.level.dpsButton.gridIndex ||
    gridDescription.State !== PressurePlateState.PRESSURE_PLATE_PRESSED
  ) {
    return;
  }

  v.level.dpsButton.pressed = true;
  touchedDPSButton();
}

function touchedDPSButton() {
  Isaac.Spawn(
    EntityType.ENTITY_DUMMY,
    0,
    0,
    g.r.GetCenterPos(),
    Vector.Zero,
    undefined,
  );
}

function checkVictoryLapButtonPressed(gridEntity: GridEntity) {
  if (v.level.victoryLapButton === null || v.level.victoryLapButton.pressed) {
    return;
  }

  const roomListIndex = getRoomListIndex();
  const gridIndex = gridEntity.GetGridIndex();
  const gridDescription = gridEntity.GetSaveState();

  if (
    roomListIndex !== v.level.victoryLapButton.roomListIndex ||
    gridIndex !== v.level.victoryLapButton.gridIndex ||
    gridDescription.State !== PressurePlateState.PRESSURE_PLATE_PRESSED
  ) {
    return;
  }

  v.level.victoryLapButton.pressed = true;
  const player = getClosestPlayer(gridEntity.Position);
  touchedVictoryLapButton(gridEntity, player);
}

function touchedVictoryLapButton(gridEntity: GridEntity, player: EntityPlayer) {
  v.run.numVictoryLaps += 1;

  // Call the fast-travel function directly to emulate the player having touched a heaven door
  setFadingToBlack(player, gridEntity.Position, true);
}
