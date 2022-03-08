export enum RepentanceDoorState {
  INITIAL,
  UNLOCKED,

  /**
   * Doors to the Mines can be half-bombs, but we don't need to track this. (The game appears to
   * track it properly without having to do anything additional.)
   */
  // HALF_BOMBED,

  /**
   * Doors to Mausoleum can be half-donated-to, but we don't need to track this. (The game appears
   * to track it properly without having to do anything additional.)
   */
  // HALF_DONATED_TO,
}
