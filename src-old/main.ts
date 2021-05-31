/*
// MinimapAPI init
if (MinimapAPI !== undefined) {
  const customIcons = Sprite();
  customIcons.Load("gfx/pills/custom_icons.anm2", true);
  // Getting rid of the ugly white pixel
  MinimapAPI.AddIcon(
    "PillOrangeOrange",
    customIcons,
    "CustomIconPillOrangeOrange",
    0,
  ); // 3
  // Red dots / red --> full red
  MinimapAPI.AddIcon(
    "PillReddotsRed",
    customIcons,
    "CustomIconPillReddotsRed",
    0,
  ); // 5
  // Pink red / red --> white / red
  MinimapAPI.AddIcon("PillPinkRed", customIcons, "CustomIconPillPinkRed", 0); // 6
  // Getting rid of the ugly white pixel
  MinimapAPI.AddIcon(
    "PillYellowOrange",
    customIcons,
    "CustomIconPillYellowOrange",
    0,
  ); // 8
  // White dots / white --> full white dots
  MinimapAPI.AddIcon(
    "PillOrangedotsWhite",
    customIcons,
    "CustomIconPillOrangedotsWhite",
    0,
  ); // 9
  // Cleaner sprite for Emergency Contact (5.300.50)
  MinimapAPI.AddIcon("MomsContract", customIcons, "CustomIconMomsContract", 0);
  // New sprite for Blank Rune (5.300.40)
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
  // New sprite for Black Rune (5.300.41)
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
  // New sprite for Rules Card (5.300.44)
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
  // New sprite for Suicide King (5.300.46)
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
  // New sprite for ? Card (5.300.48)
  MinimapAPI.AddIcon("QuestionMark", customIcons, "CustomIconQuestionMark", 0); // 48
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
*/
