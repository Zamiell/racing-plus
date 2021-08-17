import g from "../../../globals";
import { config } from "../../../modConfigMenu";
import { CollectibleTypeCustom } from "../../../types/enums";
import { ChallengeCustom } from "../../speedrun/enums";

export function postGameStarted(): void {
  if (!config.extraStartingItems) {
    return;
  }

  const challenge = Isaac.GetChallenge();

  removePlaceholdersExceptInDiv();
  removePlaceholdersExceptInSeason1(challenge);
}

function removePlaceholdersExceptInDiv() {
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
}

function removePlaceholdersExceptInSeason1(challenge: number) {
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
