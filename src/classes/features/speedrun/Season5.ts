import { ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  assertDefined,
  game,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../enums/ChallengeCustom";
import { mod } from "../../../mod";
import { ChallengeModFeature } from "../../ChallengeModFeature";
import { hasErrors } from "../mandatory/misc/checkErrors/v";
import { getAndSetRandomStartingBuildIndex } from "./RandomStartingBuild";
import { speedrunGetCurrentCharacter } from "./characterProgress/v";
import { RANDOM_STARTING_BUILDS } from "./randomStartingBuild/constants";
import {
  season5DrawStartingRoomSprites,
  season5InitStartingRoomSprites,
  season5ResetStartingRoomSprites,
} from "./season5/startingRoomSprites";

export class Season5 extends ChallengeModFeature {
  challenge = ChallengeCustom.SEASON_5;

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

    season5DrawStartingRoomSprites();
  }

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReorderedFalse(): void {
    if (hasErrors()) {
      return;
    }

    const startingCharacter = speedrunGetCurrentCharacter();
    const startingBuildIndex =
      getAndSetRandomStartingBuildIndex(startingCharacter);

    const startingBuild = RANDOM_STARTING_BUILDS[startingBuildIndex];
    assertDefined(
      startingBuild,
      `Failed to get the starting build for index: ${startingBuildIndex}`,
    );

    season5InitStartingRoomSprites(startingBuild);
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    if (!mod.inFirstRoom()) {
      season5ResetStartingRoomSprites();
    }
  }
}
