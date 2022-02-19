import { season2IsActionTriggeredConsole } from "../season2/callbacks/inputAction";

// InputHook.IS_ACTION_TRIGGERED (1)
// ButtonAction.ACTION_CONSOLE (28)
export function speedrunIsActionTriggeredConsole(): boolean | void {
  return season2IsActionTriggeredConsole();
}
