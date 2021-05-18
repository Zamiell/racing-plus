import { DEFAULT_KCOLOR, Vector.Zero } from "../constants";
import g from "../globals";
import * as schoolbag from "../items/schoolbag";
import * as misc from "../misc";
import { CollectibleTypeCustom } from "../types/enums";
import {
  SEASON_8_GOOD_ANGEL_ITEMS,
  SEASON_8_GOOD_DEVIL_ITEMS,
  SEASON_8_PILL_EFFECTS,
  SEASON_8_STARTING_ITEMS,
} from "./constants";
import { ChallengeCustom } from "./enums";

// ModCallbacks.MC_POST_UPDATE (1)
export function postUpdate(): void {
  // Local variables
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.R7_SEASON_8) {
    return;
  }

  checkItemPickupAnimation();
}

function checkItemPickupAnimation() {
  // On every frame, check to see if we are holding an item above our heads
  if (g.p.IsItemQueueEmpty() || g.p.QueuedItem.Item === null) {
    return;
  }

  if (g.p.QueuedItem.Item.Type === ItemType.ITEM_TRINKET) {
    if (!g.season8.touchedTrinkets.includes(g.p.QueuedItem.Item.ID)) {
      g.season8.touchedTrinkets.push(g.p.QueuedItem.Item.ID);
    }
  } else if (
    g.p.QueuedItem.Item.ID !== CollectibleTypeCustom.COLLECTIBLE_CHECKPOINT
  ) {
    if (!g.season8.touchedItems.includes(g.p.QueuedItem.Item.ID)) {
      g.season8.touchedItems.push(g.p.QueuedItem.Item.ID);
      g.season8.starterSprites = [];
      g.season8.devilSprites = [];
      g.season8.angelSprites = [];
    }
  }
}

export function pedestals(pickup: EntityPickup): CollectibleType {
  // Local variables
  const challenge = Isaac.GetChallenge();

  if (
    challenge !== ChallengeCustom.R7_SEASON_8 ||
    !g.season8.touchedItems.includes(pickup.SubType) ||
    pickup.Touched
  ) {
    // Don't do anything special with this item
    return pickup.SubType;
  }

  // This is a "set" drop that we have already touched
  const itemName = g.itemConfig.GetCollectible(pickup.SubType).Name;
  if (
    pickup.SubType === CollectibleType.COLLECTIBLE_CUBE_OF_MEAT &&
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_CUBE_OF_MEAT) &&
    !g.season8.touchedItems.includes(
      CollectibleType.COLLECTIBLE_BALL_OF_BANDAGES,
    )
  ) {
    Isaac.DebugString(
      `Season 8 - Replacing set-drop item "${itemName}" with Ball of Bandages (special case).`,
    );
    return CollectibleType.COLLECTIBLE_BALL_OF_BANDAGES;
  }
  if (
    pickup.SubType === CollectibleType.COLLECTIBLE_BALL_OF_BANDAGES &&
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_BALL_OF_BANDAGES) &&
    !g.season8.touchedItems.includes(CollectibleType.COLLECTIBLE_CUBE_OF_MEAT)
  ) {
    Isaac.DebugString(
      `Season 8 - Replacing set-drop item "${itemName}" with Cube of Meat (special case).`,
    );
    return CollectibleType.COLLECTIBLE_CUBE_OF_MEAT;
  }

  Isaac.DebugString(
    `Season 8 - Replacing set-drop item "${itemName}" with a random item.`,
  );
  return 0;
}

// Called from the "PostItemPickup.InsertTrinket()" function
export function removeTrinket(trinketType: TrinketType): void {
  // Local variables
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.R7_SEASON_8) {
    return;
  }

  if (!g.season8.touchedTrinkets.includes(trinketType)) {
    g.season8.touchedTrinkets.push(trinketType);
  }
}

// ModCallbacks.MC_POST_RENDER (2)
export function postRender(): void {
  // Local variables
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.R7_SEASON_8) {
    return;
  }

  drawRemainingItems();
}

