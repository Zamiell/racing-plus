import {
  getClosestPlayer,
  getRoomIndex,
  gridToPos,
  openAllDoors,
} from "isaacscript-common";
import g from "../../globals";
import { initGlowingItemSprite } from "../../util";
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

  const roomIndex = getRoomIndex();

  if (
    v.level.dpsButton !== null &&
    v.level.dpsButton.roomIndex === roomIndex &&
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
    v.level.victoryLapButton.roomIndex === roomIndex &&
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
  const roomIndex = getRoomIndex();

  let position = gridToPos(1, 1);
  if (roomIndex === GridRooms.ROOM_MEGA_SATAN_IDX) {
    position = gridToPos(1, 6); // A Y of 1 is out of bounds inside of the Mega Satan room
  }

  Isaac.GridSpawn(GridEntityType.GRID_PRESSURE_PLATE, 0, position, true);

  const gridIndex = g.r.GetGridIndex(position);

  v.level.dpsButton = {
    roomIndex,
    gridIndex,
    spritePosition: position.add(SPRITE_OFFSET_SHOPKEEPER),
    pressed: false,
  };
}

export function spawnVictoryLapButton(center?: boolean): void {
  const roomIndex = getRoomIndex();

  let position = gridToPos(11, 1);
  if (roomIndex === GridRooms.ROOM_MEGA_SATAN_IDX) {
    position = gridToPos(11, 6); // A Y of 1 is out of bounds inside of the Mega Satan room
  }

  if (center === true) {
    position = g.r.GetCenterPos();
  }

  Isaac.GridSpawn(GridEntityType.GRID_PRESSURE_PLATE, 0, position, true);

  const gridIndex = g.r.GetGridIndex(position);

  v.level.victoryLapButton = {
    roomIndex,
    gridIndex,
    spritePosition: position.add(SPRITE_OFFSET_COLLECTIBLE),
    pressed: false,
  };
}

// ModCallbacks.MC_POST_NEW_ROOM (19)
export function postNewRoom(): void {
  if (!g.raceVars.finished) {
    return;
  }

  const roomIndex = getRoomIndex();

  if (
    (v.level.dpsButton !== null && v.level.dpsButton.roomIndex === roomIndex) ||
    (v.level.victoryLapButton !== null &&
      v.level.victoryLapButton.roomIndex === roomIndex)
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

  const roomIndex = getRoomIndex();
  const gridIndex = gridEntity.GetGridIndex();
  const gridDescription = gridEntity.GetSaveState();

  if (
    roomIndex !== v.level.dpsButton.roomIndex ||
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

  const roomIndex = getRoomIndex();
  const gridIndex = gridEntity.GetGridIndex();
  const gridDescription = gridEntity.GetSaveState();

  if (
    roomIndex !== v.level.victoryLapButton.roomIndex ||
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
