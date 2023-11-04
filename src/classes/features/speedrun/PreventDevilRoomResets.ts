import { CallbackPriority, RoomType } from "isaac-typescript-definitions";
import {
  ModCallbackCustom,
  PriorityCallbackCustom,
  getAllPlayers,
  inRoomType,
  onFirstFloor,
  removeAllPickups,
} from "isaacscript-common";
import { mod } from "../../../mod";
import { CUSTOM_CHALLENGES_SET } from "../../../speedrun/constants";
import { ChallengeModFeature } from "../../ChallengeModFeature";
import { isPlanetariumFixWarping } from "../mandatory/misc/PlanetariumFix";
import { setDevilAngelEmpty } from "../optional/major/BetterDevilAngelRooms";
import { isOnFirstCharacter } from "./characterProgress/v";

/** Prevent players from resetting for a Devil Room item on the first character. */
export class PreventDevilRoomResets extends ChallengeModFeature {
  challenge = CUSTOM_CHALLENGES_SET;

  /** This must be early so that it fires before the `BetterDevilAngelRooms` feature. */
  @PriorityCallbackCustom(
    ModCallbackCustom.POST_NEW_ROOM_REORDERED,
    CallbackPriority.EARLY,
  )
  postNewRoomReorderedEarly(): void {
    this.checkFirstCharacterFirstFloorDevilRoom();
  }

  checkFirstCharacterFirstFloorDevilRoom(): void {
    if (!isOnFirstCharacter() || !onFirstFloor() || isPlanetariumFixWarping()) {
      return;
    }

    if (!inRoomType(RoomType.DEVIL, RoomType.ANGEL)) {
      return;
    }

    const previousRoomDescription = mod.getPreviousRoomDescription();
    if (previousRoomDescription.roomType === RoomType.CURSE) {
      this.emptyDevilAngelRoom();

      // Later on in this callback, the Devil Room or Angel Room will be replaced with a seeded
      // version of the room. Notify the seeded rooms feature to keep the room empty.
      setDevilAngelEmpty();
    }
  }

  emptyDevilAngelRoom(): void {
    removeAllPickups();

    // Signal that we are not supposed to get the items in this room. Since they are teleporting
    // into the room, the animation will not actually play, but they will still be able to hear the
    // sound effect.
    for (const player of getAllPlayers()) {
      player.AnimateSad();
    }
  }
}
