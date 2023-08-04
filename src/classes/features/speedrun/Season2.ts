import {
  CacheFlag,
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
  copySet,
  game,
  getRandomArrayElementAndRemove,
  hasCollectible,
  hasFlyingTransformation,
  isFlyingCharacter,
  removeCollectibleCostume,
  smeltTrinket,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../enums/ChallengeCustom";
import { CollectibleTypeCustom } from "../../../enums/CollectibleTypeCustom";
import { mod } from "../../../mod";
import { addCollectibleAndRemoveFromPools } from "../../../utils";
import { ChallengeModFeature } from "../../ChallengeModFeature";
import { hasErrors } from "../mandatory/misc/checkErrors/v";
import { getRandomlySelectedStartingCharacter } from "./RandomCharacterOrder";
import { getCharacterOrder } from "./changeCharOrder/v";
import {
  NUM_REVELATION_SOUL_HEARTS,
  SEASON_2_FORGOTTEN_EXCEPTIONS,
  SEASON_2_STARTING_BUILDS,
} from "./season2/constants";
import {
  season2DrawStartingRoomSprites,
  season2DrawStartingRoomText,
  season2InitStartingRoomSprites,
  season2ResetStartingRoomSprites,
} from "./season2/startingRoomSprites";
import { season2GetCurrentBuildIndex, v } from "./season2/v";

export class Season2 extends ChallengeModFeature {
  challenge = ChallengeCustom.SEASON_2;
  v = v;

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

  // 8, 1 << 7
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.FLYING)
  evaluateCacheFlying(player: EntityPlayer): void {
    const buildIndex = season2GetCurrentBuildIndex();
    if (buildIndex === undefined) {
      return;
    }

    const build = SEASON_2_STARTING_BUILDS[buildIndex];
    if (build === undefined) {
      return;
    }

    const firstCollectibleType = build[0];
    if (firstCollectibleType !== CollectibleType.REVELATION) {
      return;
    }

    // Only remove the flight if the player does not have another flight item or effect.
    if (
      !isFlyingCharacter(player) &&
      !hasFlyingTransformation(player) &&
      !mod.hasFlyingTemporaryEffect(player) &&
      !this.hasFlyingCollectibleExceptForRevelation(player)
    ) {
      player.CanFly = false;
    }
  }

  hasFlyingCollectibleExceptForRevelation(player: EntityPlayer): boolean {
    const flyingCollectibles = copySet(mod.getFlyingCollectibles(false));
    flyingCollectibles.delete(CollectibleType.REVELATION);

    return hasCollectible(player, ...flyingCollectibles);
  }

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReorderedFalse(): void {
    if (hasErrors()) {
      return;
    }

    const player = Isaac.GetPlayer();
    const startingCharacter = getRandomlySelectedStartingCharacter();
    const startingBuildIndex = this.getStartingBuildIndex(startingCharacter);

    const startingBuild = SEASON_2_STARTING_BUILDS[startingBuildIndex];
    if (startingBuild === undefined) {
      error(
        `Failed to get the starting build for index: ${startingBuildIndex}`,
      );
    }

    this.giveStartingItems(player, startingBuild);
    this.removeItemsFromPools();

    season2InitStartingRoomSprites(startingBuild);
  }

  getStartingBuildIndex(character: PlayerType): int {
    // First, handle the case where we have already selected a build for this character.
    const oldStartingBuildIndex = season2GetCurrentBuildIndex();
    if (oldStartingBuildIndex !== undefined) {
      return oldStartingBuildIndex;
    }

    const buildExceptions: int[] = [];

    // Don't get the same starting build as the one we just played.
    if (v.persistent.lastSelectedBuildIndex !== null) {
      buildExceptions.push(v.persistent.lastSelectedBuildIndex);
    }

    // Don't get starting builds that we have vetoed.
    const vetoedBuilds = getCharacterOrder() ?? [];
    buildExceptions.push(...vetoedBuilds);

    // Don't get starting builds that don't synergize with the current character.
    const antiSynergyBuilds = this.getAntiSynergyBuilds(character);
    buildExceptions.push(...antiSynergyBuilds);

    if (v.persistent.remainingBuildIndexes.length === 0) {
      error(
        "Failed to get a random starting build index since there were no remaining build indexes.",
      );
    }

    const startingBuildIndex = getRandomArrayElementAndRemove(
      v.persistent.remainingBuildIndexes,
      undefined,
      buildExceptions,
    );

    v.persistent.selectedBuildIndexes.push(startingBuildIndex);
    v.persistent.lastSelectedBuildIndex = startingBuildIndex;

    return startingBuildIndex;
  }

  getAntiSynergyBuilds(character: PlayerType): readonly int[] {
    switch (character) {
      // 5
      case PlayerType.EVE: {
        return this.getBuildIndexesFor(CollectibleType.CROWN_OF_LIGHT);
      }

      // 16
      case PlayerType.FORGOTTEN: {
        return SEASON_2_FORGOTTEN_EXCEPTIONS;
      }

      // 27
      case PlayerType.SAMSON_B: {
        return this.getBuildIndexesFor(
          CollectibleType.DR_FETUS, // 52
          CollectibleType.BRIMSTONE, // 118
          CollectibleType.IPECAC, // 148
          CollectibleType.FIRE_MIND, // 257
        );
      }

      // 28
      case PlayerType.AZAZEL_B: {
        return this.getBuildIndexesFor(
          CollectibleType.DR_FETUS, // 52
          CollectibleType.CRICKETS_BODY, // 224
          CollectibleType.DEATHS_TOUCH, // 237
          CollectibleType.FIRE_MIND, // 257
          CollectibleType.DEAD_EYE, // 373
          CollectibleType.TECH_X, // 395
          CollectibleType.HAEMOLACRIA, // 531
          CollectibleType.POINTY_RIB, // 544
          CollectibleType.REVELATION, // 643
        );
      }

      default: {
        return [];
      }
    }
  }

  getBuildIndexesFor(...collectibleTypes: CollectibleType[]): int[] {
    return collectibleTypes.map((collectibleType) =>
      this.getBuildIndexFor(collectibleType),
    );
  }

  getBuildIndexFor(collectibleType: CollectibleType): int {
    for (const [i, build] of SEASON_2_STARTING_BUILDS.entries()) {
      if (build === undefined) {
        continue;
      }

      const firstCollectible = build[0];
      if (firstCollectible === collectibleType) {
        return i;
      }
    }

    return error(
      `Failed to find the season 2 build index for: ${collectibleType}`,
    );
  }

  giveStartingItems(
    player: EntityPlayer,
    startingBuild: readonly CollectibleType[],
  ): void {
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

    // Give the collectibles from the starting build.
    for (const collectibleType of startingBuild) {
      addCollectibleAndRemoveFromPools(player, collectibleType);
    }

    const firstCollectibleType = startingBuild[0];

    // Handle builds with smelted trinkets.
    if (firstCollectibleType === CollectibleType.INCUBUS) {
      smeltTrinket(player, TrinketType.FORGOTTEN_LULLABY);
    }

    // Handle builds with custom nerfs.
    if (firstCollectibleType === CollectibleType.REVELATION) {
      player.AddSoulHearts(NUM_REVELATION_SOUL_HEARTS * -1);
      removeCollectibleCostume(player, CollectibleType.REVELATION);
    } else if (firstCollectibleType === CollectibleTypeCustom.SAWBLADE) {
      player.AddEternalHearts(-1);
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
