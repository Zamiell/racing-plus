import {
  CollectibleType,
  GridEntityType,
  PressurePlateVariant,
} from "isaac-typescript-definitions";
import {
  forceNewRoomCallback,
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
import g from "../../../globals";
import { consoleCommand } from "../../../utils";
import { getNumRoomsEntered } from "../../utils/numRoomsEntered";
import {
  CHANGE_CHAR_ORDER_POSITIONS,
  CHANGE_CHAR_ORDER_ROOM_STAGE_ARGUMENT,
  CHANGE_CHAR_ORDER_ROOM_VARIANT,
} from "../constants";
import v from "../v";

export function charCharOrderPostNewRoom(): void {
  const challenge = Isaac.GetChallenge();
  if (challenge !== ChallengeCustom.CHANGE_CHAR_ORDER) {
    return;
  }

  const numRoomsEntered = getNumRoomsEntered();

  if (numRoomsEntered === 1) {
    gotoButtonRoom();
  } else if (numRoomsEntered === 3) {
    setupButtonRoom();
  }
}

function gotoButtonRoom() {
  forceNewRoomCallback();
  consoleCommand(`stage ${CHANGE_CHAR_ORDER_ROOM_STAGE_ARGUMENT}`);
  forceNewRoomCallback();
  consoleCommand(`goto d.${CHANGE_CHAR_ORDER_ROOM_VARIANT}`);
  // We do more things in the next PostNewRoom callback.
}

function setupButtonRoom() {
  const player = Isaac.GetPlayer();
  const hud = game.GetHUD();

  hud.SetVisible(false);

  const npcs = getNPCs();
  removeEntities(npcs);
  g.r.SetClear(true);
  removeAllDoors();

  const nextToBottomDoor = g.r.GetGridPosition(97);
  player.Position = nextToBottomDoor;
  player.RemoveCollectible(CollectibleType.D6);
  player.AddBombs(-1);

  // Give Isaac's some speed.
  repeat(2, () => {
    player.AddCollectible(CollectibleType.BELT, 0, false);
    removeCollectibleFromItemTracker(CollectibleType.BELT);
  });
  const itemConfigItem = itemConfig.GetCollectible(CollectibleType.BELT);
  if (itemConfigItem !== undefined) {
    player.RemoveCostume(itemConfigItem);
  }

  // Spawn buttons for each type of speedrun (and a graphic over each button).
  for (const [seasonAbbreviation, seasonDescription] of Object.entries(
    CHANGE_CHAR_ORDER_POSITIONS,
  )) {
    if (seasonDescription.hidden !== undefined) {
      continue;
    }

    const position = gridCoordinatesToWorldPosition(
      seasonDescription.X,
      seasonDescription.Y,
    );
    const gridIndex = g.r.GetGridIndex(position);
    spawnGridEntityWithVariant(
      GridEntityType.PRESSURE_PLATE,
      PressurePlateVariant.PRESSURE_PLATE,
      gridIndex,
    );

    const seasonSprite = Sprite();
    seasonSprite.Load(
      `gfx/changeCharOrder/buttons/${seasonAbbreviation}.anm2`,
      true,
    );
    seasonSprite.SetFrame("Default", 0);
    v.room.sprites.seasons.set(seasonAbbreviation, seasonSprite);
  }
}
