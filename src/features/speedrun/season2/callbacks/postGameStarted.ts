import {
  CollectibleType,
  PlayerType,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  anyPlayerIs,
  getRandomArrayElementAndRemove,
  removeCollectibleCostume,
  smeltTrinket,
} from "isaacscript-common";
import { getStartingCharacter } from "../../../../classes/features/speedrun/RandomCharacterOrder";
import { ChallengeCustom } from "../../../../enums/ChallengeCustom";
import { CollectibleTypeCustom } from "../../../../enums/CollectibleTypeCustom";
import { g } from "../../../../globals";
import {
  addCollectibleAndRemoveFromPools,
  giveTrinketAndRemoveFromPools,
} from "../../../../utilsGlobals";
import { getCharacterOrderSafe } from "../../speedrun";
import {
  SEASON_2_FORGOTTEN_EXCEPTIONS,
  SEASON_2_STARTING_BUILDS,
} from "../constants";
import { initSeason2StartingRoomSprites } from "../startingRoomSprites";
import { season2GetCurrentBuildIndex, v } from "../v";

const NUM_REVELATION_SOUL_HEARTS = 4;

export function season2PostGameStarted(): void {
  const challenge = Isaac.GetChallenge();
  const player = Isaac.GetPlayer();

  if (challenge !== ChallengeCustom.SEASON_2) {
    return;
  }

  const startingCharacter = getStartingCharacter();
  const startingBuildIndex = getStartingBuildIndex(startingCharacter);

  const startingBuild = SEASON_2_STARTING_BUILDS[startingBuildIndex];
  if (startingBuild === undefined) {
    error(`Failed to get the starting build for index: ${startingBuildIndex}`);
  }

  giveStartingItems(player, startingBuild);
  removeItemsFromPools();

  initSeason2StartingRoomSprites(startingBuild);
}

function removeItemsFromPools() {
  // These bans are from seeded races.
  g.itemPool.RemoveCollectible(CollectibleType.SOL);
  g.itemPool.RemoveTrinket(TrinketType.CAINS_EYE);

  if (anyPlayerIs(PlayerType.DARK_JUDAS)) {
    g.itemPool.RemoveCollectible(CollectibleType.JUDAS_SHADOW);
  }
}

function getStartingBuildIndex(character: PlayerType) {
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
  const vetoedBuilds = getCharacterOrderSafe();
  buildExceptions.push(...vetoedBuilds);

  // Don't get starting builds that don't synergize with the current character.
  const antiSynergyBuilds = getAntiSynergyBuilds(character);
  buildExceptions.push(...antiSynergyBuilds);

  const startingBuildIndex = getRandomArrayElementAndRemove(
    v.persistent.remainingBuildIndexes,
    undefined,
    buildExceptions,
  );

  v.persistent.selectedBuildIndexes.push(startingBuildIndex);
  v.persistent.lastSelectedBuildIndex = startingBuildIndex;

  return startingBuildIndex;
}

function getAntiSynergyBuilds(character: PlayerType): readonly int[] {
  switch (character) {
    // 5
    case PlayerType.EVE: {
      return getBuildIndexesFor(CollectibleType.CROWN_OF_LIGHT);
    }

    // 16
    case PlayerType.FORGOTTEN: {
      return SEASON_2_FORGOTTEN_EXCEPTIONS;
    }

    // 27
    case PlayerType.SAMSON_B: {
      return getBuildIndexesFor(
        CollectibleType.DR_FETUS, // 52
        CollectibleType.BRIMSTONE, // 118
        CollectibleType.IPECAC, // 148
        CollectibleType.FIRE_MIND, // 257
      );
    }

    // 28
    case PlayerType.AZAZEL_B: {
      return getBuildIndexesFor(
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

function getBuildIndexesFor(...collectibleTypes: CollectibleType[]) {
  return collectibleTypes.map((collectibleType) =>
    getBuildIndexFor(collectibleType),
  );
}

function getBuildIndexFor(collectibleType: CollectibleType) {
  for (let i = 0; i < SEASON_2_STARTING_BUILDS.length; i++) {
    const build = SEASON_2_STARTING_BUILDS[i];
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

function giveStartingItems(
  player: EntityPlayer,
  startingBuild: readonly CollectibleType[],
) {
  const character = player.GetPlayerType();

  // Everyone starts with the Compass in this season.
  addCollectibleAndRemoveFromPools(player, CollectibleType.COMPASS);

  switch (character) {
    // 2
    case PlayerType.CAIN: {
      // Cain does not automatically start with the Paper Clip in custom challenges.
      giveTrinketAndRemoveFromPools(player, TrinketType.PAPER_CLIP);
      break;
    }

    // 5
    case PlayerType.EVE: {
      // Eve does not automatically start with the Razor in custom challenges.
      addCollectibleAndRemoveFromPools(player, CollectibleType.RAZOR_BLADE);
      break;
    }

    case PlayerType.ISAAC_B: {
      addCollectibleAndRemoveFromPools(player, CollectibleType.BIRTHRIGHT);
      break;
    }

    default: {
      break;
    }
  }

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
