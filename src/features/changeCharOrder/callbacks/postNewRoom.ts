import {
  forceNewRoomCallback,
  getNPCs,
  gridCoordinatesToWorldPosition,
  itemConfig,
  removeAllDoors,
  removeCollectibleFromItemTracker,
  removeEntities,
  spawnGridWithVariant,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../enums/ChallengeCustom";
import g from "../../../globals";
import { consoleCommand } from "../../../utils";
import { getRoomsEntered } from "../../utils/roomsEntered";
import { CHANGE_CHAR_ORDER_POSITIONS } from "../constants";
import v from "../v";

export function charCharOrderPostNewRoom(): void {
  const challenge = Isaac.GetChallenge();
  if (challenge !== ChallengeCustom.CHANGE_CHAR_ORDER) {
    return;
  }

  const roomsEntered = getRoomsEntered();

  if (roomsEntered === 1) {
    gotoButtonRoom();
  } else if (roomsEntered === 3) {
    setupButtonRoom();
  }
}

function gotoButtonRoom() {
  forceNewRoomCallback();
  consoleCommand("stage 1a"); // The Cellar is the cleanest floor
  forceNewRoomCallback();
  consoleCommand("goto d.5"); // We do more things in the next PostNewRoom callback
}

function setupButtonRoom() {
  const player = Isaac.GetPlayer();
  const hud = g.g.GetHUD();

  hud.SetVisible(false);

  const npcs = getNPCs();
  removeEntities(npcs);
  g.r.SetClear(true);
  removeAllDoors();

  const nextToBottomDoor = g.r.GetGridPosition(97);
  player.Position = nextToBottomDoor;
  player.RemoveCollectible(CollectibleType.COLLECTIBLE_D6);
  player.AddBombs(-1);

  // Give Isaac's some speed
  player.AddCollectible(CollectibleType.COLLECTIBLE_BELT, 0, false);
  removeCollectibleFromItemTracker(CollectibleType.COLLECTIBLE_BELT);
  player.AddCollectible(CollectibleType.COLLECTIBLE_BELT, 0, false);
  removeCollectibleFromItemTracker(CollectibleType.COLLECTIBLE_BELT);
  const itemConfigItem = itemConfig.GetCollectible(
    CollectibleType.COLLECTIBLE_BELT,
  );
  if (itemConfigItem !== undefined) {
    player.RemoveCostume(itemConfigItem);
  }

  // Spawn buttons for each type of speedrun
  // (and a graphic over each button)
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
    spawnGridWithVariant(
      GridEntityType.GRID_PRESSURE_PLATE,
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
