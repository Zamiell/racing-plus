import g from "../../../globals";
import { CollectibleTypeCustom } from "../../../types/enums";
import { ChallengeCustom } from "../../speedrun/enums";

function removePlaceholderItems() {
  const challenge = Isaac.GetChallenge();

  // Remove the 3 diversity placeholder items if this is not a diversity race
  if (
    g.race.status !== "in progress" ||
    g.race.myStatus !== "racing" ||
    g.race.format !== "diversity"
  ) {
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_ITEM_PLACEHOLDER_1,
    );
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_ITEM_PLACEHOLDER_2,
    );
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_ITEM_PLACEHOLDER_3,
    );
  }

  // Remove the 9 speedrun placeholder items if this is not a Season 1 speedrun
  if (challenge !== ChallengeCustom.SEASON_1) {
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_ITEM_PLACEHOLDER_1,
    );
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_ITEM_PLACEHOLDER_2,
    );
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_ITEM_PLACEHOLDER_3,
    );
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_ITEM_PLACEHOLDER_4,
    );
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_ITEM_PLACEHOLDER_5,
    );
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_ITEM_PLACEHOLDER_6,
    );
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_ITEM_PLACEHOLDER_7,
    );
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_ITEM_PLACEHOLDER_8,
    );
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_ITEM_PLACEHOLDER_9,
    );
  }
}
