export enum SeededDeathState {
  DISABLED,

  /**
   * After we return true from the PreCustomRevive callback, the custom callback will give us a 1-Up
   * and then we have to wait for the PostCustomRevive callback to fire.
   *
   * Between these two events, it is possible to perform a room transition (e.g. if we die via
   * running into a Curse Room door at full speed). However, we don't need to handle this case,
   * since the death animation will happen immediately after the new room is entered. (And during
   * this time, the player is not able to move.)
   *
   * As soon as  we enter a new room and the 1-Up collectible is taken away by the game, there is a
   * short delay before the player holds the 1-Up collectible over their head and the
   * PostCustomRevive callback is fired. We first set the "Appear" animation and apply the ghost
   * fade here.
   */
  WAITING_FOR_POST_CUSTOM_REVIVE,

  /**
   * Once the PostCustomRevive callback fires, we re-apply the "Appear" animation again to cancel
   * the 1-Up animation. This state lasts until the "Appear" animation has ended.
   */
  FETAL_POSITION,

  GHOST_FORM,
}
