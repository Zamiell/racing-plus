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
      CollectibleTypeCustom.COLLECTIBLE_INCUBUS_PLACEHOLDER,
    );
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_CROWN_OF_LIGHT_PLACEHOLDER,
    );
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_SACRED_HEART_PLACEHOLDER,
    );
  }

  // Remove the 9 speedrun placeholder items if this is not a Season 1 speedrun
  if (challenge !== ChallengeCustom.SEASON_1) {
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_INCUBUS_PLACEHOLDER,
    );
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_CROWN_OF_LIGHT_PLACEHOLDER,
    );
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_SACRED_HEART_PLACEHOLDER,
    );
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_MAW_OF_THE_VOID_PLACEHOLDER,
    );
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_DEATHS_TOUCH_PLACEHOLDER,
    );
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_MAGIC_MUSHROOM_PLACEHOLDER,
    );
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_JUDAS_SHADOW_PLACEHOLDER,
    );
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_GODHEAD_PLACEHOLDER,
    );
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_TWISTED_PAIR_PLACEHOLDER,
    );
  }
}
