import {
  CollectibleType,
  Direction,
  EntityType,
  GridEntityType,
  LevelStage,
  ModCallback,
  PressurePlateState,
  PressurePlateVariant,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  game,
  getClosestPlayer,
  getRoomListIndex,
  inMegaSatanRoom,
  onStage,
  openAllDoors,
  spawnGridEntityWithVariant,
  spawnNPC,
} from "isaacscript-common";
import { v } from "../../../features/race/v";
import { g } from "../../../globals";
import { newGlowingCollectibleSprite } from "../../../sprite";
import { Config } from "../../Config";
import { ConfigurableModFeature } from "../../ConfigurableModFeature";
import { setFastTravelFadingToBlack } from "../optional/major/fastTravel/setNewState";

const SPRITE_OFFSET_SHOPKEEPER = Vector(0, -20);
const SPRITE_OFFSET_COLLECTIBLE = Vector(0, -40);

const DPSSprite = Sprite();
DPSSprite.Load("gfx/017.001_Shopkeeper.anm2", true);
DPSSprite.Play("Shopkeeper 1", true);

const victoryLapSprite = newGlowingCollectibleSprite(
  CollectibleType.FORGET_ME_NOW,
);

export class EndOfRaceButtons extends ConfigurableModFeature {
  configKey: keyof Config = "ClientCommunication";

  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    this.drawSprites();
  }

  drawSprites(): void {
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
      const position = Isaac.WorldToScreen(v.level.dpsButton.spritePosition);
      DPSSprite.Render(position);
    }

    if (
      v.level.victoryLapButton !== null &&
      v.level.victoryLapButton.roomListIndex === roomListIndex &&
      !v.level.victoryLapButton.pressed
    ) {
      const position = Isaac.WorldToScreen(
        v.level.victoryLapButton.spritePosition,
      );
      victoryLapSprite.Render(position);
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
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
      // The buttons will cause the door to close, so re-open the door. (The door will stay open
      // since the room is already cleared.)
      openAllDoors();
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_PRESSURE_PLATE_UPDATE)
  postPressurePlateUpdate(gridEntity: GridEntityPressurePlate): void {
    this.checkDPSButtonPressed(gridEntity);
    this.checkVictoryLapButtonPressed(gridEntity);
  }

  checkDPSButtonPressed(gridEntity: GridEntityPressurePlate): void {
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
    this.touchedDPSButton();
  }

  touchedDPSButton(): void {
    const room = game.GetRoom();
    const centerPos = room.GetCenterPos();
    spawnNPC(EntityType.DUMMY, 0, 0, centerPos);
  }

  checkVictoryLapButtonPressed(gridEntity: GridEntityPressurePlate): void {
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
    this.touchedVictoryLapButton(gridEntity, player);
  }

  touchedVictoryLapButton(gridEntity: GridEntity, player: EntityPlayer): void {
    v.run.numVictoryLaps++;

    // Call the fast-travel function directly to emulate the player having touched a heaven door.
    setFastTravelFadingToBlack(player, gridEntity.Position, Direction.UP);
  }
}

export function spawnEndOfRaceButtons(): void {
  if (!onStage(LevelStage.DARK_ROOM_CHEST)) {
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
  const room = game.GetRoom();
  const roomListIndex = getRoomListIndex();

  let gridIndex = 42; // Top right
  if (inMegaSatanRoom()) {
    // The normal position is out of bounds inside of the Mega Satan room.
    gridIndex = 117;
  }

  if (center === true) {
    const centerPos = room.GetCenterPos();
    gridIndex = room.GetGridIndex(centerPos);
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
