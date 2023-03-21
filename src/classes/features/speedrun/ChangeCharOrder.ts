import {
  CollectibleType,
  GridEntityType,
  ModCallback,
  PressurePlateVariant,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  KColorDefault,
  ModCallbackCustom,
  VectorZero,
  fonts,
  game,
  getNPCs,
  gridCoordinatesToWorldPosition,
  itemConfig,
  removeAllDoors,
  removeCollectibleFromItemTracker,
  removeEntities,
  repeat,
  spawnGridEntityWithVariant,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../enums/ChallengeCustom";
import { ChangeCharOrderPhase } from "../../../enums/ChangeCharOrderPhase";
import { mod } from "../../../mod";
import { consoleCommand } from "../../../utils";
import { ChallengeModFeature } from "../../ChallengeModFeature";
import {
  changeCharOrderButtonsPostPressurePlateUpdate,
  changeCharOrderButtonsPostUpdate,
} from "./changeCharOrder/buttons";
import {
  CHANGE_CHAR_ORDER_POSITIONS_MAP,
  CHANGE_CHAR_ORDER_ROOM_STAGE_ARGUMENT,
  CHANGE_CHAR_ORDER_ROOM_VARIANT,
} from "./changeCharOrder/constants";
import { getSeasonDescription, v } from "./changeCharOrder/v";

const CHANGE_CHAR_ORDER_PHASE_TEXT = {
  [ChangeCharOrderPhase.SEASON_SELECT]: "Choose your season",
  [ChangeCharOrderPhase.CHARACTER_SELECT]: "Choose your character order",
  [ChangeCharOrderPhase.BUILD_VETO]: "Choose your build vetos",
} as const satisfies Record<ChangeCharOrderPhase, string>;

/**
 * Handles everything related to the "Change Char Order" custom challenge.
 *
 * Button logic is handled in "buttons.ts".
 */
export class ChangeCharOrder extends ChallengeModFeature {
  challenge = ChallengeCustom.CHANGE_CHAR_ORDER;
  v = v;

  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    changeCharOrderButtonsPostUpdate();
  }

  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    this.disableControls();
    this.checkReset();
    this.draw();
  }

  /**
   * Disable the controls to prevent the player from moving around while the screen is still black.
   */
  disableControls(): void {
    const gameFrameCount = game.GetFrameCount();
    const player = Isaac.GetPlayer();

    player.ControlsEnabled = gameFrameCount >= 1;
  }

  checkReset(): void {
    const renderFrameCount = Isaac.GetFrameCount();

    if (
      v.room.resetRenderFrame !== null &&
      renderFrameCount >= v.room.resetRenderFrame
    ) {
      v.room.resetRenderFrame = null;
      consoleCommand(`challenge ${v.room.challengeTarget}`);
    }
  }

  draw(): void {
    // We can't use the `HUD.IsVisible` method because we explicitly disable the HUD in this
    // challenge. Thus, we explicitly check for Mod Config Menu.
    if (ModConfigMenu !== undefined && ModConfigMenu.IsVisible) {
      return;
    }

    this.drawCurrentChoosingActivity();
    this.drawSeasonSprites();
    this.drawCharacterSprites();
    this.drawBuildVetoSprites();
  }

  drawCurrentChoosingActivity(): void {
    const room = game.GetRoom();
    const bottomCenterOfRoom = room.GetGridPosition(112);
    const position = Isaac.WorldToScreen(bottomCenterOfRoom);
    position.Y -= 15;
    const text = CHANGE_CHAR_ORDER_PHASE_TEXT[v.room.phase];
    const font = fonts.droid;
    const length = font.GetStringWidthUTF8(text);
    font.DrawString(text, position.X - length / 2, position.Y, KColorDefault);
  }

  drawSeasonSprites(): void {
    if (v.room.phase !== ChangeCharOrderPhase.SEASON_SELECT) {
      return;
    }

    for (const [challengeCustomAbbreviation, seasonSprite] of v.room.sprites
      .seasons) {
      const position = CHANGE_CHAR_ORDER_POSITIONS_MAP.get(
        challengeCustomAbbreviation,
      );
      if (position === undefined) {
        error(
          `Failed to find the positions for season: ${challengeCustomAbbreviation}`,
        );
      }
      const posButton = gridCoordinatesToWorldPosition(
        position.X,
        position.Y - 1,
      );
      const posRender = Isaac.WorldToScreen(posButton);
      seasonSprite.Render(posRender);
    }
  }

  drawCharacterSprites(): void {
    if (v.room.phase !== ChangeCharOrderPhase.CHARACTER_SELECT) {
      return;
    }

    const seasonDescription = getSeasonDescription();

    v.room.sprites.characters.forEach((characterSprite, i) => {
      const charPosition = seasonDescription.charPositions[i];
      if (charPosition === undefined) {
        error(`Failed to find the positions for character: ${i}`);
      }
      const { x, y } = charPosition;
      const oneTileAboveButton = gridCoordinatesToWorldPosition(x, y - 1);
      const renderPosition = Isaac.WorldToScreen(oneTileAboveButton);
      renderPosition.Y += 10; // Nudge it a bit upwards to make it look better.
      characterSprite.Render(renderPosition, VectorZero, VectorZero);
    });
  }

  drawBuildVetoSprites(): void {
    if (v.room.phase !== ChangeCharOrderPhase.BUILD_VETO) {
      return;
    }

    const seasonDescription = getSeasonDescription();

    v.room.sprites.characters.forEach((characterSprite, i) => {
      if (seasonDescription.buildPositions === undefined) {
        error("buildPositions was undefined.");
      }

      const buildPosition = seasonDescription.buildPositions[i];
      if (buildPosition === undefined) {
        error(`Failed to find the positions for build: ${i}`);
      }
      const { x, y } = buildPosition;
      const oneTileAboveButton = gridCoordinatesToWorldPosition(x, y - 1);
      const renderPosition = Isaac.WorldToScreen(oneTileAboveButton);
      characterSprite.Render(renderPosition, VectorZero, VectorZero);
    });
  }

  @CallbackCustom(ModCallbackCustom.POST_PRESSURE_PLATE_UPDATE)
  postPressurePlateUpdate(pressurePlate: GridEntityPressurePlate): void {
    changeCharOrderButtonsPostPressurePlateUpdate(pressurePlate);
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const numRoomsEntered = mod.getNumRoomsEntered();

    if (numRoomsEntered === 1) {
      this.gotoButtonRoom();
    } else if (numRoomsEntered === 3) {
      this.setupButtonRoom();
    }
  }

  gotoButtonRoom(): void {
    mod.forceNewRoomCallback();
    consoleCommand(`stage ${CHANGE_CHAR_ORDER_ROOM_STAGE_ARGUMENT}`);
    mod.forceNewRoomCallback();
    consoleCommand(`goto d.${CHANGE_CHAR_ORDER_ROOM_VARIANT}`);
    // We do more things in the next `POST_NEW_ROOM` callback.
  }

  setupButtonRoom(): void {
    const room = game.GetRoom();
    const hud = game.GetHUD();
    const player = Isaac.GetPlayer();

    hud.SetVisible(false);

    const npcs = getNPCs();
    removeEntities(npcs);
    room.SetClear(true);
    removeAllDoors();

    const nextToBottomDoor = room.GetGridPosition(97);
    player.Position = nextToBottomDoor;
    player.RemoveCollectible(CollectibleType.D6);
    player.AddBombs(-1);

    // Give Isaac's some speed.
    const speedCollectible = CollectibleType.BELT;
    repeat(2, () => {
      player.AddCollectible(speedCollectible, 0, false);
      removeCollectibleFromItemTracker(speedCollectible);
    });
    const itemConfigItem = itemConfig.GetCollectible(speedCollectible);
    if (itemConfigItem !== undefined) {
      player.RemoveCostume(itemConfigItem);
    }

    // Spawn buttons for each type of speedrun (and a graphic over each button).
    for (const [
      challengeCustomAbbreviation,
      seasonDescription,
    ] of CHANGE_CHAR_ORDER_POSITIONS_MAP) {
      if (seasonDescription.hidden !== undefined) {
        continue;
      }

      const position = gridCoordinatesToWorldPosition(
        seasonDescription.X,
        seasonDescription.Y,
      );
      const gridIndex = room.GetGridIndex(position);
      spawnGridEntityWithVariant(
        GridEntityType.PRESSURE_PLATE,
        PressurePlateVariant.PRESSURE_PLATE,
        gridIndex,
      );

      const seasonSprite = Sprite();
      seasonSprite.Load(
        `gfx/change-char-order/buttons/${challengeCustomAbbreviation}.anm2`,
        true,
      );
      seasonSprite.SetFrame("Default", 0);
      v.room.sprites.seasons.set(challengeCustomAbbreviation, seasonSprite);
    }
  }
}
