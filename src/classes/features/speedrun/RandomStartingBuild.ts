import type { Challenge } from "isaac-typescript-definitions";
import {
  CacheFlag,
  CollectibleType,
  LevelStage,
  ModCallback,
  PlayerType,
  RoomType,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  ReadonlySet,
  assertDefined,
  copyArray,
  copySet,
  emptyArray,
  getRandomArrayElementAndRemove,
  hasCollectible,
  hasFlyingTransformation,
  inRoomType,
  isFlyingCharacter,
  isRoomInsideGrid,
  onEffectiveStage,
  removeCollectibleCostume,
  smeltTrinket,
} from "isaacscript-common";
import { ChallengeCustom } from "../../../enums/ChallengeCustom";
import { CollectibleTypeCustom } from "../../../enums/CollectibleTypeCustom";
import { mod } from "../../../mod";
import { onSeason } from "../../../speedrun/utilsSpeedrun";
import { addCollectibleAndRemoveFromPools } from "../../../utils";
import { ChallengeModFeature } from "../../ChallengeModFeature";
import { hasErrors } from "../mandatory/misc/checkErrors/v";
import {
  RANDOM_CHARACTER_LOCK_MILLISECONDS,
  getAndSetRandomStartingCharacter,
  onSpeedrunWithRandomCharacterOrder,
} from "./RandomCharacterOrder";
import { getCharacterOrder } from "./changeCharOrder/v";
import {
  speedrunGetCharacterNum,
  speedrunGetCurrentCharacter,
} from "./characterProgress/v";
import {
  NUM_REVELATION_SOUL_HEARTS,
  RANDOM_STARTING_BUILDS,
  RANDOM_STARTING_BUILD_FORGOTTEN_EXCEPTIONS,
  RANDOM_STARTING_BUILD_INDEXES,
} from "./randomStartingBuild/constants";

declare function CCPMainResetPlayerCostumes(player: EntityPlayer): void;

/** How long the randomly-selected build is "locked-in". */
export const RANDOM_BUILD_LOCK_MILLISECONDS =
  RANDOM_CHARACTER_LOCK_MILLISECONDS;

const CHALLENGES_WITH_RANDOM_STARTING_BUILD = [
  ChallengeCustom.SEASON_2,
  ChallengeCustom.SEASON_5,
] as const;

const CHALLENGES_WITH_RANDOM_STARTING_BUILD_SET = new ReadonlySet<Challenge>(
  CHALLENGES_WITH_RANDOM_STARTING_BUILD,
);

const v = {
  persistent: {
    selectedBuildIndexes: [] as int[],
    remainingBuildIndexes: [] as int[],

    /** Never start the same build twice in a row. */
    lastSelectedBuildIndex: null as int | null,

    /**
     * The time (in milliseconds) that the first random build was assigned. This is is set to 0 when
     * the Basement 2 boss is defeated.
     */
    timeFirstBuildIndexAssigned: null as int | null,
  },
};

export class RandomStartingBuild extends ChallengeModFeature {
  challenge = CHALLENGES_WITH_RANDOM_STARTING_BUILD_SET;
  v = v;

