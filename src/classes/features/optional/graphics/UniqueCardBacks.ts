// ModCallback.POST_PICKUP_INIT (34)

import {
  CardType,
  ModCallback,
  PickupVariant,
} from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import type { Config } from "../../../Config";
import { ConfigurableModFeature } from "../../../ConfigurableModFeature";

export class UniqueCardBacks extends ConfigurableModFeature {
  configKey: keyof Config = "UniqueCardBacks";

  // 34, 300
  @Callback(ModCallback.POST_PICKUP_INIT, PickupVariant.CARD)
  postPickupInitCard(pickup: EntityPickup): void {
    const card = pickup as EntityPickupCard;

    if (
      card.SubType === CardType.RUNE_BLANK // 40
      || card.SubType === CardType.RUNE_BLACK // 41
    ) {
      // Give an alternate rune sprite (one that isn't tilted left or right).
      const sprite = card.GetSprite();
      sprite.ReplaceSpritesheet(
        0,
        "gfx/items/pick ups/pickup_unique_generic_rune.png",
      );

      // The black rune will now glow black; remove this from the blank rune.
      sprite.ReplaceSpritesheet(
        1,
        "gfx/items/pick ups/pickup_unique_generic_rune.png",
      );

      sprite.LoadGraphics();
      return;
    }

    if (
      // - Chaos Card (42) has a Magic: The Gathering card back in vanilla.
      // - Credit Card (43) has a unique card back in vanilla.
      // - Rules Card (44) has a red card back in vanilla, but this is okay since the King of Hearts
      //   is a playing card.
      // - A Card Against Humanity (45) has a unique card back in vanilla.
      // - Suicide King (46) has a red card back in vanilla, but this is okay since the King of
      //   Hearts is a playing card.
      // - Get Out of Jail Free Card (47) has a unique card back in vanilla.
      // - ? Card (48) has a red card back in vanilla.
      card.SubType === CardType.QUESTION_MARK // 48
      // - Dice Shard (49) has a unique graphic in vanilla.
      // - Emergency Contact (50) has a unique card back in vanilla.
      // - Holy Card (51) has a unique card back in vanilla.
      // - Huge Growth (52) has a Magic: The Gathering card back in vanilla.
      // - Ancient Recall (53) has a Magic: The Gathering card back in vanilla.
      // - Era Walk (54) has a Magic: The Gathering card back in vanilla.
      // - Rune Shard (55) has a unique graphic in vanilla.
      // - The Fool? (56) through The World? (77) have reverse card backs.
      // - Cracked Key (78) has a unique graphic in vanilla.
      // - Queen of Hearts (79) has a red card back in vanilla, but this is okay since it is a
      //   playing card.
      // - Wild Card (80) has a unique card back in vanilla.
      // - Soul of Isaac (81) through Soul of Jacob & Esau (97) have unique rune sprites in vanilla.
    ) {
      // Make some cards face-up.
      const sprite = card.GetSprite();
      sprite.ReplaceSpritesheet(
        0,
        `gfx/items/pick ups/cards/${card.SubType}.png`,
      );
      sprite.LoadGraphics();
    }
  }
}
