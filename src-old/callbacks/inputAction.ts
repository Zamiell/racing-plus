/*
//
// InputHook.IS_ACTION_TRIGGERED (1)
//

function InputAction.IsActionTriggeredPillCard() {
  // Local variables
  const game = Game()
  const room = game.GetRoom()
  // (we can't use cached API functions in this callback || } else { the game will crash)
  const roomFrameCount = room.GetFrameCount()

  // Disable using cards/pills if ( we are in the trapdoor animation
  // Disable using cards/pills if ( we are in the room sliding animation
  if ( (
    g.run.trapdoor.state > 0
    || roomFrameCount === 0
  ) ) {
    return false
  }
}

function InputAction.IsActionTriggeredDrop() {
  // Prevent character switching while entering a trapdoor
  if ( g.run.trapdoor.state === 0 ) {
    return
  }

  // Local variables
  const game = Game()
  const player = Isaac.GetPlayer()
  // (we can't use cached API functions in this callback || } else { the game will crash)
  const character = player.GetPlayerType()

  if ( (
    character === PlayerType.PLAYER_THEFORGOTTEN // 16
    || character === PlayerType.PLAYER_THESOUL // 17
  ) ) {
    return false
  }
}

// Prevent opening the console during a race
function InputAction.IsActionTriggeredConsole() {
  if ( g.debug === true ) {
    return
  }

  // Allow usage of the console in custom races
  if ( g.race.status === "in progress" && g.race.rFormat !== "custom" ) {
    return false
  }
}

function InputAction.IsActionTriggeredItem() {
  if ( g.run.spamButtons ) {
    g.sfx.Stop(SoundEffect.SOUND_ISAAC_HURT_GRUNT) // 55
    return true
  }
}

InputAction.IsActionTriggeredFunction = {
  [ButtonAction.ACTION_ITEM] = InputAction.IsActionTriggeredItem, // 9
  [ButtonAction.ACTION_PILLCARD] = InputAction.IsActionTriggeredPillCard, // 10
  [ButtonAction.ACTION_DROP] = InputAction.IsActionTriggeredDrop, // 11
  [ButtonAction.ACTION_MENUCONFIRM] = InputAction.IsActionTriggeredMenuConfirm, // 14
  [ButtonAction.ACTION_CONSOLE] = InputAction.IsActionTriggeredConsole, // 28
}

//
// InputHook.GET_ACTION_VALUE (2)
//

function InputAction.GetActionValueShoot(buttonAction)
  const actionValue

  actionValue = InputAction.KnifeDiagonalFix(buttonAction)
  if ( actionValue !== null ) {
    return actionValue
  }

  actionValue = Samael.GetActionValue(buttonAction)
  if ( actionValue !== null ) {
    return actionValue
  }

  actionValue = Autofire.GetActionValue(buttonAction)
  if ( actionValue !== null ) {
    return actionValue
  }
}

// Fix the bug where diagonal knife throws have a 1-frame window when playing on keyboard (2/2)
function InputAction.KnifeDiagonalFix(buttonAction)
  // Local variables
  const player = Isaac.GetPlayer()
  // (we can't use cached API functions in this callback || } else { the game will crash)

  if ( (
    ! player.HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE) // 114
    || player.HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS) // 168
    // (Epic Fetus is the only thing that overwrites Mom's Knife)
    ||g.length.run.directions < 1
  ) ) {
    return
  }

  const storedDirection = g.run.directions[1]
  if ( (
    (
      buttonAction === ButtonAction.ACTION_SHOOTLEFT // 4
      && storedDirection[1]
      && ! storedDirection[2]
    ) || (
      buttonAction === ButtonAction.ACTION_SHOOTRIGHT // 5
      && storedDirection[2]
      && ! storedDirection[1]
    ) || (
      buttonAction === ButtonAction.ACTION_SHOOTUP // 6
      && storedDirection[3]
      && ! storedDirection[4]
    ) || (
      buttonAction === ButtonAction.ACTION_SHOOTDOWN // 7
      && storedDirection[4]
      && ! storedDirection[3]
    )
  ) ) {
    return 1
  }
}

InputAction.GetActionValueFunction = {
  [ButtonAction.ACTION_SHOOTLEFT] = InputAction.GetActionValueShoot, // 4
  [ButtonAction.ACTION_SHOOTRIGHT] = InputAction.GetActionValueShoot, // 5
  [ButtonAction.ACTION_SHOOTUP] = InputAction.GetActionValueShoot, // 6
  [ButtonAction.ACTION_SHOOTDOWN] = InputAction.GetActionValueShoot, // 7
}
*/
