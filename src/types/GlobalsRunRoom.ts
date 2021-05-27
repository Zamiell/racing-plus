export default class GlobalsRunRoom {
  // ----------------
  // Custom Callbacks
  // ----------------

  clear: boolean;

  fastClear2 = {
    itLivesDead: false,
  };

  fastTravel = {
    crawlspace: {
      /**
       * Used to prevent double teleporting, since it takes a frame for the "StartRoomTransition"
       * method to take effect.
       */
      amTeleporting: false,
    },
  };

  constructor(clear: boolean) {
    this.clear = clear;
  }
}