function drawRemainingItems() {
  // Make the text persist for at least 2 seconds after the player presses the map button
  const mapPressed = misc.isActionPressed(ButtonAction.ACTION_MAP);
  if (!mapPressed) {
    return;
  }

  const remainingStarters: CollectibleType[] = [];
  for (const itemID of SEASON_8_STARTING_ITEMS) {
    if (!g.season8.touchedItems.includes(itemID)) {
      remainingStarters.push(itemID);
    }
  }
  const remainingGoodDevilItems: CollectibleType[] = [];
  for (const itemID of SEASON_8_GOOD_DEVIL_ITEMS) {
    if (!g.season8.touchedItems.includes(itemID)) {
      remainingGoodDevilItems.push(itemID);
    }
  }
  const remainingGoodAngelItems: CollectibleType[] = [];
  for (const itemID of SEASON_8_GOOD_ANGEL_ITEMS) {
    if (!g.season8.touchedItems.includes(itemID)) {
      remainingGoodAngelItems.push(itemID);
    }
  }
  const itemsPerRow = 11;

  // Draw stats about the items/trinkets/cards remaining
  const card = g.p.GetCard(0);
  const pill = g.p.GetPill(0);
  const [screenSizeX, screenSizeY] = misc.getScreenSize();

  let x = screenSizeX - 180;
  if (
    g.season8.touchedItems.length >= 100 ||
    g.season8.touchedTrinkets.length >= 100
  ) {
    // The extra digit will run off the right side of the screen
    x -= 10;
  }

  let baseY = screenSizeY - 130;
  if (card !== 0 || pill !== 0) {
    baseY -= 20;
  }
  if (remainingStarters.length > itemsPerRow) {
    baseY -= 20;
  }
  let y = baseY;
  g.font.DrawString("Items touched:", x, y, DEFAULT_KCOLOR, 0, true);
  y += 20;
  g.font.DrawString("Trinkets touched:", x, y, DEFAULT_KCOLOR, 0, true);
  y += 20;
  g.font.DrawString("Cards used:", x, y, DEFAULT_KCOLOR, 0, true);

  y = baseY;
  x += 125;

  // Brittle Bones (549) is the highest item and there are 5 unused item IDs
  const totalNumItemsInThePool = 549 - 5;
  let text;
  text = `${g.season8.touchedItems.length} / ${totalNumItemsInThePool}`;
  g.font.DrawString(text, x, y, DEFAULT_KCOLOR, 0, true);
  y += 20;

  // We subtract 2 instead of 1 because Karma is removed
  const totalNumTrinketsInThePool = TrinketType.NUM_TRINKETS - 2;
  text = `${g.season8.touchedTrinkets.length} / ${totalNumTrinketsInThePool}`;
  g.font.DrawString(text, x, y, DEFAULT_KCOLOR, 0, true);
  y += 20;

  // We subtract 2 instead of 1 because Blank Rune is removed
  const totalNumCards = Card.NUM_CARDS - 2;
  const cardsUsed = totalNumCards - g.season8.remainingCards.length;
  text = `${cardsUsed}  / ${totalNumCards}`;
  g.font.DrawString(text, x, y, DEFAULT_KCOLOR, 0, true);
  y += 20;

  // Draw icons for some important specific items
  const scale = 0.7;
  const baseX = screenSizeX - 235;
  // The item sprites need to be adjusted further down than a line of text would
  const yAdjustment = 23;

  x = baseX;
  text = "Starters:";
  g.font.DrawString(text, x, y, DEFAULT_KCOLOR, 0, true);
  x += 50;
  y += yAdjustment;
  for (let i = 0; i < remainingStarters.length; i++) {
    const itemID = remainingStarters[i];

    if (g.season8.starterSprites[i] === undefined) {
      const starterSprite = Sprite();
      starterSprite.Load("gfx/005.100_collectible.anm2", false);
      const itemConfig = g.itemConfig.GetCollectible(itemID);
      const spriteFilePath = itemConfig.GfxFileName;
      starterSprite.ReplaceSpritesheet(1, spriteFilePath);
      starterSprite.LoadGraphics();
      starterSprite.Scale = Vector(scale, scale);
      starterSprite.SetFrame("Idle", 0);
      g.season8.starterSprites[i] = starterSprite;
    }

    if (i === itemsPerRow + 1) {
      // Split it up into two separate rows
      y += 20;
      x = baseX + 50;
    }

    x += 22 * scale;
    const pos = Vector(x, y);
    g.season8.starterSprites[i].Render(pos, Vector.Zero, Vector.Zero);
  }
  y = y - yAdjustment + 20;

  x = baseX;
  text = "Devil:";
  g.font.DrawString(text, x, y, DEFAULT_KCOLOR, 0, true);
  x += 50;
  y += yAdjustment;
  for (let i = 0; i < remainingGoodDevilItems.length; i++) {
    const itemID = remainingGoodDevilItems[i];

    if (g.season8.devilSprites[i] === undefined) {
      const devilSprite = Sprite();
      devilSprite.Load("gfx/005.100_collectible.anm2", false);
      const itemConfig = g.itemConfig.GetCollectible(itemID);
      const spriteFilePath = itemConfig.GfxFileName;
      devilSprite.ReplaceSpritesheet(1, spriteFilePath);
      devilSprite.LoadGraphics();
      devilSprite.Scale = Vector(scale, scale);
      devilSprite.SetFrame("Idle", 0);
      g.season8.devilSprites[i] = devilSprite;
    }

    x += 22 * scale;
    const pos = Vector(x, y);
    g.season8.devilSprites[i].Render(pos, Vector.Zero, Vector.Zero);
  }
  y = y - yAdjustment + 20;

  x = baseX;
  text = "Angel:";
  g.font.DrawString(text, x, y, DEFAULT_KCOLOR, 0, true);
  x += 50;
  y += yAdjustment;
  for (let i = 0; i < remainingGoodAngelItems.length; i++) {
    const itemID = remainingGoodAngelItems[i];

    if (g.season8.angelSprites[i] === null) {
      const angelSprite = Sprite();
      angelSprite.Load("gfx/005.100_collectible.anm2", false);
      const itemConfig = g.itemConfig.GetCollectible(itemID);
      const spriteFilePath = itemConfig.GfxFileName;
      angelSprite.ReplaceSpritesheet(1, spriteFilePath);
      angelSprite.LoadGraphics();
      angelSprite.Scale = Vector(scale, scale);
      angelSprite.SetFrame("Idle", 0);
      g.season8.angelSprites[i] = angelSprite;
    }
    x += 22 * scale;
    const pos = Vector(x, y);
    g.season8.angelSprites[i].Render(pos, Vector.Zero, Vector.Zero);
  }
}

