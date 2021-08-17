/*
//
// InputHook.IS_ACTION_TRIGGERED (1)
//

function InputAction.IsActionTriggeredDrop() {
  // Prevent character switching while entering a trapdoor
  if ( g.run.trapdoor.state === 0 ) {
    return
  }

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

  actionValue = Autofire.GetActionValue(buttonAction)
  if ( actionValue !== null ) {
    return actionValue
  }
}

InputAction.GetActionValueFunction = {
  [ButtonAction.ACTION_SHOOTLEFT] = InputAction.GetActionValueShoot, // 4
  [ButtonAction.ACTION_SHOOTRIGHT] = InputAction.GetActionValueShoot, // 5
  [ButtonAction.ACTION_SHOOTUP] = InputAction.GetActionValueShoot, // 6
  [ButtonAction.ACTION_SHOOTDOWN] = InputAction.GetActionValueShoot, // 7
}
*/
