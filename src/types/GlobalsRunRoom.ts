export default class GlobalsRunRoom {
  manuallySpawnedPhotos = false;
  showEndOfRunText = false;

  /** Used to keep an item static on Tainted Isaac. Index is the InitSeed of the collectible. */
  stuckItems: LuaTable<int, CollectibleType> = new LuaTable();

  vanillaPhotosLeftToSpawn = 0;
}