// ModCallbacks.MC_USE_CARD (5)
export function useCard(card: Card): void {
  // Local variables
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.R7_SEASON_8) {
    return;
  }

  // Remove this card from the card pool
  if (g.season8.remainingCards.includes(card)) {
    misc.removeValueFromArray(card, g.season8.remainingCards);
  }
}

// ModCallbacks.MC_POST_PLAYER_INIT (9)
export function postPlayerInit(): void {
  // Local variables
  const character = g.p.GetPlayerType();
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.R7_SEASON_8) {
    return;
  }

  // We want Eve to start with Whore of Babylon procced, so we adjust the health
  // (the room has not loaded yet, so Whore will be procced in the first room)
  // Alternatively, we could adjust the health in the PostGameStarted/PostUpdate/PostRender callback
  // and then do:
  // 1) g.p.TakeDamage(0, DamageFlag.DAMAGE_FAKE, EntityRef(g.p), 0)
  // 2) g.sfx.Stop(SoundEffect.SOUND_ISAAC_HURT_GRUNT)
  // But this is buggy because the sound will still occasionally play when the game lags,
  // so this solution is better
  if (character === PlayerType.PLAYER_EVE) {
    g.p.AddHearts(-2);
  }
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStartedFirstCharacter(): void {
  // Reset variables
  g.season8.touchedItems = [];
  g.season8.touchedTrinkets = [];
  g.season8.remainingCards = [];
  g.season8.runPillEffects = [];
  g.season8.identifiedPills = [];

  // Fill the card pool with all of the possible cards
  for (let card = 1; card < Card.NUM_CARDS; card++) {
    // Make an exception for Blank Rune, which should be always removed
    if (card !== Card.RUNE_BLANK) {
      g.season8.remainingCards.push(card);
    }
  }

  // Fill the pill pool with all of the possible pill effects
  // (for all 7 characters)
  let seed = g.seeds.GetStartSeed();
  const chosenEffectIndexes: int[] = [];
  for (let i = 0; i < 13; i++) {
    let randomEffectIndex: int;
    do {
      seed = misc.incrementRNG(seed);
      math.randomseed(seed);
      randomEffectIndex = math.random(0, SEASON_8_PILL_EFFECTS.length - 1);
    } while (chosenEffectIndexes.includes(randomEffectIndex));

    chosenEffectIndexes.push(randomEffectIndex);
    const randomEffect = SEASON_8_PILL_EFFECTS[randomEffectIndex];
    g.season8.runPillEffects.push(randomEffect);
  }
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
export function postGameStarted(): void {
  Isaac.DebugString("In the R+7 (Season 8) challenge.");

  // Local variables
  const character = g.p.GetPlayerType();

  // Everyone starts with the Schoolbag in this season
  misc.giveItemAndRemoveFromPools(
    CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM,
  );

  // Do character-specific actions
  // (all of the items are removed from the pools later on)
  switch (character) {
    // 0
    case PlayerType.PLAYER_ISAAC: {
      schoolbag.put(CollectibleType.COLLECTIBLE_D6, -1);
      break;
    }

    // 2
    case PlayerType.PLAYER_CAIN: {
      g.p.AddCollectible(CollectibleType.COLLECTIBLE_MORE_OPTIONS, 0, false);
      g.p.AddSoulHearts(1);
      break;
    }

    // 3
    case PlayerType.PLAYER_JUDAS: {
      g.p.AddHearts(1);
      // We need to touch it to lock in the Bookworm touch
      g.p.AddCollectible(CollectibleType.COLLECTIBLE_BOOK_OF_BELIAL, 0, false);
      g.p.AddCollectible(CollectibleType.COLLECTIBLE_D6, 6, false);
      schoolbag.put(CollectibleType.COLLECTIBLE_BOOK_OF_BELIAL, -1);
      break;
    }

    // 5
    case PlayerType.PLAYER_EVE: {
      schoolbag.put(CollectibleType.COLLECTIBLE_RAZOR_BLADE, -1);
      g.p.AddSoulHearts(1);
      // (one red heart was already taken away in the "postPlayerInit()" function)
      break;
    }

    // 11
    case PlayerType.PLAYER_LAZARUS2: {
      // Make the D6 appear first on the item tracker
      Isaac.DebugString("Removing collectible 214 (Anemic)");
      Isaac.DebugString("Adding collectible 214 (Anemic)");

      g.p.AddCollectible(CollectibleType.COLLECTIBLE_THERES_OPTIONS, 0, false);
      g.p.AddSoulHearts(1);

      break;
    }

    // 12
    case PlayerType.PLAYER_BLACKJUDAS: {
      g.p.AddBlackHearts(3);
      break;
    }

    // 15
    case PlayerType.PLAYER_APOLLYON: {
      schoolbag.put(CollectibleType.COLLECTIBLE_VOID, -1);
      g.p.AddSoulHearts(1);

      // Prevent resetting for Void + Mega Blast
      g.itemPool.RemoveCollectible(
        CollectibleType.COLLECTIBLE_MEGA_SATANS_BREATH,
      );

      break;
    }

    default: {
      break;
    }
  }

  // All of the character's starting items are removed from all pools
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_LUCKY_FOOT);
  g.itemPool.RemoveTrinket(TrinketType.TRINKET_PAPER_CLIP);
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_MORE_OPTIONS);
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_BOOK_OF_BELIAL);
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_WHORE_OF_BABYLON);
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_DEAD_BIRD);
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_RAZOR_BLADE);
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_ANEMIC);
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_THERES_OPTIONS);
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_VOID);

  // Some revival items are removed from all pools (since these characters in in the lineup)
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_JUDAS_SHADOW); // 311
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_LAZARUS_RAGS); // 332

  // Remove previously touched items from pools
  for (const itemID of g.season8.touchedItems) {
    g.itemPool.RemoveCollectible(itemID);
  }

  // Remove previously touched trinkets from pools
  for (const trinketID of g.season8.touchedTrinkets) {
    g.itemPool.RemoveTrinket(trinketID);
  }

  // Remember the pills from the previous run(s)
  g.run.pills = [...g.season8.identifiedPills];
  for (const pill of g.run.pills) {
    g.itemPool.IdentifyPill(pill.color);
  }
}

