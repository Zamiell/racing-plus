// Note: Position, SpawnerType, SpawnerVariant, and Price are not initialized yet in this callback

import * as bigChestFunctions from "../bigChest";
import { inSpeedrun } from "../challenges/misc";
import { Vector.Zero } from "../constants";
import g from "../globals";
import { EffectVariantCustom } from "../types/enums";

// PickupVariant.PICKUP_COIN (20)
export function coin(pickup: EntityPickup): void {
  if (pickup.SubType !== CoinSubType.COIN_STICKYNICKEL) {
    return;
  }

  const sprite = pickup.GetSprite();
  const data = pickup.GetData();

  // Spawn the effect
  const stickyEffect = Isaac.Spawn(
    EntityType.ENTITY_EFFECT,
    EffectVariantCustom.STICKY_NICKEL,
    0,
    pickup.Position,
    Vector.Zero,
    pickup,
  );
  const stickySprite = stickyEffect.GetSprite();
  const stickyData = stickyEffect.GetData();

  // Get what animation to use
  let animation = "Idle";
  if (sprite.IsPlaying("Appear")) {
    animation = "Appear";
  }
  stickySprite.Play(animation, true);

  // Set up the data
  data.WasStickyNickel = true;
  stickyData.StickyNickel = pickup;

  // Make it render below most things
  stickyEffect.RenderZOffset = -10000;
}

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

// PickupVariant.PICKUP_BIGCHEST (340)
export function bigChest(pickup: EntityPickup): void {
  bigChestFunctions.postPickupInit(pickup);
}

// PickupVariant.PICKUP_TROPHY (370)
export function trophy(pickup: EntityPickup): void {
  // Local variables
  const centerPos = g.r.GetCenterPos();

  // Do nothing if we are not on a custom speedrun challenge
  // (otherwise we would be deleting the trophy in a normal challenge)
  if (!inSpeedrun()) {
    return;
  }

  // It can be unpredictable whether a big chest or a trophy will spawn;
  // so funnel all decision making through the Big Chest code
  Isaac.DebugString("Vanilla trophy detected; replacing it with a Big Chest.");
  Isaac.Spawn(
    EntityType.ENTITY_PICKUP,
    PickupVariant.PICKUP_BIGCHEST,
    0,
    centerPos,
    Vector.Zero,
    null,
  );
  pickup.Remove();
}

