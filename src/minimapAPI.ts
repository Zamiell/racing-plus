export function initMinimapAPI(): void {
  if (MinimapAPI === undefined) {
    return;
  }

  const customIcons = Sprite();
  customIcons.Load("gfx/minimapAPI/custom_icons.anm2", true);

  initMinimapAPIPills(customIcons);
  initMinimapAPICards(customIcons);
}

function initMinimapAPIPills(customIcons: Sprite) {
  if (MinimapAPI === undefined) {
    return;
  }

  // PillColor.PILL_ORANGE_ORANGE (3)
  // Getting rid of the ugly white pixel
  MinimapAPI.AddIcon(
    "PillOrangeOrange",
    customIcons,
    "CustomIconPillOrangeOrange",
    0,
  );

  // PillColor.PILL_REDDOTS_RED (5)
  // Red dots / red --> full red
  MinimapAPI.AddIcon(
    "PillReddotsRed",
    customIcons,
    "CustomIconPillReddotsRed",
    0,
  );

  // PillColor.PILL_PINK_RED (6)
  // Pink red / red --> white / red
  MinimapAPI.AddIcon("PillPinkRed", customIcons, "CustomIconPillPinkRed", 0);

  // PillColor.PILL_YELLOW_ORANGE (8)
  // Getting rid of the ugly white pixel
  MinimapAPI.AddIcon(
    "PillYellowOrange",
    customIcons,
    "CustomIconPillYellowOrange",
    0,
  );

  // PillColor.PILL_ORANGEDOTS_WHITE (9)
  // Orange dots / white --> full white dots
  MinimapAPI.AddIcon(
    "PillOrangedotsWhite",
    customIcons,
    "CustomIconPillOrangedotsWhite",
    0,
  );
}

function initMinimapAPICards(customIcons: Sprite) {
  if (MinimapAPI === undefined) {
    return;
  }

  // Card.RUNE_BLANK (40)
  // New sprite for Blank Rune
  MinimapAPI.AddIcon("BlankRune", customIcons, "CustomIconBlankRune", 0);
  MinimapAPI.AddPickup(
    "BlankRune",
    "BlankRune",
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_TAROTCARD,
    Card.RUNE_BLANK,
    MinimapAPI.PickupNotCollected,
    "runes",
    1200,
  );

  // Card.RUNE_BLACK (41)
  // New sprite for Black Rune
  MinimapAPI.AddIcon("BlackRune", customIcons, "CustomIconBlackRune", 0);
  MinimapAPI.AddPickup(
    "BlackRune",
    "BlackRune",
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_TAROTCARD,
    Card.RUNE_BLACK,
    MinimapAPI.PickupNotCollected,
    "runes",
    1200,
  );

  // Card.CARD_RULES (44)
  // New sprite for Rules Card
  MinimapAPI.AddIcon("Rules", customIcons, "CustomIconRules", 0);
  MinimapAPI.AddPickup(
    "Rules",
    "Rules",
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_TAROTCARD,
    Card.CARD_RULES,
    MinimapAPI.PickupNotCollected,
    "cards",
    1200,
  );

  // Card.CARD_SUICIDE_KING (46)
  // New sprite for Suicide King
  MinimapAPI.AddIcon("SuicideKing", customIcons, "CustomIconSuicideKing", 0);
  MinimapAPI.AddPickup(
    "SuicideKing",
    "SuicideKing",
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_TAROTCARD,
    Card.CARD_SUICIDE_KING,
    MinimapAPI.PickupNotCollected,
    "cards",
    1200,
  );

  // Card.CARD_QUESTIONMARK (48)
  // New sprite for ? Card
  MinimapAPI.AddIcon("QuestionMark", customIcons, "CustomIconQuestionMark", 0);
  MinimapAPI.AddPickup(
    "QuestionMark",
    "QuestionMark",
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_TAROTCARD,
    Card.CARD_QUESTIONMARK,
    MinimapAPI.PickupNotCollected,
    "cards",
    1200,
  );
}