// ModCallbacks.MC_GET_CARD (20)
export function getCard(
  rng: RNG,
  card: Card,
  includePlayingCards: boolean,
  includeRunes: boolean,
  onlyRunes: boolean,
): Card | null {
  // Local variables
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.R7_SEASON_8) {
    return null;
  }

  if (g.season8.remainingCards.includes(card)) {
    // They have not used this card/rune yet
    return card;
  }

  // They have used this card/rune, so we need to pick a new card/rune ID
  // First, handle the case of only runes (e.g. Rune Bag)
  if (onlyRunes) {
    return getCardRune(rng);
  }

  // Second, handle the case of a random card drop
  // (this could be random tarot cards, or random tarot cards + random playing cards,
  // or random tarot cards + random playing cards + random runes, etc.)
  return getCardAny(rng, includePlayingCards, includeRunes);
}

function getCardRune(rng: RNG) {
  // Make a list of the remaining runes in the pool
  const remainingRunes: Card[] = [];
  for (let rune = Card.RUNE_HAGALAZ; rune <= Card.RUNE_BLACK; rune++) {
    if (g.season8.remainingCards.includes(rune)) {
      remainingRunes.push(rune);
    }
  }

  if (remainingRunes.length === 0) {
    // All of the runes are used, so delete the rune drop
    return Card.CARD_NULL;
  }

  // Return a random rune
  math.randomseed(rng.GetSeed());
  const randomRuneIndex = math.random(0, remainingRunes.length - 1);
  const randomRune = remainingRunes[randomRuneIndex];
  return randomRune;
}

