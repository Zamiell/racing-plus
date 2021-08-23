/*
//
// InputHook.GET_ACTION_VALUE (2)
//

function InputAction.GetActionValueShoot(buttonAction)
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
