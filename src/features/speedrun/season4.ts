import {
  ButtonAction,
  CollectibleType,
  PlayerType,
} from "isaac-typescript-definitions";
import { isActionPressedOnAnyInput } from "isaacscript-common";
import { ChallengeCustom } from "../../enums/ChallengeCustom";
import { addCollectibleAndRemoveFromPools } from "../../utilsGlobals";

export const STARTING_CHARACTERS_FOR_THIRD_AND_BEYOND = [
  PlayerType.BETHANY, // 18
  PlayerType.JACOB, // 19
] as const;

// ModCallback.POST_PEFFECT_UPDATE (4)
export function postPEffectUpdate(player: EntityPlayer): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_4) {
    return;
  }

  checkItemStorageInput(player);
}

function checkItemStorageInput(player: EntityPlayer) {
  if (
    player.QueuedItem.Item === undefined ||
    !player.QueuedItem.Item.IsCollectible()
  ) {
    return;
  }

  if (!isActionPressedOnAnyInput(ButtonAction.MAP)) {
    return;
  }

  storeCollectible(player);
}

function storeCollectible(_player: EntityPlayer) {
  // TODO
}

// ModCallback.POST_GAME_STARTED (15)
export function postGameStarted(): void {
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.SEASON_4) {
    return;
  }

  giveStartingItems();
}

function giveStartingItems() {
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();

  // Give extra items to some characters.
  switch (character) {
    // 18
    case PlayerType.BETHANY: {
      addCollectibleAndRemoveFromPools(player, CollectibleType.DUALITY);
      break;
    }

    // 19
    case PlayerType.JACOB: {
      addCollectibleAndRemoveFromPools(player, CollectibleType.THERES_OPTIONS); // 249
      addCollectibleAndRemoveFromPools(player, CollectibleType.MORE_OPTIONS); // 414
      break;
    }

    default: {
      break;
    }
  }
}