function getCardAny(
  rng: RNG,
  includePlayingCards: boolean,
  includeRunes: boolean,
) {
  const remainingCards: Card[] = [];
  for (let card = Card.CARD_FOOL; card <= Card.CARD_WORLD; card++) {
    if (g.season8.remainingCards.includes(card)) {
      remainingCards.push(card);
    }
  }

  if (includePlayingCards) {
    for (let card = Card.CARD_CLUBS_2; card <= Card.CARD_JOKER; card++) {
      if (g.season8.remainingCards.includes(card)) {
        remainingCards.push(card);
      }
    }
    // (skip over the runes)
    for (let card = Card.CARD_CHAOS; card <= Card.CARD_ERA_WALK; card++) {
      if (g.season8.remainingCards.includes(card)) {
        remainingCards.push(card);
      }
    }
  }

  if (includeRunes) {
    for (let card = Card.RUNE_HAGALAZ; card <= Card.RUNE_BLACK; card++) {
      if (g.season8.remainingCards.includes(card)) {
        remainingCards.push(card);
      }
    }
  }

  if (remainingCards.length === 0) {
    // All of the cards are used, so delete the card drop
    return Card.CARD_NULL;
  }

  // Return a random card
  math.randomseed(rng.GetSeed());
  const randomCardIndex = math.random(0, remainingCards.length - 1);
  const randomCard = remainingCards[randomCardIndex];
  return randomCard;
}

