import {
  CollectibleType,
  ModCallback,
  PlayerType,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  anyPlayerIs,
  game,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../enums/ChallengeCustom";
import { mod } from "../../../mod";
import { addCollectibleAndRemoveFromPools } from "../../../utils";
import { ChallengeModFeature } from "../../ChallengeModFeature";
import { hasErrors } from "../mandatory/misc/checkErrors/v";
import {
  season2DrawStartingRoomSprites,
  season2DrawStartingRoomText,
  season2ResetStartingRoomSprites,
} from "./season2/startingRoomSprites";

export class Season2 extends ChallengeModFeature {
  challenge = ChallengeCustom.SEASON_2;

  // 2
  @Callback(ModCallback.POST_RENDER)
  postRender(): void {
    if (hasErrors()) {
      return;
    }

    const hud = game.GetHUD();
    if (!hud.IsVisible()) {
      return;
    }

    // We do not have to check if the game is paused because the pause menu will be drawn on top of
    // the starting room sprites. (And we do not have to worry about the room slide animation
    // because the starting room sprites are not shown once we re-enter the room.)

    season2DrawStartingRoomSprites();
    season2DrawStartingRoomText();
  }

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReorderedFalse(): void {
    if (hasErrors()) {
      return;
    }

    const player = Isaac.GetPlayer();
    this.giveStartingItems(player);
    this.removeItemsFromPools();
  }

  giveStartingItems(player: EntityPlayer): void {
    const character = player.GetPlayerType();

    // Everyone starts with the Compass in this season.
    addCollectibleAndRemoveFromPools(player, CollectibleType.COMPASS);

    // Some characters get additional items in this season.
    switch (character) {
      case PlayerType.ISAAC_B: {
        addCollectibleAndRemoveFromPools(player, CollectibleType.BIRTHRIGHT);
        break;
      }

      default: {
        break;
      }
    }
  }

  removeItemsFromPools(): void {
    const itemPool = game.GetItemPool();

    // These bans are from seeded races.
    itemPool.RemoveCollectible(CollectibleType.SOL);
    itemPool.RemoveTrinket(TrinketType.CAINS_EYE);

    if (anyPlayerIs(PlayerType.DARK_JUDAS)) {
      itemPool.RemoveCollectible(CollectibleType.JUDAS_SHADOW);
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    if (!mod.inFirstRoom()) {
      season2ResetStartingRoomSprites();
    }
  }
}
