import {
  forceNewRoomCallback,
  getNPCs,
  gridToPos,
  removeCollectibleFromItemTracker,
  removeEntities,
  spawnGridEntityWithVariant,
} from "isaacscript-common";
import g from "../../../globals";
import { consoleCommand } from "../../../util";
import { ChallengeCustom } from "../../speedrun/enums";
import { getRoomsEntered } from "../../util/roomsEntered";
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

  const npcs = getNPCs();
  removeEntities(npcs);
  g.r.SetClear(true);

  for (let i = 0; i < 4; i++) {
    g.r.RemoveDoor(i);
  }

  const nextToBottomDoor = g.r.GetGridPosition(97);
  player.Position = nextToBottomDoor;
  player.RemoveCollectible(CollectibleType.COLLECTIBLE_D6);
  player.AddBombs(-1);

  // Give Isaac's some speed
  player.AddCollectible(CollectibleType.COLLECTIBLE_BELT, 0, false);
  removeCollectibleFromItemTracker(CollectibleType.COLLECTIBLE_BELT);
  player.AddCollectible(CollectibleType.COLLECTIBLE_BELT, 0, false);
  removeCollectibleFromItemTracker(CollectibleType.COLLECTIBLE_BELT);
  const itemConfigItem = g.itemConfig.GetCollectible(
    CollectibleType.COLLECTIBLE_BELT,
  );
  if (itemConfigItem !== undefined) {
    player.RemoveCostume(itemConfigItem);
  }

  // Get rid of the HUD
  g.seeds.AddSeedEffect(SeedEffect.SEED_NO_HUD);

  // Spawn buttons for each type of speedrun
  // (and a graphic over each button)
  for (const [key, seasonDescription] of Object.entries(
    CHANGE_CHAR_ORDER_POSITIONS,
  )) {
    if (seasonDescription.hidden !== undefined) {
      // This is a beta season that should not be shown quite yet
      continue;
    }

    const position = gridToPos(seasonDescription.X, seasonDescription.Y);
    const gridIndex = g.r.GetGridIndex(position);
    spawnGridEntityWithVariant(
      GridEntityType.GRID_PRESSURE_PLATE,
      PressurePlateVariant.PRESSURE_PLATE,
      gridIndex,
    );

    const seasonSprite = Sprite();
    seasonSprite.Load(`gfx/changeCharOrder/buttons/${key}.anm2`, true);
    seasonSprite.SetFrame("Default", 0);
    v.room.sprites.seasons.set(key, seasonSprite);
  }
}
