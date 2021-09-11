export function useItemGenesis(player: EntityPlayer): void {
  if (player.HasCollectible(CollectibleType.COLLECTIBLE_DAMOCLES_PASSIVE)) {
    player.RemoveCollectible(CollectibleType.COLLECTIBLE_DAMOCLES_PASSIVE);
  }
}
