import {
  forceNewRoomCallback,
  getRoomNPCs,
  gridToPos,
} from "isaacscript-common";
import g from "../../../globals";
import { consoleCommand, removeItemFromItemTracker } from "../../../util";
import { ChallengeCustom } from "../../speedrun/enums";
import { CHANGE_CHAR_ORDER_POSITIONS } from "../constants";
import v from "../v";

export default function charCharOrderPostNewRoom(): void {
  const challenge = Isaac.GetChallenge();
  if (challenge !== ChallengeCustom.CHANGE_CHAR_ORDER) {
    return;
  }

  if (g.run.roomsEntered === 1) {
    gotoButtonRoom();
  } else if (g.run.roomsEntered === 3) {
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

  // Remove all enemies
  for (const npc of getRoomNPCs()) {
    npc.Remove();
  }
  g.r.SetClear(true);

  // We want to trap the player in the room, so delete all 4 doors
  for (let i = 0; i < 4; i++) {
    g.r.RemoveDoor(i);
  }

  // Put the player next to the bottom door
  player.Position = gridToPos(6, 5);

  // Remove the D6
  player.RemoveCollectible(CollectibleType.COLLECTIBLE_D6);

  // Remove the bomb
  player.AddBombs(-1);

  // Give Isaac's some speed
  player.AddCollectible(CollectibleType.COLLECTIBLE_BELT, 0, false);
  removeItemFromItemTracker(CollectibleType.COLLECTIBLE_BELT);
  player.AddCollectible(CollectibleType.COLLECTIBLE_BELT, 0, false);
  removeItemFromItemTracker(CollectibleType.COLLECTIBLE_BELT);
  const itemConfigItem = g.itemConfig.GetCollectible(
    CollectibleType.COLLECTIBLE_BELT,
  );
  if (itemConfigItem !== null) {
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
    Isaac.GridSpawn(GridEntityType.GRID_PRESSURE_PLATE, 0, position, true);

    const seasonSprite = Sprite();
    seasonSprite.Load(`gfx/changeCharOrder/buttons/${key}.anm2`, true);
    seasonSprite.SetFrame("Default", 0);
    v.room.sprites.seasons.set(key, seasonSprite);
  }
}
