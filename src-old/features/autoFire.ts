/*
export function toggle(): void {
  // Local variables
  const isaacFrameCount = Isaac.GetFrameCount();

  // Only allow the input to be pressed once every 30 frames (1 second)
  if (g.run.autofireChangeFrame + 30 >= isaacFrameCount) {
    return;
  }

  g.run.autofire = !g.run.autofire;
  g.run.autofireChangeFrame = isaacFrameCount;
  const enabled = g.run.autofire ? "Enabled" : "Disabled";
  g.run.streakText = `${enabled} autofire.`;
  g.run.streakFrame = isaacFrameCount;
}

// We have to return a value from the "isActionPressed()" and the "getActionValue()" callbacks in
// order for Anti-Gravity autofire to work
export function isActionPressed(): boolean | null {
  if (!g.run.autofire) {
    return null;
  }

  // Local variables
  const player = Isaac.GetPlayer();
  // (we can't use cached API functions in this callback or else the game will crash)
  if (player === null) {
    return null;
  }

  if (
    (!player.HasCollectible(CollectibleType.COLLECTIBLE_ANTI_GRAVITY) && // 222
      !player.HasCollectible(CollectibleType.COLLECTIBLE_NUMBER_TWO)) || // 378
    !isTearBuild(player)
  ) {
    return null;
  }

  if (g.g.GetFrameCount() % 2 === 0) {
    return false;
  }

  return null;
}

function isTearBuild(player: EntityPlayer) {
  return (
    !player.HasCollectible(CollectibleType.COLLECTIBLE_DR_FETUS) && // 52
    !player.HasCollectible(CollectibleType.COLLECTIBLE_TECHNOLOGY) && // 68
    !player.HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE) && // 114
    !player.HasCollectible(CollectibleType.COLLECTIBLE_BRIMSTONE) && // 118
    !player.HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS) && // 168
    !player.HasCollectible(CollectibleType.COLLECTIBLE_TECH_X) // 395
  );
}

// We have to return a value from the "isActionPressed()" and the "getActionValue()" callbacks in
// order for Anti-Gravity autofire to work
export function getActionValue(_buttonAction: ButtonAction): int | null {
  if (!g.run.autofire) {
    return null;
  }

  // Local variables
  const player = Isaac.GetPlayer();
  // (we can't use cached API functions in this callback or else the game will crash)
  if (player === null) {
    return null;
  }

  if (!player.HasCollectible(CollectibleType.COLLECTIBLE_ANTI_GRAVITY)) {
    return null;
  }

  if (g.g.GetFrameCount() % 2 === 0) {
    return 0;
  }

  return null;
}
*/
