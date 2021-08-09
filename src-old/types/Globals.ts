/*
export default class Globals {
  speedrun = {
    sprites: [] as Sprite[], // Reset at the beginning of a new run (in the PostGameStarted callback)
    characterNum: 1, // Reset explicitly from a long-reset and on the first reset after a finish
    startedTime: 0, // Reset explicitly if we are on the first character
    startedFrame: 0, // Reset explicitly if we are on the first character
    // Reset explicitly if we are on the first character and when we touch a Checkpoint
    startedCharTime: 0,
    characterRunTimes: [] as int[], // Reset explicitly if we are on the first character
    finished: false, // Reset at the beginning of every run
    finishedTime: 0, // Reset at the beginning of every run
    finishedFrames: 0, // Reset at the beginning of every run
    fastReset: false, // Reset explicitly when we detect a fast reset
    // Reset after we touch the checkpoint and at the beginning of a new run
    spawnedCheckpoint: false,
    fadeFrame: 0, // Reset after we touch the checkpoint and at the beginning of a new run
    // Reset after we execute the "restart" command and at the beginning of a new run
    resetFrame: 0,
    liveSplitReset: false,
  };

  changeCharOrder = {
    phase: ChangeCharOrderPhase.SEASON_SELECT, // Reset when we enter the room
    // Reset when we enter the room
    seasonChosen: null as keyof typeof CHANGE_CHAR_ORDER_POSITIONS | null,
    createButtonsFrame: 0, // Reset when we enter the room
    charOrder: [] as Array<PlayerType | PlayerTypeCustom>, // Reset when we enter the room
    itemOrder: [] as CollectibleType[], // Reset when we enter the room
    sprites: {
      // Reset in the PostGameStarted callback
      seasons: new Map<string, Sprite>(),
      characters: [] as Sprite[],
      items: [] as Sprite[],
    },
  };

  RNGCounter = {
    // Seeded at the beginning of the run
    bookOfSin: 0, // 97
    guppysCollar: 0, // 212
    butterBean: 0, // 294
  };
}
*/
