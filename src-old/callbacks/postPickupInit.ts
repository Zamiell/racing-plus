/*

// PickupVariant.PICKUP_TAROTCARD (300)
export function tarotCard(pickup: EntityPickup): void {
  if (
    pickup.SubType === Card.RUNE_BLANK || // 40
    pickup.SubType === Card.RUNE_BLACK // 41
  ) {
    // Give an alternate rune sprite (one that isn't tilted left or right)
    const sprite = pickup.GetSprite();
    sprite.ReplaceSpritesheet(
      0,
      "gfx/items/pick ups/pickup_unique_generic_rune.png",
    );

    // The black rune will now glow black; remove this from the blank rune
    sprite.ReplaceSpritesheet(
      1,
      "gfx/items/pick ups/pickup_unique_generic_rune.png",
    );

    sprite.LoadGraphics();
  } else if (
    pickup.SubType === Card.CARD_CHAOS || // 42
    // Credit Card (43) has a unique card back in vanilla
    pickup.SubType === Card.CARD_RULES || // 44
    // A Card Against Humanity (45) has a unique card back in vanilla
    pickup.SubType === Card.CARD_SUICIDE_KING || // 46
    pickup.SubType === Card.CARD_GET_OUT_OF_JAIL || // 47
    // (Get out of Jail Free Card has a unique card back in vanilla, but this one looks better)
    pickup.SubType === Card.CARD_QUESTIONMARK || // 48
    // Dice Shard (49) has a unique card back in vanilla
    // Emergency Contact (50) has a unique card back in vanilla
    // Holy Card (51) has a unique card back in vanilla
    (pickup.SubType >= Card.CARD_HUGE_GROWTH && // 52
      pickup.SubType <= Card.CARD_ERA_WALK) // 54
  ) {
    // Make some cards face-up
    const sprite = pickup.GetSprite();
    sprite.ReplaceSpritesheet(0, `gfx/cards/${pickup.SubType}.png`);
    sprite.LoadGraphics();
  }
}

*/