export function checkSpikedChestUnavoidable(pickup: EntityPickup): void {
  // Local variables
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const roomData = g.l.GetCurrentRoomDesc().Data;

  // Check to see if we are in a specific room where a Spiked Chest or Mimic will cause unavoidable
  // damage
  let roomDataVariant = roomData.Variant;
  while (roomDataVariant >= 10000) {
    // The 3 flipped versions of room #1 would be #10001, #20001, and #30001
    roomDataVariant -= 10000;
  }

  // roomData.StageID always returns 0 for some reason,
  // so just use stage and stageType as a workaround
  if (
    // Basement
    ((stage === 1 || stage === 2) &&
      stageType === 0 &&
      roomDataVariant === 716) ||
    ((stage === 1 || stage === 2) &&
      stageType === 0 &&
      roomDataVariant === 721) ||
    // Cellar
    ((stage === 1 || stage === 2) &&
      stageType === 1 &&
      roomDataVariant === 716) ||
    ((stage === 1 || stage === 2) &&
      stageType === 1 &&
      roomDataVariant === 721) ||
    // Burning Basement
    ((stage === 1 || stage === 2) &&
      stageType === 2 &&
      roomDataVariant === 716) ||
    ((stage === 1 || stage === 2) &&
      stageType === 2 &&
      roomDataVariant === 721) ||
    // Caves
    ((stage === 3 || stage === 4) &&
      stageType === 0 &&
      roomDataVariant === 12) ||
    ((stage === 3 || stage === 4) &&
      stageType === 0 &&
      roomDataVariant === 19) ||
    ((stage === 3 || stage === 4) &&
      stageType === 0 &&
      roomDataVariant === 90) ||
    ((stage === 3 || stage === 4) &&
      stageType === 0 &&
      roomDataVariant === 119) ||
    ((stage === 3 || stage === 4) &&
      stageType === 0 &&
      roomDataVariant === 125) ||
    ((stage === 3 || stage === 4) &&
      stageType === 0 &&
      roomDataVariant === 244) ||
    ((stage === 3 || stage === 4) &&
      stageType === 0 &&
      roomDataVariant === 518) ||
    ((stage === 3 || stage === 4) &&
      stageType === 0 &&
      roomDataVariant === 519) ||
    // Catacombs
    ((stage === 3 || stage === 4) &&
      stageType === 1 &&
      roomDataVariant === 19) ||
    ((stage === 3 || stage === 4) &&
      stageType === 1 &&
      roomDataVariant === 90) ||
    ((stage === 3 || stage === 4) &&
      stageType === 1 &&
      roomDataVariant === 119) ||
    ((stage === 3 || stage === 4) &&
      stageType === 1 &&
      roomDataVariant === 285) ||
    ((stage === 3 || stage === 4) &&
      stageType === 1 &&
      roomDataVariant === 518) ||
    // Flooded Caves
    ((stage === 3 || stage === 4) &&
      stageType === 2 &&
      roomDataVariant === 12) ||
    ((stage === 3 || stage === 4) &&
      stageType === 2 &&
      roomDataVariant === 19) ||
    ((stage === 3 || stage === 4) &&
      stageType === 2 &&
      roomDataVariant === 90) ||
    ((stage === 3 || stage === 4) &&
      stageType === 1 &&
      roomDataVariant === 119) ||
    ((stage === 3 || stage === 4) &&
      stageType === 2 &&
      roomDataVariant === 125) ||
    ((stage === 3 || stage === 4) &&
      stageType === 2 &&
      roomDataVariant === 244) ||
    ((stage === 3 || stage === 4) &&
      stageType === 2 &&
      roomDataVariant === 518) ||
    ((stage === 3 || stage === 4) &&
      stageType === 2 &&
      roomDataVariant === 519) ||
    ((stage === 3 || stage === 4) &&
      stageType === 2 &&
      roomDataVariant === 1008) ||
    ((stage === 3 || stage === 4) &&
      stageType === 2 &&
      roomDataVariant === 1014) ||
    // Necropolis
    ((stage === 5 || stage === 6) &&
      stageType === 1 &&
      roomDataVariant === 936) ||
    ((stage === 5 || stage === 6) &&
      stageType === 1 &&
      roomDataVariant === 973) ||
    // Womb
    ((stage === 7 || stage === 8) &&
      stageType === 0 &&
      roomDataVariant === 458) ||
    ((stage === 7 || stage === 8) &&
      stageType === 0 &&
      roomDataVariant === 489) ||
    // Utero
    ((stage === 7 || stage === 8) &&
      stageType === 1 &&
      roomDataVariant === 458) ||
    ((stage === 7 || stage === 8) &&
      stageType === 1 &&
      roomDataVariant === 489) ||
    // Scarred Womb
    ((stage === 7 || stage === 8) &&
      stageType === 2 &&
      roomDataVariant === 458) ||
    ((stage === 7 || stage === 8) && stageType === 2 && roomDataVariant === 489)
  ) {
    // Change it to a normal chest
    pickup.Variant = 50;
    pickup.GetSprite().Load("gfx/005.050_chest.anm2", true);
    pickup.GetSprite().Play("Appear", false);
    // (we have to play an animation for the new sprite to actually appear)
    Isaac.DebugString(
      "Replaced a Spiked Chest / Mimic with a normal chest (for an unavoidable damage room).",
    );

    // Mark it so that other mods are aware of the replacement
    const data = pickup.GetData();
    data.unavoidableReplacement = true;
  }
}
