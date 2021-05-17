import { ChallengeCustom } from "../challenges/constants";
import g from "../globals";
import * as misc from "../misc";

// ModCallbacks.MC_USE_PILL (10)
export function main(pillEffect: PillEffect): void {
  // Display the streak text (because Racing+ removes the vanilla streak text)
  g.run.streakText = g.itemConfig.GetPillEffect(pillEffect).Name;
  g.run.streakFrame = Isaac.GetFrameCount();

  // See if we have already used this particular pill color on this run
  const pillColor = g.p.GetPill(0);
  if (pillColor === PillColor.PILL_NULL) {
    // A mod may have manually used a pill with a null color
    return;
  }
  for (const pill of g.run.pills) {
    if (pill.color === pillColor) {
      return;
    }
  }

  usedNewPill(pillColor, pillEffect);
}

function usedNewPill(pillColor: PillColor, pillEffect: PillEffect) {
  // Local variables
  const challenge = Isaac.GetChallenge();

  // This is the first time we have used this pill, so keep track of the pill color and effect
  const pillDescription = {
    color: pillColor,
    effect: pillEffect,
    sprite: Sprite(),
  };

  // Preload the graphics for this pill color so that we can display it if the player presses the
  // map button
  pillDescription.sprite.Load(`gfx/pills/pill${pillColor}.anm2`, true);
  pillDescription.sprite.SetFrame("Default", 0);
  g.run.pills.push(pillDescription);
  if (challenge === ChallengeCustom.R7_SEASON_8) {
    g.season8.identifiedPills.push(pillDescription);
  }
}

// PillEffect.PILLEFFECT_HEALTH_DOWN (6)
export function healthDown(): void {
  // Local variables
  const hearts = g.p.GetHearts();
  const soulHearts = g.p.GetSoulHearts();
  const blackHearts = g.p.GetBlackHearts();
  const boneHearts = g.p.GetBoneHearts();

  // Fix the bug where using a Health Down pill in season 8 will not kill you
  if (
    hearts === 0 &&
    soulHearts === 0 &&
    blackHearts === 0 &&
    boneHearts === 0
  ) {
    g.p.Kill();
  }
}

// PillEffect.PILLEFFECT_HEALTH_UP (7)
export function healthUp(): void {
  g.run.keeper.usedHealthUpPill = true;
  g.p.AddCacheFlags(CacheFlag.CACHE_RANGE); // 8
  g.p.EvaluateItems();
}

// PillEffect.PILLEFFECT_TELEPILLS (19)
export function telepills(): void {
  // Local variables
  const stage = g.l.GetStage();
  const rooms = g.l.GetRooms();

  // It is not possible to teleport to I AM ERROR rooms and Black Markets on The Chest / Dark Room
  let insertErrorRoom = false;
  let insertBlackMarket = false;
  if (stage !== 11) {
    insertErrorRoom = true;

    // There is a 2% chance have a Black Market inserted into the list of possibilities
    // (according to blcd)
    g.RNGCounter.Telepills = misc.incrementRNG(g.RNGCounter.Telepills);
    math.randomseed(g.RNGCounter.Telepills);
    const blackMarketRoll = math.random(1, 100);
    if (blackMarketRoll <= 2) {
      insertBlackMarket = true;
    }
  }

  // Find the indexes for all of the room possibilities
  const roomIndexes: int[] = [];
  for (let i = 0; i < rooms.Size; i++) {
    const room = rooms.Get(i); // This is 0 indexed
    if (room === null) {
      continue;
    }

    // We need to use SafeGridIndex instead of GridIndex because we will crash when teleporting to
    // L rooms otherwise
    roomIndexes.push(room.SafeGridIndex);
  }
  if (insertErrorRoom) {
    roomIndexes.push(GridRooms.ROOM_ERROR_IDX);
  }
  if (insertBlackMarket) {
    roomIndexes.push(GridRooms.ROOM_BLACK_MARKET_IDX);
  }

  // Get a random room index
  g.RNGCounter.Telepills = misc.incrementRNG(g.RNGCounter.Telepills);
  math.randomseed(g.RNGCounter.Telepills);
  const randomIndex = math.random(0, roomIndexes.length - 1);
  const gridIndex = roomIndexes[randomIndex];

  // Mark to potentially reposition the player (if they appear at a non-existent entrance)
  g.run.usedTeleport = true;

  // You have to set LeaveDoor before every teleport or else it will send you to the wrong room
  g.l.LeaveDoor = -1;

  g.g.StartRoomTransition(
    gridIndex,
    Direction.NO_DIRECTION,
    RoomTransition.TRANSITION_TELEPORT,
  );

  // We don't want to display the "use" animation, we just want to instantly teleport
  // Pills are hard coded to queue the "use" animation, so stop it on the next frame
  g.run.usedTelepills = true;
}

// PillEffect.PILLEFFECT_LARGER (32)
export function oneMakesYouLarger(): void {
  // Allow this pill to cancel collectible pickup animation
  g.p.AnimateSad();
}

// PillEffect.PILLEFFECT_SMALLER (33)
export function oneMakesYouSmaller(): void {
  // Allow this pill to cancel collectible pickup animation
  g.p.AnimateHappy();
}

// PillEffect.PILLEFFECT_INFESTED_EXCLAMATION (34)
export function infestedExclamation(): void {
  // Allow this pill to cancel collectible pickup animation
  g.p.AnimateHappy();
}

// PillEffect.PILLEFFECT_INFESTED_QUESTION (35)
export function infestedQuestion(): void {
  // Allow this pill to cancel collectible pickup animation
  g.p.AnimateHappy();
}

// PillEffect.PILLEFFECT_POWER (36)
export function powerPill(): void {
  // Allow this pill to cancel collectible pickup animation
  g.p.AnimateHappy();
}

// PillEffect.PILLEFFECT_RETRO_VISION (37)
export function retroVision(): void {
  // Allow this pill to cancel collectible pickup animation
  g.p.AnimateSad();
}

// PillEffect.PILLEFFECT_HORF (44)
export function horf(): void {
  // Allow this pill to cancel collectible pickup animation
  g.p.AnimateSad();
}
