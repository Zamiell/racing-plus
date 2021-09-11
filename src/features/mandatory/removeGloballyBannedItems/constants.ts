export const BANNED_COLLECTIBLES = new Set<CollectibleType>([
  CollectibleType.COLLECTIBLE_MERCURIUS,
  CollectibleType.COLLECTIBLE_TMTRAINER,
]);

export const BANNED_COLLECTIBLES_WITH_VOID = new Set<CollectibleType>([
  CollectibleType.COLLECTIBLE_MEGA_BLAST,
  CollectibleType.COLLECTIBLE_MEGA_MUSH,
]);

export const BANNED_TRINKETS = new Set<TrinketType>([
  TrinketType.TRINKET_KARMA, // Since all Donation Machines are removed, it has no purpose
]);