  // 8, 1 << 7
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.FLYING)
  evaluateCacheFlying(player: EntityPlayer): void {
    this.removeRevelationsFlight(player);
  }

  removeRevelationsFlight(player: EntityPlayer): void {
    const buildIndex = getCurrentRandomStartingBuildIndex();
    if (buildIndex === undefined) {
      return;
    }

    const build = RANDOM_STARTING_BUILDS[buildIndex];
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
    const flyingCollectiblesReadOnly = mod.getFlyingCollectibles(false);
    const flyingCollectibles = copySet(flyingCollectiblesReadOnly);
    flyingCollectibles.delete(CollectibleType.REVELATION);

    return hasCollectible(player, ...flyingCollectibles);
  }

  // 70
  @Callback(ModCallback.PRE_SPAWN_CLEAR_AWARD)
  preSpawnClearAward(): boolean | undefined {
    this.checkResetTimeAssigned();
    return undefined;
  }

  /** Reset the starting build timer if we just killed the Basement 2 boss. */
  checkResetTimeAssigned(): void {
    if (
      onEffectiveStage(LevelStage.BASEMENT_2) &&
      inRoomType(RoomType.BOSS) &&
      isRoomInsideGrid()
    ) {
      v.persistent.timeFirstBuildIndexAssigned = 0; // Setting to null does not work.
    }
  }

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReorderedFalse(): void {
    if (hasErrors()) {
      return;
    }

    this.checkFirstSpeedrunCharacterRefresh();

    const player = Isaac.GetPlayer();
    const startingCharacter = onSpeedrunWithRandomCharacterOrder()
      ? getAndSetRandomStartingCharacter()
      : speedrunGetCurrentCharacter();
    const startingBuildIndex =
      getAndSetRandomStartingBuildIndex(startingCharacter);

    const startingBuild = RANDOM_STARTING_BUILDS[startingBuildIndex];
    assertDefined(
      startingBuild,
      `Failed to get the starting build for index: ${startingBuildIndex}`,
    );

    this.addBuild(player, startingBuild);

    // In Season 5, the baby will appear to be glitched if we grant items during this callback.
    if (onSeason(5)) {
      CCPMainResetPlayerCostumes(player);
    }
  }

  checkFirstSpeedrunCharacterRefresh(): void {
    const characterNum = speedrunGetCharacterNum();
    if (characterNum !== 1) {
      return;
    }

    const time = Isaac.GetTime();
    if (
      v.persistent.timeFirstBuildIndexAssigned === null ||
      v.persistent.timeFirstBuildIndexAssigned > time
    ) {
      // It is possible for the time assignment to be in the future, since it is based on the time
      // since the operating system started.
      v.persistent.timeFirstBuildIndexAssigned = time;
    }

    const buildLockedUntilTime =
      v.persistent.timeFirstBuildIndexAssigned + RANDOM_BUILD_LOCK_MILLISECONDS;
    if (
      time > buildLockedUntilTime ||
      v.persistent.selectedBuildIndexes.length === 0
    ) {
      this.refreshStartingBuilds();
    }
  }

  refreshStartingBuilds(): void {
    const time = Isaac.GetTime();

    v.persistent.selectedBuildIndexes = [];
    v.persistent.remainingBuildIndexes = copyArray(
      RANDOM_STARTING_BUILD_INDEXES,
    );
    v.persistent.timeFirstBuildIndexAssigned = time; // We assign the build later on.
  }

  addBuild(
    player: EntityPlayer,
    startingBuild: readonly CollectibleType[],
  ): void {
    // Give the collectibles from the starting build.
    for (const collectibleType of startingBuild) {
      addCollectibleAndRemoveFromPools(player, collectibleType);
    }

    const firstCollectibleType = startingBuild[0];

    // Handle builds with custom behavior.
    switch (firstCollectibleType) {
      // 12 - Revelation (no soul hearts, no flight).
      case CollectibleType.REVELATION: {
        player.AddSoulHearts(NUM_REVELATION_SOUL_HEARTS * -1);
        removeCollectibleCostume(player, CollectibleType.REVELATION);

        break;
      }

      // 21 - Incubus + Twisted Pair + Forgotten Lullaby.
      case CollectibleType.INCUBUS: {
        smeltTrinket(player, TrinketType.FORGOTTEN_LULLABY);
        break;
      }

      // 26 - Sawblade + Fate (no eternal heart).
      case CollectibleTypeCustom.SAWBLADE: {
        player.AddEternalHearts(-1);
        break;
      }

      default: {
        break;
      }
    }
  }
}

function getCurrentRandomStartingBuildIndex(): int | undefined {
  const characterNum = speedrunGetCharacterNum();
  return v.persistent.selectedBuildIndexes[characterNum - 1];
}

export function randomStartingBuildResetPersistentVars(): void {
  emptyArray(v.persistent.selectedBuildIndexes);
  emptyArray(v.persistent.remainingBuildIndexes);
  v.persistent.lastSelectedBuildIndex = null;
  v.persistent.timeFirstBuildIndexAssigned = null;
  // `timeBuildBansSet` is not reset since it has to do with the "Change Char Order" challenge.
}

export function onSpeedrunWithRandomStartingBuild(): boolean {
  const challenge = Isaac.GetChallenge();
  return CHALLENGES_WITH_RANDOM_STARTING_BUILD_SET.has(challenge);
}

export function getAndSetRandomStartingBuildIndex(character: PlayerType): int {
  // First, handle the case where we have already selected a build for this character.
  const oldStartingBuildIndex = getCurrentRandomStartingBuildIndex();
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
  const antiSynergyBuilds = getAntiSynergyBuilds(character);
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

function getAntiSynergyBuilds(character: PlayerType): readonly int[] {
  switch (character) {
    // 5
    case PlayerType.EVE: {
      return getBuildIndexesFor(CollectibleType.CROWN_OF_LIGHT);
    }

    // 16
    case PlayerType.FORGOTTEN: {
      return RANDOM_STARTING_BUILD_FORGOTTEN_EXCEPTIONS;
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

function getBuildIndexesFor(...collectibleTypes: CollectibleType[]): int[] {
  return collectibleTypes.map((collectibleType) =>
    getBuildIndexFor(collectibleType),
  );
}

function getBuildIndexFor(collectibleType: CollectibleType): int {
  for (const [i, build] of RANDOM_STARTING_BUILDS.entries()) {
    const firstCollectible = build[0];
    if (firstCollectible === collectibleType) {
      return i;
    }
  }

  error(`Failed to find the random build index for: ${collectibleType}`);
}
