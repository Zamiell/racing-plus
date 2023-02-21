import {
  CollectibleType,
  PlayerType,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  copyArray,
  getRandomArrayElement,
  newRNG,
  removeCollectibleFromPools,
  repeat,
} from "isaacscript-common";
import {
  NUM_DIVERSITY_PASSIVE_COLLECTIBLES,
  SEASON_3_GOALS,
} from "../../../../classes/features/speedrun/season3/constants";
import { season3InitStartingRoomSprites } from "../../../../classes/features/speedrun/season3/startingRoomSprites";
import { v } from "../../../../classes/features/speedrun/season3/v";
import { g } from "../../../../globals";
import { addCollectibleAndRemoveFromPools } from "../../../../utilsGlobals";
import { giveDiversityItemsAndDoItemBans } from "../../../race/formatSetup";
import { isOnFirstCharacter, onSeason } from "../../speedrun";
import {
  BANNED_DIVERSITY_COLLECTIBLES_SEASON_ONLY,
  DIVERSITY_ACTIVE_COLLECTIBLE_TYPES,
  DIVERSITY_CHARACTER_BANNED_COLLECTIBLE_TYPES,
  DIVERSITY_CHARACTER_BANNED_TRINKET_TYPES,
  DIVERSITY_PASSIVE_COLLECTIBLE_TYPES,
} from "../constantsCollectibles";
import { DIVERSITY_TRINKET_TYPES } from "../constantsTrinkets";

export function season3PostGameStarted(): void {
  if (!onSeason(3)) {
    return;
  }

  const player = Isaac.GetPlayer();

  if (isOnFirstCharacter()) {
    v.persistent.remainingGoals = copyArray(SEASON_3_GOALS);
  }

  giveStartingItems(player);

  // In addition to the "normal" diversity bans, some additional items are removed from pools.
  removeCollectibleFromPools(...BANNED_DIVERSITY_COLLECTIBLES_SEASON_ONLY);

  const startSeed = g.seeds.GetStartSeed();
  const [collectibleTypes, trinketType] = getRandomDiversityItems(
    player,
    startSeed,
  );
  giveDiversityItemsAndDoItemBans(player, collectibleTypes, trinketType);

  season3InitStartingRoomSprites(collectibleTypes, trinketType);
}

function getRandomDiversityItems(
  player: EntityPlayer,
  startSeed: Seed,
): [collectibleTypes: CollectibleType[], trinketType: TrinketType] {
  const rng = newRNG(startSeed);
  const character = player.GetPlayerType();

  let activeCollectibleType: CollectibleType;
  do {
    activeCollectibleType = getRandomArrayElement(
      DIVERSITY_ACTIVE_COLLECTIBLE_TYPES,
      rng,
    );
  } while (
    player.HasCollectible(activeCollectibleType) ||
    isCollectibleTypeBannedOnThisCharacter(activeCollectibleType, character)
  );

  const passiveCollectibleTypes: CollectibleType[] = [];
  repeat(NUM_DIVERSITY_PASSIVE_COLLECTIBLES, () => {
    let passiveCollectibleType: CollectibleType;
    do {
      passiveCollectibleType = getRandomArrayElement(
        DIVERSITY_PASSIVE_COLLECTIBLE_TYPES,
        rng,
        passiveCollectibleTypes,
      );
    } while (
      player.HasCollectible(passiveCollectibleType) ||
      isCollectibleTypeBannedOnThisCharacter(activeCollectibleType, character)
    );
    passiveCollectibleTypes.push(passiveCollectibleType);
  });

  let trinketType: TrinketType;
  do {
    trinketType = getRandomArrayElement(DIVERSITY_TRINKET_TYPES, rng);
  } while (
    player.HasTrinket(trinketType) ||
    isTrinketTypeBannedOnThisCharacter(trinketType, character)
  );

  const collectibleTypes = [activeCollectibleType, ...passiveCollectibleTypes];

  return [collectibleTypes, trinketType];
}

function isCollectibleTypeBannedOnThisCharacter(
  collectibleType: CollectibleType,
  character: PlayerType,
): boolean {
  const bannedCollectibleTypes =
    DIVERSITY_CHARACTER_BANNED_COLLECTIBLE_TYPES.get(character);
  if (bannedCollectibleTypes === undefined) {
    return false;
  }

  return bannedCollectibleTypes.has(collectibleType);
}

function isTrinketTypeBannedOnThisCharacter(
  trinketType: TrinketType,
  character: PlayerType,
): boolean {
  const bannedTrinketTypes =
    DIVERSITY_CHARACTER_BANNED_TRINKET_TYPES.get(character);
  if (bannedTrinketTypes === undefined) {
    return false;
  }

  return bannedTrinketTypes.has(trinketType);
}

/** Some characters start with additional items to make them stronger. */
function giveStartingItems(player: EntityPlayer) {
  const character = player.GetPlayerType();

  switch (character) {
    // 4, 24
    case PlayerType.BLUE_BABY:
    case PlayerType.JUDAS_B: {
      addCollectibleAndRemoveFromPools(player, CollectibleType.BIRTHRIGHT);
      break;
    }

    default: {
      break;
    }
  }
}
