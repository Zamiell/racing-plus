import {
  CollectibleType,
  PlayerType,
  TrinketType,
} from "isaac-typescript-definitions";
import { getRandomArrayElement, newRNG, repeat } from "isaacscript-common";
import g from "../../../../globals";
import { addCollectibleAndRemoveFromPools } from "../../../../utilsGlobals";
import { spawnDroppedChildsHeart } from "../../../optional/characters/samsonDropHeart";
import { giveDiversityItemsAndDoItemBans } from "../../../race/formatSetup";
import { NUM_DIVERSITY_PASSIVE_COLLECTIBLES } from "../constants";
import {
  BANNED_DIVERSITY_COLLECTIBLES_SEASON_ONLY,
  DIVERSITY_ACTIVE_COLLECTIBLE_TYPES,
  DIVERSITY_CHARACTER_BANNED_COLLECTIBLE_TYPES,
  DIVERSITY_CHARACTER_BANNED_TRINKET_TYPES,
  DIVERSITY_PASSIVE_COLLECTIBLE_TYPES,
} from "../constantsCollectibles";
import { DIVERSITY_TRINKET_TYPES } from "../constantsTrinkets";
import { initSeason3StartingRoomSprites } from "../startingRoomSprites";

export function season3PostGameStarted(): void {
  const player = Isaac.GetPlayer();

  giveStartingItems(player);
  removeItemsFromPools();

  const startSeed = g.seeds.GetStartSeed();
  const [collectibleTypes, trinketType] = getRandomDiversityItems(
    player,
    startSeed,
  );
  giveDiversityItemsAndDoItemBans(player, collectibleTypes, trinketType);

  initSeason3StartingRoomSprites(collectibleTypes, trinketType);
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

/** In addition to the "normal" diversity bans, some additional items are removed from pools. */
function removeItemsFromPools() {
  for (const collectibleType of BANNED_DIVERSITY_COLLECTIBLES_SEASON_ONLY) {
    g.itemPool.RemoveCollectible(collectibleType);
  }
}

/** Some characters start with additional items to make them stronger. */
function giveStartingItems(player: EntityPlayer) {
  const character = player.GetPlayerType();

  switch (character) {
    // 4
    case PlayerType.BLUE_BABY: {
      addCollectibleAndRemoveFromPools(player, CollectibleType.BIRTHRIGHT);
      break;
    }

    // 6
    case PlayerType.SAMSON: {
      // Samson does not start with Child's Heart in challenges for some reason.
      spawnDroppedChildsHeart(player);
      break;
    }

    // 24
    case PlayerType.JUDAS_B: {
      addCollectibleAndRemoveFromPools(player, CollectibleType.BIRTHRIGHT);
      break;
    }

    default: {
      break;
    }
  }
}
