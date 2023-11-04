import {
  CallbackPriority,
  CollectibleType,
  RoomType,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  PriorityCallbackCustom,
  inRoomType,
  onFirstFloor,
  rebirthItemTrackerRemoveCollectible,
  removeCollectibleCostume,
} from "isaacscript-common";
import { inDiversityRace, inUnseededRace } from "../../../../features/race/v";
import { inSpeedrun, onSeason } from "../../../../speedrun/utilsSpeedrun";
import { MandatoryModFeature } from "../../../MandatoryModFeature";
import { isOnFirstCharacter } from "../../speedrun/characterProgress/v";
import { shouldBanFirstFloorTreasureRoom } from "./PlanetariumFix";

const v = {
  run: {
    hasTempMoreOptions: false,
  },
};

/** In some situations, we force the first Treasure Room to have two items. */
export class TempMoreOptions extends MandatoryModFeature {
  v = v;

  /**
   * We make the callback late to give time for other starting items to be given, which might
   * include More Options.
   */
  @PriorityCallbackCustom(
    ModCallbackCustom.POST_GAME_STARTED_REORDERED,
    CallbackPriority.LATE,
    false,
  )
  postGameStartedReorderedFalseLate(): void {
    // If the first floor Treasure Room is removed, then they should never receive the buff.
    if (shouldBanFirstFloorTreasureRoom()) {
      return;
    }

    if (this.shouldGetTempMoreOptions()) {
      this.giveTempMoreOptions();
    }
  }

  shouldGetTempMoreOptions(): boolean {
    return (
      inUnseededRace() ||
      inDiversityRace() ||
      (inSpeedrun() && isOnFirstCharacter()) ||
      // On season 3, every character gets this temporary buff in order to match how diversity races
      // work.
      onSeason(3)
    );
  }

  /** Validation is performed in the parent function. */
  giveTempMoreOptions(): void {
    const player = Isaac.GetPlayer();

    // If the player already started with More Options, then do nothing. (For example, they could
    // have gotten it in a diversity race.)
    if (player.HasCollectible(CollectibleType.MORE_OPTIONS)) {
      return;
    }

    player.AddCollectible(CollectibleType.MORE_OPTIONS);
    rebirthItemTrackerRemoveCollectible(CollectibleType.MORE_OPTIONS);
    removeCollectibleCostume(player, CollectibleType.MORE_OPTIONS);

    // Mark to remove the collectible later.
    v.run.hasTempMoreOptions = true;
  }

  /**
   * Ensure that the "More Options" buff does not persist beyond the first floor. (It is removed as
   * soon as they enter the first Treasure Room, but they might have skipped the Basement 1 Treasure
   * Room for some reason.)
   */
  @CallbackCustom(ModCallbackCustom.POST_NEW_LEVEL_REORDERED)
  postNewLevelReordered(): void {
    if (v.run.hasTempMoreOptions && !onFirstFloor()) {
      this.removeTempMoreOptions();
    }
  }

  /** Remove the "More Options" buff as soon as they enter the Treasure Room. */
  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    if (v.run.hasTempMoreOptions && inRoomType(RoomType.TREASURE)) {
      this.removeTempMoreOptions();
    }
  }

  removeTempMoreOptions(): void {
    const player = Isaac.GetPlayer();
    player.RemoveCollectible(CollectibleType.MORE_OPTIONS);

    v.run.hasTempMoreOptions = false;
  }
}