// ModCallbacks.MC_POST_PICKUP_UPDATE (35)
// PickupVariant.PICKUP_TAROTCARD (300)
export function postPickupUpdateTarotCard(pickup: EntityPickup): void {
  // Local variables
  const roomFrameCount = g.r.GetFrameCount();
  const isFirstVisit = g.r.IsFirstVisit();
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.R7_SEASON_8) {
    return;
  }

  // If we just re-entered a room that we have previously been in, ignore all cards
  if (!isFirstVisit && pickup.FrameCount === 1 && roomFrameCount === 1) {
    return;
  }

  // We only care about freshly spawned cards
  // (we cannot use the PostPickupInit callback because the position is yet not initialized there)
  if (
    pickup.FrameCount !== 1 ||
    // We need to ignore cards that the player drops,
    // or else they would be able to infinitely spawn new cards
    pickup.SpawnerType === EntityType.ENTITY_PLAYER
  ) {
    return;
  }

  // Check to make sure that this card has not already been used
  // e.g. "set" drops, like ? Card and Black Rune in Devil Rooms
  if (!g.season8.remainingCards.includes(pickup.SubType)) {
    pickup.Remove();

    // Spawn a random card in its place
    const newCard = g.g
      .Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_TAROTCARD,
        pickup.Position,
        pickup.Velocity,
        pickup.SpawnerEntity,
        0,
        pickup.InitSeed,
      )
      .ToPickup();

    // If it is a shop item, we need to copy over the shop properties
    // so that the replaced card is not automatically bought
    if (newCard !== null) {
      newCard.Price = pickup.Price;
      newCard.ShopItemId = pickup.ShopItemId;
    }
  }
}

// ModCallbacks.MC_POST_PICKUP_UPDATE (35)
// PickupVariant.PICKUP_TRINKET (350)
export function postPickupUpdateTrinket(pickup: EntityPickup): void {
  // Local variables
  const roomFrameCount = g.r.GetFrameCount();
  const isFirstVisit = g.r.IsFirstVisit();
  const challenge = Isaac.GetChallenge();

  if (challenge !== ChallengeCustom.R7_SEASON_8) {
    return;
  }

  // We only care about freshly spawned trinkets
  // (we cannot use the PostPickupInit callback because the position is yet not initialized there)
  if (pickup.FrameCount !== 1) {
    return;
  }

  // Ignore trinkets that the player drops
  if (pickup.SpawnerType === EntityType.ENTITY_PLAYER) {
    // 1
    return;
  }

  // Don't do anything if we are returning to a room with a previously dropped trinket
  if (roomFrameCount === 1 && !isFirstVisit) {
    return;
  }

  // Check to make sure that this trinket has not already been touched
  // e.g. "set" drops, like Left Hand from Ultra Pride
  if (g.season8.touchedTrinkets.includes(pickup.SubType)) {
    pickup.Remove();

    // Spawn a random trinket in its place
    g.g.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_TRINKET,
      pickup.Position,
      pickup.Velocity,
      pickup.SpawnerEntity,
      0,
      pickup.InitSeed,
    );
  }
}

// ModCallbacks.MC_GET_PILL_EFFECT (65)
export function getPillEffect(
  _pillEffect: PillEffect,
  pillColor: PillColor,
): PillEffect | null {
  // Local variables
  const challenge = Isaac.GetChallenge();

  if (challenge === ChallengeCustom.R7_SEASON_8) {
    return g.season8.runPillEffects[pillColor];
  }

  return null;
}

export function PHD(): void {
  // The player just picked up PHD or Virgo, so we may need to swap out some pill effects
  // (all of the pill effects were chosen at the beginning of the first character)
  for (let i = 0; i < g.season8.runPillEffects.length; i++) {
    const effect = g.season8.runPillEffects[i];

    switch (effect) {
      // 6
      case PillEffect.PILLEFFECT_HEALTH_DOWN: {
        g.season8.runPillEffects[i] = PillEffect.PILLEFFECT_HEALTH_UP;
        break;
      }

      // 13
      case PillEffect.PILLEFFECT_SPEED_DOWN: {
        g.season8.runPillEffects[i] = PillEffect.PILLEFFECT_SPEED_UP;
        break;
      }

      // 15
      case PillEffect.PILLEFFECT_TEARS_DOWN: {
        g.season8.runPillEffects[i] = PillEffect.PILLEFFECT_TEARS_UP;
        break;
      }

      default: {
        break;
      }
    }
  }
}
